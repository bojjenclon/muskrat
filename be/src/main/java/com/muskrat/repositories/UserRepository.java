package com.muskrat.repositories;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.muskrat.models.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  @Query("SELECT u FROM User u WHERE u.username = ?1")
  Optional<User> findByUsername(String username);
}
