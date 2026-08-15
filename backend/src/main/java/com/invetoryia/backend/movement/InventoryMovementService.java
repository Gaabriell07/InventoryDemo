package com.invetoryia.backend.movement;

import com.invetoryia.backend.category.CategoryService;
import com.invetoryia.backend.common.exception.BadRequestException;
import com.invetoryia.backend.common.exception.ResourceNotFoundException;
import com.invetoryia.backend.movement.dto.MovementRequestDto;
import com.invetoryia.backend.movement.dto.MovementResponseDto;
import com.invetoryia.backend.product.Product;
import com.invetoryia.backend.product.ProductRepository;
import com.invetoryia.backend.product.dto.ProductResponseDto;
import com.invetoryia.backend.supplier.Supplier;
import com.invetoryia.backend.supplier.SupplierRepository;
import com.invetoryia.backend.supplier.SupplierService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InventoryMovementService {

    private final InventoryMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final CategoryService categoryService;
    private final SupplierService supplierService;

    public InventoryMovementService(InventoryMovementRepository movementRepository,
                                    ProductRepository productRepository,
                                    SupplierRepository supplierRepository,
                                    CategoryService categoryService,
                                    SupplierService supplierService) {
        this.movementRepository = movementRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.categoryService = categoryService;
        this.supplierService = supplierService;
    }

    @Transactional(readOnly = true)
    public List<MovementResponseDto> getAllMovements() {
        return movementRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovementResponseDto> getMovementsByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Producto no encontrado con el ID: " + productId);
        }
        return movementRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional
    public MovementResponseDto registerMovement(MovementRequestDto dto) {
        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el ID: " + dto.productId()));

        Supplier supplier = null;
        if (dto.supplierId() != null) {
            supplier = supplierRepository.findById(dto.supplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con el ID: " + dto.supplierId()));
        }

        // Actualización atómica de stock según el tipo de movimiento
        switch (dto.type()) {
            case ENTRY -> product.setStock(product.getStock() + dto.quantity());
            case EXIT -> {
                if (product.getStock() < dto.quantity()) {
                    throw new BadRequestException("Stock insuficiente para realizar la salida. Stock disponible: " + product.getStock());
                }
                product.setStock(product.getStock() - dto.quantity());
            }
            case ADJUSTMENT -> product.setStock(dto.quantity());
        }

        // Guardar cambios del producto e inyectar inmediatamente en PostgreSQL
        Product updatedProduct = productRepository.saveAndFlush(product);

        // Crear e ingresar el movimiento a la bitácora
        InventoryMovement movement = new InventoryMovement(
                updatedProduct,
                dto.type(),
                dto.quantity(),
                dto.notes(),
                supplier
        );

        InventoryMovement savedMovement = movementRepository.save(movement);
        return toResponseDto(savedMovement);
    }

    private MovementResponseDto toResponseDto(InventoryMovement movement) {
        Product p = movement.getProduct();
        ProductResponseDto productDto = new ProductResponseDto(
                p.getId(),
                p.getSku(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getMinStock(),
                categoryService.toDto(p.getCategory()),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );

        return new MovementResponseDto(
                movement.getId(),
                productDto,
                movement.getType(),
                movement.getQuantity(),
                movement.getNotes(),
                supplierService.toDto(movement.getSupplier()),
                movement.getCreatedAt()
        );
    }
}
