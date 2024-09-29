package com.muskrat.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.muskrat.auth.LoginResponse;
import com.muskrat.dtos.LoginUserDto;
import com.muskrat.dtos.RegisterUserDto;
import com.muskrat.models.User;
import com.muskrat.services.AuthenticationService;
import com.muskrat.services.JwtService;

@RequestMapping("/auth")
@RestController
// @CrossOrigin(origins = "http://localhost:4000")
public class AuthController {
  private final JwtService jwtService;

  private final AuthenticationService authenticationService;

  public AuthController(JwtService jwtService, AuthenticationService authenticationService) {
    this.jwtService = jwtService;
    this.authenticationService = authenticationService;
  }

  @PostMapping("/register")
  public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
    User registeredUser;
    try {
      registeredUser = authenticationService.signup(registerUserDto);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(null);
    }

    return ResponseEntity.ok(registeredUser);
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
    User authenticatedUser = authenticationService.authenticate(loginUserDto);

    String jwtToken = jwtService.generateToken(authenticatedUser);

    LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());

    return ResponseEntity.ok(loginResponse);
  }
}
