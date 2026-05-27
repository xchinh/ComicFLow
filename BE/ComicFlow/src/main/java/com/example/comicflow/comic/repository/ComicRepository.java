package com.example.comicflow.comic.repository;

import com.example.comicflow.comic.entity.Comic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComicRepository extends JpaRepository<Comic, UUID> {
    @Query("SELECT c FROM Comic c JOIN FETCH c.author where c.author.id = :author_id")
    List<Comic> findByAuthorId(@Param("author_id") UUID authorId);

    @Query("SELECT c FROM Comic c JOIN FETCH c.author")
    List<Comic> findAllWithUser();

    @Query("SELECT c FROM Comic c JOIN FETCH c.author where c.id = :id")
    Optional<Comic> findByIdWithUser(@Param("id") UUID id);
}
