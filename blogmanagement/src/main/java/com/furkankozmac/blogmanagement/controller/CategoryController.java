package com.furkankozmac.blogmanagement.controller;

import com.furkankozmac.blogmanagement.dto.CategoryRequest;
import com.furkankozmac.blogmanagement.entity.Category;
import com.furkankozmac.blogmanagement.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> create(@Valid @RequestBody CategoryRequest categoryRequest) {

        return ResponseEntity.ok(categoryService.createCategory(categoryRequest));
    }
}
