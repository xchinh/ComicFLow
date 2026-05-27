package com.example.comicflow.storage.service.impl;

import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.MinioException;
import com.example.comicflow.storage.service.IMinioService;
import io.minio.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MinioService implements IMinioService {
    private final MinioClient minioClient;

    @Value("${minio.url}")
    private String minioUrl;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Override
    public String uploadCoverImage(UUID comicId, MultipartFile file) {
        try {
            boolean bucketExists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
            if (!bucketExists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build()
                );
            }

            String fileName = String.format("%s/cover/%s_%s", comicId.toString(), UUID.randomUUID(), file.getOriginalFilename());

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1L)
                            .contentType(file.getContentType())
                            .build());

            return String.format("%s/%s/%s", minioUrl, bucketName, fileName);
        }
        catch (Exception e) {
            throw new MinioException(e.getMessage());
        }
    }

    @Override
    public String uploadChapterPdf(UUID comicId, UUID chapterId, MultipartFile file, boolean isFree) {
        if (!"application/pdf".equals(file.getContentType())) {
            throw new BadRequestException("Only PDF files are supported");
        }

        try {
            boolean bucketExists = minioClient.bucketExists(
                    BucketExistsArgs.builder()
                            .bucket(bucketName)
                            .build()
            );
            if (!bucketExists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(bucketName)
                                .build()
                );
            }

            String accessType = isFree ? "free" : "paid";

            String fileName = String.format("%s/chapters/%s/%s/%s_%s",
                    comicId.toString(),
                    chapterId.toString(),
                    accessType,
                    UUID.randomUUID(),
                    file.getOriginalFilename()
            );

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(file.getInputStream(), file.getSize(), -1L)
                            .contentType(file.getContentType())
                            .build());

            if (isFree) {
                return String.format("%s/%s/%s", minioUrl, bucketName, fileName);
            } else {
                return fileName;
            }
        }
        catch (Exception e) {
            throw new MinioException(e.getMessage());
        }
    }

    @Override
    public String getPaidChapterUrl(String pdfUrl) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Http.Method.GET)
                            .bucket(bucketName)
                            .object(pdfUrl)
                            .expiry(15, TimeUnit.MINUTES)
                            .build()
            );
        }
        catch (Exception e) {
            throw new MinioException(e.getMessage());
        }
    }
}
