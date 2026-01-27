package com.furkankozmac.blogmanagement.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Instant createdAt;
    private String categoryName;
}
