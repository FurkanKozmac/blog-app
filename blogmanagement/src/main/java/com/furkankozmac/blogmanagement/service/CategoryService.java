package com.furkankozmac.blogmanagement.service;

import com.furkankozmac.blogmanagement.dto.CategoryRequest;
import com.furkankozmac.blogmanagement.entity.Category;
import com.furkankozmac.blogmanagement.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(CategoryRequest request) { // String yerine DTO alıyor
        Category category = Category.builder()
                .name(request.getName())
                .build();
        return categoryRepository.save(category);
    }
}
