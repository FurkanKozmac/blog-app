package com.furkankozmac.blogmanagement.service;

import com.furkankozmac.blogmanagement.dto.CommentRequest;
import com.furkankozmac.blogmanagement.dto.CommentResponse;
import com.furkankozmac.blogmanagement.entity.Comment;
import com.furkankozmac.blogmanagement.entity.Post;
import com.furkankozmac.blogmanagement.entity.Role;
import com.furkankozmac.blogmanagement.entity.User;
import com.furkankozmac.blogmanagement.mapper.CommentMapper;
import com.furkankozmac.blogmanagement.repository.CommentRepository;
import com.furkankozmac.blogmanagement.repository.PostRepository;
import com.furkankozmac.blogmanagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentMapper commentMapper;

    @Transactional
    public CommentResponse createComment(CommentRequest commentRequest, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));
        Post post =  postRepository.findById(commentRequest.getPostId()).orElseThrow(() -> new RuntimeException("Post not found!"));

        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(commentRequest.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        return commentMapper.toCommentResponse(savedComment);
    }

    @Transactional
    public void deleteComment(Long id, String username) {
        Comment comment = findCommentByIdAndCheckOwner(id, username);
        commentRepository.delete(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long id, String username, CommentRequest commentRequest) {

        Comment comment = findCommentByIdAndCheckOwner(id, username);

        comment.setContent(commentRequest.getContent());

        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentResponse(savedComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return commentMapper.toResponseList(comments);
    }

    private Comment findCommentByIdAndCheckOwner(Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found!"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Current user not found!"));

        boolean isOwner = comment.getUser().getUsername().equals(username);
        boolean isAdmin =  currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to perform this action!");
        }

        return comment;
    }

}
