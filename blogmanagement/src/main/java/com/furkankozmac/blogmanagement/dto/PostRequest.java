package com.furkankozmac.blogmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostRequest {

    @NotBlank(message = "Title cannot be blank!")
    @Size(min = 5, max = 100, message = "The title should be between 5 and 100 characters.")
    private String title;

    @NotBlank(message = "Content cannot be blank!")
    @Size(min = 10, message = "Content must be at least 10 characters.")
    private String content;

    private Long categoryId;

    private MultipartFile image;
}
