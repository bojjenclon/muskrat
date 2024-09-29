package com.muskrat.controllers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;


import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.muskrat.models.User;
import com.muskrat.repositories.PostRepository;

class PostRequest {
  private String text;

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
  private final PostRepository repository;
  private final PostModelAssembler assembler;

  PostController(PostRepository repository) {
    this.repository = repository;
    this.assembler = new PostModelAssembler();
  }

  @PostMapping("/new")
  public ResponseEntity<Post> newPost(@RequestBody PostRequest req) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();

    Post savedPost = repository.save(new Post(currentUser, req.getText()));
    return ResponseEntity
        .created(linkTo(methodOn(PostController.class).one(savedPost.getId())).toUri())
        .body(savedPost);
  }

  @GetMapping("/{id}")
  public EntityModel<Post> one(Long id) {
    Post post = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Post with id " + id + " not found"));
    return assembler.toModel(post);
  }

  @GetMapping("/")
  public ResponseEntity<?> all() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    return ResponseEntity.ok(repository.getPosts(currentUser.getId(), Sort.by(Sort.Direction.DESC, "createdAt")));
  }

  @GetMapping("/pageable")
  public ResponseEntity<?> pageable(
      @RequestParam(defaultValue = "0") final Integer pageNumber,
      @RequestParam(defaultValue = "25") final Integer size) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    return ResponseEntity.ok(repository
        .getPagedPosts(currentUser.getId(), PageRequest.of(pageNumber, size, Sort.by(Sort.Direction.DESC, "createdAt")))
        .getContent());
  }

  @DeleteMapping("/{id}")
  public void deletePost(@PathVariable Long id) {
    repository.deleteById(id);
  }
}
