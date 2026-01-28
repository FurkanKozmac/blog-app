package com.furkankozmac.blogmanagement.mapper;

import com.furkankozmac.blogmanagement.dto.PostResponse;
import com.furkankozmac.blogmanagement.entity.Post;
import org.springframework.stereotype.Component;

import java.time.ZoneOffset;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PostMapper {

    public PostResponse toPostResponse(Post post) {
        if (post == null) return null;

        // Resim varsa tam URL oluştur, yoksa null bırak
        String imageUrl = null;
        if (post.getImageName() != null) {
            imageUrl = "http://localhost:8080/uploads/" + post.getImageName();
        }

        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getUser().getUsername())
                .categoryName(post.getCategory() != null ? post.getCategory().getName() : "Genel")
                .imageUrl(imageUrl) // DTO'daki yeni alan
                .createdAt(post.getCreatedAt().toInstant(ZoneOffset.UTC))
                .build();
    }

    public List<PostResponse> toResponseList(List<Post> posts) {
        return posts.stream()
                .map(this::toPostResponse)
                .collect(Collectors.toList());
    }
}
