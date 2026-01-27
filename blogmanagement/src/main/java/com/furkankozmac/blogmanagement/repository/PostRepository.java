package com.furkankozmac.blogmanagement.repository;

import com.furkankozmac.blogmanagement.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Override
    @EntityGraph(attributePaths = {"user"})
    Page<Post> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Page<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title,
            String content,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"user", "category"})
    Page<Post> findByCategoryId(Long categoryId, Pageable pageable);
}
