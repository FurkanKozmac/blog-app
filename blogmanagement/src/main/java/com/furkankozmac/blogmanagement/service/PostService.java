package com.furkankozmac.blogmanagement.service;

import com.furkankozmac.blogmanagement.dto.PostRequest;
import com.furkankozmac.blogmanagement.dto.PostResponse;
import com.furkankozmac.blogmanagement.entity.Post;
import com.furkankozmac.blogmanagement.entity.Role;
import com.furkankozmac.blogmanagement.entity.User;
import com.furkankozmac.blogmanagement.mapper.PostMapper;
import com.furkankozmac.blogmanagement.repository.PostRepository;
import com.furkankozmac.blogmanagement.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;

    public PostResponse createPost(PostRequest postRequest, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Username not found"));

        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .user(user)
                .build();

        Post savedPost = postRepository.save(post);
        return postMapper.toPostResponse(savedPost);
    }

    public Page<PostResponse> getAllPosts(Pageable pageable) {
        Page<Post> pageablePosts = postRepository.findAll(pageable);
        return pageablePosts.map(postMapper::toPostResponse);
    }

    public Page<PostResponse> searchPosts(String query, Pageable pageable) {
        return postRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query, pageable)
                .map(postMapper::toPostResponse);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Post not found"));

        return postMapper.toPostResponse(post);
    }

    @Transactional
    public void deletePost(Long id, String currentUsername) {
        Post post = findPostByIdAndCheckOwner(id, currentUsername);

        postRepository.delete(post);
    }

    @Transactional
    public PostResponse updatePost(Long id, String currentUsername, PostRequest postRequest) {
        Post post = findPostByIdAndCheckOwner(id, currentUsername);

        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());

        Post updatedPost = postRepository.save(post);
        return  postMapper.toPostResponse(updatedPost);

    }

    private Post findPostByIdAndCheckOwner(Long id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        boolean isOwner = post.getUser().getUsername().equals(username);
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isOwner && !isAdmin) {
            throw new AccessDeniedException("You are not authorized to perform this action");
        }

        return post;
    }


}
