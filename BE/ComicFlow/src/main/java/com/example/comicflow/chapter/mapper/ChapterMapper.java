package com.example.comicflow.chapter.mapper;

import com.example.comicflow.chapter.dto.request.ChapterRequest;
import com.example.comicflow.chapter.dto.response.ChapterResponse;
import com.example.comicflow.chapter.entity.Chapter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChapterMapper {
   Chapter toChapterResponsePaid(ChapterRequest request);

   @Mapping(target = "url", source = "pdfUrl")
   ChapterResponse toChapterResponse(Chapter chapter);

   ChapterResponse toChapterResponsePaid(Chapter chapter, String url);
}
