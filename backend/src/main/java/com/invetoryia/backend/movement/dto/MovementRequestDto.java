package com.invetoryia.backend.movement.dto;

import com.invetoryia.backend.movement.MovementType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MovementRequestDto(
    @NotNull(message = "El ID del producto es obligatorio")
    Long productId,

    @NotNull(message = "El tipo de movimiento es obligatorio (ENTRY, EXIT, ADJUSTMENT)")
    MovementType type,

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    Integer quantity,

    @Size(max = 500, message = "Las notas no pueden superar los 500 caracteres")
    String notes,

    Long supplierId
) {}
