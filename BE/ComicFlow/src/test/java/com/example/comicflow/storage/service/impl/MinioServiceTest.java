package com.example.comicflow.storage.service.impl;

import com.example.comicflow.common.exception.BadRequestException;
import com.example.comicflow.common.exception.MinioException;
import io.minio.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MinioServiceTest {

    @Mock
    private MinioClient minioClient;

    @InjectMocks
    private MinioService minioService;

    private final String bucketName = "test-bucket";
    private final String minioUrl = "http://localhost:9000";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(minioService, "bucketName", bucketName);
        ReflectionTestUtils.setField(minioService, "minioUrl", minioUrl);
    }

    @Test
    void uploadCoverImage_Success() throws Exception {
        UUID comicId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test data".getBytes());

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

        String result = minioService.uploadCoverImage(comicId, file);

        assertNotNull(result);
        assertTrue(result.contains(minioUrl));
        assertTrue(result.contains(bucketName));
        assertTrue(result.contains(comicId.toString()));
        verify(minioClient, times(1)).putObject(any(PutObjectArgs.class));
    }

    @Test
    void uploadCoverImage_BucketDoesNotExist_CreatesBucket() throws Exception {
        UUID comicId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test data".getBytes());

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(false);

        minioService.uploadCoverImage(comicId, file);

        verify(minioClient, times(1)).makeBucket(any(MakeBucketArgs.class));
        verify(minioClient, times(1)).putObject(any(PutObjectArgs.class));
    }

    @Test
    void uploadCoverImage_ThrowsException_WrapsInMinioException() throws Exception {
        UUID comicId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test data".getBytes());

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenThrow(new RuntimeException("Minio error"));

        assertThrows(MinioException.class, () -> minioService.uploadCoverImage(comicId, file));
    }

    @Test
    void uploadChapterPdf_Free_Success() throws Exception {
        UUID comicId = UUID.randomUUID();
        UUID chapterId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "test data".getBytes());

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

        String result = minioService.uploadChapterPdf(comicId, chapterId, file, true);

        assertNotNull(result);
        assertTrue(result.contains(minioUrl));
        assertTrue(result.contains("free"));
        verify(minioClient, times(1)).putObject(any(PutObjectArgs.class));
    }

    @Test
    void uploadChapterPdf_Paid_Success() throws Exception {
        UUID comicId = UUID.randomUUID();
        UUID chapterId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.pdf", "application/pdf", "test data".getBytes());

        when(minioClient.bucketExists(any(BucketExistsArgs.class))).thenReturn(true);

        String result = minioService.uploadChapterPdf(comicId, chapterId, file, false);

        assertNotNull(result);
        assertFalse(result.contains(minioUrl)); // Should return fileName, not full URL
        assertTrue(result.contains("paid"));
        verify(minioClient, times(1)).putObject(any(PutObjectArgs.class));
    }

    @Test
    void uploadChapterPdf_NotPdf_ThrowsBadRequestException() {
        UUID comicId = UUID.randomUUID();
        UUID chapterId = UUID.randomUUID();
        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test data".getBytes());

        assertThrows(BadRequestException.class, () -> minioService.uploadChapterPdf(comicId, chapterId, file, true));
    }

    @Test
    void getPaidChapterUrl_Success() throws Exception {
        String pdfUrl = "some/path/to.pdf";
        String presignedUrl = "http://presigned.url";

        when(minioClient.getPresignedObjectUrl(any(GetPresignedObjectUrlArgs.class))).thenReturn(presignedUrl);

        String result = minioService.getPaidChapterUrl(pdfUrl);

        assertEquals(presignedUrl, result);
    }

    @Test
    void getPaidChapterUrl_ThrowsException_WrapsInMinioException() throws Exception {
        when(minioClient.getPresignedObjectUrl(any(GetPresignedObjectUrlArgs.class))).thenThrow(new RuntimeException("Minio error"));

        assertThrows(MinioException.class, () -> minioService.getPaidChapterUrl("any.pdf"));
    }
}
