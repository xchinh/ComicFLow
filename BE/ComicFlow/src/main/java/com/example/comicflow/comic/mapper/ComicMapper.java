package com.example.comicflow.comic.mapper;

import com.example.comicflow.comic.dto.request.ComicRequest;
import com.example.comicflow.comic.dto.request.ComicUpdate;
import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.user.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ComicMapper{
    @Mapping(target = "author", source = "user")
    @Mapping(target = "id", ignore = true)
    Comic toComic(ComicRequest request, User user);

    @Mapping(source = "createdAt", target = "releaseDate")
    @Mapping(target = "authorName", source = "comic.author.username")
    ComicResponse toComicResponse(Comic comic);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateComic(ComicUpdate update, @MappingTarget Comic comic);
}
