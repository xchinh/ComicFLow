package com.example.comicflow.config;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.SetBucketPolicyArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfig {
    @Value("${minio.url}")
    private String url;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Bean
    public MinioClient minioClient() {
        MinioClient minioClient = MinioClient.builder()
                .endpoint(url)
                .credentials(accessKey, secretKey)
                .build();

        try {
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());

            if (!found) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            String publicPolicyJson = "{\n" +
                    "    \"Version\": \"2012-10-17\",\n" +
                    "    \"Statement\": [\n" +
                    "        {\n" +
                    "            \"Effect\": \"Allow\",\n" +
                    "            \"Principal\": {\"AWS\": [\"*\"]},\n" +
                    "            \"Action\": [\"s3:GetObject\"],\n" +
                    "            \"Resource\": [\n" +
                    "                \"arn:aws:s3:::" + bucketName + "/*/cover/*\",\n" +
                    "                \"arn:aws:s3:::" + bucketName + "/*/chapters/*/free/*\"\n" +
                    "            ]\n" +
                    "        }\n" +
                    "    ]\n" +
                    "}";

            // 4. Ép policy này vào bucket
            minioClient.setBucketPolicy(
                    SetBucketPolicyArgs.builder()
                            .bucket(bucketName)
                            .config(publicPolicyJson)
                            .build()
            );

        } catch (Exception e) {
            throw new RuntimeException("Error configuration minio: " + e.getMessage());
        }

        return minioClient;
    }
}
