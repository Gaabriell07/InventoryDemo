package com.invetoryia.backend.movement;

import com.invetoryia.backend.movement.dto.MovementRequestDto;
import com.invetoryia.backend.movement.dto.MovementResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movements")
public class InventoryMovementController {

    private final InventoryMovementService movementService;

    public InventoryMovementController(InventoryMovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    public ResponseEntity<List<MovementResponseDto>> getAllMovements() {
        return ResponseEntity.ok(movementService.getAllMovements());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<MovementResponseDto>> getMovementsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(movementService.getMovementsByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<MovementResponseDto> registerMovement(@Valid @RequestBody MovementRequestDto dto) {
        MovementResponseDto created = movementService.registerMovement(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
