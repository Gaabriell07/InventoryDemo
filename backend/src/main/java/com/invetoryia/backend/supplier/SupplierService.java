package com.invetoryia.backend.supplier;

import com.invetoryia.backend.common.exception.BadRequestException;
import com.invetoryia.backend.common.exception.ResourceNotFoundException;
import com.invetoryia.backend.supplier.dto.SupplierDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public SupplierDto getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con el ID: " + id));
        return toDto(supplier);
    }

    @Transactional
    public SupplierDto createSupplier(SupplierDto dto) {
        if (supplierRepository.existsByName(dto.name())) {
            throw new BadRequestException("Ya existe un proveedor registrado con el nombre: " + dto.name());
        }

        Supplier supplier = new Supplier(
                dto.name(),
                dto.contactName(),
                dto.email(),
                dto.phone(),
                dto.address()
        );

        Supplier savedSupplier = supplierRepository.save(supplier);
        return toDto(savedSupplier);
    }

    @Transactional
    public SupplierDto updateSupplier(Long id, SupplierDto dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con el ID: " + id));

        if (supplierRepository.existsByNameAndIdNot(dto.name(), id)) {
            throw new BadRequestException("Ya existe otro proveedor con el nombre: " + dto.name());
        }

        supplier.setName(dto.name());
        supplier.setContactName(dto.contactName());
        supplier.setEmail(dto.email());
        supplier.setPhone(dto.phone());
        supplier.setAddress(dto.address());

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return toDto(updatedSupplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Proveedor no encontrado con el ID: " + id);
        }
        supplierRepository.deleteById(id);
    }

    public SupplierDto toDto(Supplier supplier) {
        if (supplier == null) {
            return null;
        }
        return new SupplierDto(
                supplier.getId(),
                supplier.getName(),
                supplier.getContactName(),
                supplier.getEmail(),
                supplier.getPhone(),
                supplier.getAddress()
        );
    }
}
