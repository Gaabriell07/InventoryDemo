package com.invetoryia.backend.product;

import com.invetoryia.backend.category.Category;
import com.invetoryia.backend.category.CategoryRepository;
import com.invetoryia.backend.category.CategoryService;
import com.invetoryia.backend.common.exception.BadRequestException;
import com.invetoryia.backend.common.exception.ResourceNotFoundException;
import com.invetoryia.backend.product.dto.ProductRequestDto;
import com.invetoryia.backend.product.dto.ProductResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository,
            CategoryRepository categoryRepository,
            CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.categoryService = categoryService;
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDto> getAllProducts(String search) {
        List<Product> products;
        if (search != null && !search.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseOrSkuContainingIgnoreCase(search, search);
        } else {
            products = productRepository.findAll();
        }
        return products.stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el ID: " + id));
        return toResponseDto(product);
    }

    @Transactional
    public ProductResponseDto createProduct(ProductRequestDto dto) {
        if (productRepository.existsBySku(dto.sku())) {
            throw new BadRequestException("Ya existe un producto registrado con el SKU: " + dto.sku());
        }

        Category category = null;
        if (dto.categoryId() != null) {
            category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoría no encontrada con el ID: " + dto.categoryId()));
        }

        int minStock = dto.minStock() != null ? dto.minStock() : 5;

        Product product = new Product(
                dto.sku(),
                dto.name(),
                dto.description(),
                dto.price(),
                dto.stock(),
                minStock,
                category);

        Product savedProduct = productRepository.save(product);
        return toResponseDto(savedProduct);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long id, ProductRequestDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el ID: " + id));

        if (productRepository.existsBySkuAndIdNot(dto.sku(), id)) {
            throw new BadRequestException("Ya existe otro producto registrado con el SKU: " + dto.sku());
        }

        Category category = null;
        if (dto.categoryId() != null) {
            category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Categoría no encontrada con el ID: " + dto.categoryId()));
        }

        product.setSku(dto.sku());
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setStock(dto.stock());
        if (dto.minStock() != null) {
            product.setMinStock(dto.minStock());
        }
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);
        return toResponseDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con el ID: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductResponseDto toResponseDto(Product product) {
        return new ProductResponseDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getMinStock(),
                categoryService.toDto(product.getCategory()),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
