package com.invetoryia.backend.category;

import com.invetoryia.backend.category.dto.CategoryDto;
import com.invetoryia.backend.common.exception.BadRequestException;
import com.invetoryia.backend.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con el ID: " + id));
        return toDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryDto dto) {
        if (categoryRepository.existsByName(dto.name())) {
            throw new BadRequestException("Ya existe una categoría con el nombre: " + dto.name());
        }

        Category category = new Category(dto.name(), dto.description());
        Category savedCategory = categoryRepository.save(category);
        return toDto(savedCategory);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con el ID: " + id));

        if (categoryRepository.existsByNameAndIdNot(dto.name(), id)) {
            throw new BadRequestException("Ya existe otra categoría con el nombre: " + dto.name());
        }

        category.setName(dto.name());
        category.setDescription(dto.description());

        Category updatedCategory = categoryRepository.save(category);
        return toDto(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría no encontrada con el ID: " + id);
        }
        categoryRepository.deleteById(id);
    }

    // Método helper para mapear de Entidad a DTO
    public CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryDto(category.getId(), category.getName(), category.getDescription());
    }
}
