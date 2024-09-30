package com.muskrat.controllers;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.muskrat.assemblers.PostModelAssembler;
import com.muskrat.models.Post;
import com.muskrat.repositories.PostRepository;
import com.muskrat.repositories.UserRepository;

class PostRequest {
  private Long userId;

  private String text;

  public Long getUserId() {
    return userId;
  }

  public PostRequest setUserId(Long userId) {
    this.userId = userId;
    return this;
  }

  public String getText() {
    return text;
  }

  public PostRequest setText(String text) {
    this.text = text;
    return this;
  }
}

@RequestMapping("/posts")
@RestController
@EnableJpaAuditing
public class PostController {
  private final UserRepository userRepository;
  private final PostRepository postRepository;
  private final PostModelAssembler assembler;

  PostController(UserRepository userRepository, PostRepository postRepository) {
    this.userRepository = userRepository;
    this.postRepository = postRepository;
    this.assembler = new PostModelAssembler();
  }

  private ResponseEntity<?> getRecentPosts(Long userId) {
    return ResponseEntity.ok(postRepository
        .getPagedPosts(userId, PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt")))
        .getContent());
  }

  @PostMapping("/{userId}/new")
  public ResponseEntity<?> newPost(@PathVariable Long userId, @RequestBody PostRequest req) {
    postRepository.save(new Post(userRepository.findById(userId).get(), req.getText()));
    return getRecentPosts(userId);
  }

  @GetMapping("/{id}")
  public EntityModel<Post> one(Long id) {
    Post post = postRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Post with id " + id + " not found"));
    return assembler.toModel(post);
  }

  @GetMapping("/{userId}")
  public ResponseEntity<?> all(@RequestBody Long userId) {
    return ResponseEntity.ok(postRepository.getPosts(userId, Sort.by(Sort.Direction.DESC, "createdAt")));
  }

  @GetMapping("/{userId}/pageable")
  public ResponseEntity<?> pageable(
      @PathVariable Long userId,
      @RequestParam(defaultValue = "0") final Integer pageNumber,
      @RequestParam(defaultValue = "10") final Integer size) {
    return ResponseEntity.ok(postRepository
        .getPagedPosts(userId, PageRequest.of(pageNumber, size, Sort.by(Sort.Direction.DESC, "createdAt")))
        .getContent());
  }

  @DeleteMapping("/{userId}/{id}")
  public ResponseEntity<?> deletePost(@PathVariable Long userId, @PathVariable Long id) {
    postRepository.deleteById(id);
    return getRecentPosts(userId);
  }
}
