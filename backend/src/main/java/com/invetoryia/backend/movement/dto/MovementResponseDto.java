package com.invetoryia.backend.movement.dto;

import com.invetoryia.backend.movement.MovementType;
import com.invetoryia.backend.product.dto.ProductResponseDto;
import com.invetoryia.backend.supplier.dto.SupplierDto;
import java.time.LocalDateTime;

public record MovementResponseDto(
    Long id,
    ProductResponseDto product,
    MovementType type,
    Integer quantity,
    String notes,
    SupplierDto supplier,
    LocalDateTime createdAt
) {}
