package com.muskrat.advice;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.muskrat.exceptions.UserNotFoundException;

@RestControllerAdvice

public class UserNotFoundAdvice {
  @ExceptionHandler(UserNotFoundException.class)
  String userNotFoundHandler(UserNotFoundException ex) {
    return ex.getMessage();
  }
}
