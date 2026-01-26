package com.furkankozmac.blogmanagement.controller;

import com.furkankozmac.blogmanagement.dto.CommentRequest;
import com.furkankozmac.blogmanagement.dto.CommentResponse;
import com.furkankozmac.blogmanagement.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentRequest request){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        return new ResponseEntity<>(commentService.createComment(request,username), HttpStatus.CREATED);
    }

    @GetMapping("/post/{postid}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPostId(@PathVariable("postid") Long postId){
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long commentId, @RequestBody CommentRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(commentService.updateComment(commentId, username, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        commentService.deleteComment(commentId, username);
        return ResponseEntity.ok("Comment deleted successfully");
    }
}
