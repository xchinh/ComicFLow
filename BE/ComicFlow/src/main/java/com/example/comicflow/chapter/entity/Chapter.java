package com.example.comicflow.chapter.entity;

import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(name = "chapters")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Chapter extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    Integer chapterNumber;

    @Column(nullable = false)
    String title;

    @Column(nullable = false)
    Long price;

    @Column(nullable = false)
    @Builder.Default
    boolean isFree = false;

    @Column(nullable = true)
    String pdfUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "comicId")
    Comic comic;
}
