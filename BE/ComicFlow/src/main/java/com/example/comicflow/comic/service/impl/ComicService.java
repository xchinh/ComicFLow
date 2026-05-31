package com.example.comicflow.comic.service.impl;

import com.example.comicflow.comic.dto.request.ComicRequest;
import com.example.comicflow.comic.dto.request.ComicUpdate;
import com.example.comicflow.comic.dto.response.ComicResponse;
import com.example.comicflow.comic.entity.Comic;
import com.example.comicflow.comic.mapper.ComicMapper;
import com.example.comicflow.comic.repository.ComicRepository;
import com.example.comicflow.comic.service.IComicService;
import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.NotFoundException;
import com.example.comicflow.storage.service.IMinioService;
import com.example.comicflow.user.entity.User;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

import static com.example.comicflow.common.utils.Utils.getCurrentUser;

@Slf4j
@Service
@AllArgsConstructor
public class ComicService implements IComicService {
    private final ComicRepository comicRepository;
    private final ComicMapper comicMapper;
    private final IMinioService minioService;

    @Override
    @Transactional
    public ComicResponse create(ComicRequest request, MultipartFile coverImage) {
        User currentUser = getCurrentUser();
        log.info("ComicService:create:currentUser:{}", currentUser.getUsername());
        Comic comic = comicMapper.toComic(request, currentUser);
        Comic savedComic = comicRepository.save(comic);

        if (coverImage != null && !coverImage.isEmpty()) {
            String coverImageUrl = minioService.uploadCoverImage(savedComic.getId(), coverImage);
            savedComic.setCoverImageUrl(coverImageUrl);
            savedComic = comicRepository.save(savedComic);
        }

        return comicMapper.toComicResponse(savedComic);
    }

    @Override
    public List<ComicResponse> getAllComics() {
        return comicRepository.findAllWithUser()
                .stream()
                .map(comicMapper::toComicResponse)
                .toList();
    }

    @Override
    public ComicResponse getComicById(UUID comicId) {
        Comic comic = comicRepository.findByIdWithUser(comicId)
                .orElseThrow(() -> new NotFoundException("Comic not found"));

        return comicMapper.toComicResponse(comic);
    }

    @Override
    public List<ComicResponse> getMyComics() {
        User currentUser = getCurrentUser();

        return comicRepository.findByAuthorId(currentUser.getId())
                .stream()
                .map(comicMapper::toComicResponse)
                .toList();
    }

    @Override
    @Transactional
    public ComicResponse updateComic(UUID comicId, ComicUpdate update) {
        User currentUser = getCurrentUser();

        Comic comic = comicRepository.findByIdWithUser(comicId)
                .orElseThrow(() -> new NotFoundException("Comic not found"));

        if (!comic.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not allowed to update comic with different author");
        }

        comicMapper.updateComic(update, comic);

        Comic savedComic = comicRepository.save(comic);
        return comicMapper.toComicResponse(savedComic);
    }

    @Override
    @Transactional
    public ComicResponse updateComicCover(UUID comicId, String coverImageUrl) {
        User currentUser = getCurrentUser();

        Comic comic = comicRepository.findByIdWithUser(comicId)
                .orElseThrow(() -> new NotFoundException("Comic not found"));

        if (!comic.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not allowed to update comic with different author");
        }

        comic.setCoverImageUrl(coverImageUrl);
        Comic savedComic = comicRepository.save(comic);
        return comicMapper.toComicResponse(savedComic);
    }

    @Override
    public void deleteComic(UUID comicId) {
        User currentUser = getCurrentUser();

        Comic comic = comicRepository.findByIdWithUser(comicId)
                .orElseThrow(() -> new NotFoundException("Comic not found"));

        if (!comic.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not allowed to delete comic with different author");
        }

        comicRepository.delete(comic);
    }

    @Override
    public Comic findById(UUID comicId) {
        return comicRepository.findByIdWithUser(comicId)
                .orElseThrow(() -> new NotFoundException("Comic not found"));
    }
}
