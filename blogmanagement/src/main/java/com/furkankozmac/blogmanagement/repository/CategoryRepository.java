package com.furkankozmac.blogmanagement.repository;

import com.furkankozmac.blogmanagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
