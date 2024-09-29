package com.muskrat.models;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "posts")
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  @Column(nullable = false)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonBackReference
  private User user;

  @Column(length = 255, nullable = false, unique = false)
  private String text;
  
  @CreationTimestamp
  @Column(nullable = false)
  private LocalDateTime createdAt;
  
  public Post() {
  }

  public Post(User user, String text) {
    this.user = user;
    this.text = text;
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public String getText() {
    return text;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }
  
  public Post setId(Long id) {
    this.id = id;
    return this;
  }

  public Post setUser(User user) {
    this.user = user;
    return this;
  }

  public Post setText(String text) {
    this.text = text;
    return this;
  }
}
