package com.furkankozmac.blogmanagement.mapper;

import com.furkankozmac.blogmanagement.dto.CommentResponse;
import com.furkankozmac.blogmanagement.entity.Comment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CommentMapper {

    public CommentResponse toCommentResponse(Comment comment) {
        if (comment == null) return null;

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .username(comment.getUser().getUsername())
                .createdAt(comment.getCreatedAt())
                .postId(comment.getPost().getId())
                .build();
    }

    public List<CommentResponse> toResponseList(List<Comment> comments) {
        return comments.stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());
    }
}