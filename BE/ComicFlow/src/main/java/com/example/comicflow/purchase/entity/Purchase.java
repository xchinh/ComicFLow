package com.example.comicflow.purchase.entity;

import com.example.comicflow.chapter.entity.Chapter;
import com.example.comicflow.common.base.BaseEntity;
import com.example.comicflow.purchase.enums.AccessChapterType;
import com.example.comicflow.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(
        name = "purchases",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "userId",
                                "chapterId"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Purchase extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapterId")
    Chapter chapter;

    @Enumerated(EnumType.STRING)
    AccessChapterType accessChapterType;

    Long amount;
}
