package com.example.comicflow.comic.entity;

import com.example.comicflow.comic.enums.ComicStatus;
import com.example.comicflow.common.base.BaseEntity;
import com.example.comicflow.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "comics")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Comic extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    String title;

    @Column(columnDefinition = "TEXT")
    String description;

    String coverImageUrl;

    @Builder.Default
    Long views = 0L;

    @Enumerated(EnumType.STRING)
    ComicStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "authorId")
    User author;
}
