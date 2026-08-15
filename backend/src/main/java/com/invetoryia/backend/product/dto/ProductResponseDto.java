package com.invetoryia.backend.product.dto;

import com.invetoryia.backend.category.dto.CategoryDto;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDto(
    Long id,
    String sku,
    String name,
    String description,
    BigDecimal price,
    Integer stock,
    Integer minStock,
    CategoryDto category,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
