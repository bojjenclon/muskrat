package com.muskrat.controllers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muskrat.assemblers.UserModelAssembler;
import com.muskrat.exceptions.UserNotFoundException;
import com.muskrat.models.User;
import com.muskrat.repositories.UserRepository;

@RequestMapping("/users")
@RestController
public class UserController {
  private final UserRepository repository;
  private final UserModelAssembler assembler;

  UserController(UserRepository repository) {
    this.repository = repository;
    this.assembler = new UserModelAssembler();
  }

  @GetMapping("/current")
  public ResponseEntity<User> current() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    User currentUser = (User) authentication.getPrincipal();
    return ResponseEntity.ok(currentUser);
  }

  @GetMapping("/")
  public CollectionModel<EntityModel<User>> all() {
    List<EntityModel<User>> users = repository.findAll().stream()
        .map(user -> assembler.toModel(user))
        .toList();
    return CollectionModel.of(users, linkTo(methodOn(UserController.class).all()).withSelfRel());
  }

  @PostMapping("/")
  public EntityModel<User> newUser(@RequestBody User user) {
    User savedUser = repository.save(user);
    return assembler.toModel(savedUser);
  }

  @GetMapping("/{id}")
  public EntityModel<User> one(@PathVariable Long id) {
    User user = repository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
    return assembler.toModel(user);
  }

  @PutMapping("/{id}")
  public User replaceUser(@RequestBody User newUser, @PathVariable Long id) {
    return repository.findById(id)
        .map(user -> {
          user.setUsername(newUser.getUsername());
          user.setPassword(newUser.getPassword());
          return repository.save(user);
        })
        .orElseGet(() -> {
          return repository.save(newUser);
        });
  }

  @DeleteMapping("/{id}")
  public void deleteUser(@PathVariable Long id) {
    repository.deleteById(id);
  }
}
