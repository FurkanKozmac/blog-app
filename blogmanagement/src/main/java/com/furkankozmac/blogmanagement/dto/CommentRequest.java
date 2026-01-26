package com.furkankozmac.blogmanagement.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {

    @NotNull(message = "Post ID cannot be blank!")
    private Long postId;

    @Size(max = 255, message = "Comment can be maximum 255 characters.")
    private String content;
}
