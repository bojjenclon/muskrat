package com.muskrat.assemblers;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import com.muskrat.controllers.UserController;
import com.muskrat.models.User;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {
  @Override
  public @NonNull EntityModel<User> toModel(@NonNull User user) {
    return EntityModel.of(user,
      linkTo(methodOn(UserController.class).one(user.getId())).withSelfRel(),
      linkTo(methodOn(UserController.class).all()).withRel("users")
    );
  }
}
