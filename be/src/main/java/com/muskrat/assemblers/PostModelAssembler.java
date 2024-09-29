package com.muskrat.assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;


import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.muskrat.controllers.PostController;
import com.muskrat.models.Post;

@Component
public class PostModelAssembler implements RepresentationModelAssembler<Post, EntityModel<Post>> {
  @Override
  public @NonNull EntityModel<Post> toModel(@NonNull Post post) {
    return EntityModel.of(post,
      linkTo(methodOn(PostController.class).one(post.getId())).withSelfRel(),
      linkTo(methodOn(PostController.class).all()).withRel("posts")
    );
  }
}
