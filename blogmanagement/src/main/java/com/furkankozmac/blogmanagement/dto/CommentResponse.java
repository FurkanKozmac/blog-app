package com.furkankozmac.blogmanagement.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String username;
    private Instant createdAt;
    private Long postId;
}
