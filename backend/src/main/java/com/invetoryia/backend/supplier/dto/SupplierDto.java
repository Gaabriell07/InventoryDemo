package com.invetoryia.backend.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierDto(
    Long id,

    @NotBlank(message = "El nombre del proveedor es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    String name,

    @Size(max = 100, message = "El nombre de contacto no puede superar los 100 caracteres")
    String contactName,

    @Email(message = "El formato de email es inválido")
    @Size(max = 100, message = "El email no puede superar los 100 caracteres")
    String email,

    @Size(max = 30, message = "El teléfono no puede superar los 30 caracteres")
    String phone,

    @Size(max = 255, message = "La dirección no puede superar los 255 caracteres")
    String address
) {}
