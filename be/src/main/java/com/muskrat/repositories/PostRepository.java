package com.muskrat.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Repository;

import com.muskrat.models.Post;


@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
  @Query("SELECT p FROM Post p WHERE p.user.id = ?1")
  CollectionModel<Post> getPosts(Long userId, Sort sort);

  @Query("SELECT p FROM Post p WHERE p.user.id = ?1")
  Page<Post> getPagedPosts(Long userId, final Pageable pageable);
}
