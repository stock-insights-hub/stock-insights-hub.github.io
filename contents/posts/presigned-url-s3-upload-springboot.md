---
emoji: "🔐"
title: "SpringBoot에서 S3 Presigned URL 발급받기"
date: 2025-01-21 13:28:00 +0900
update: 2025-01-21 13:28:00 +0900
tags:
  - aws
  - s3
  - presigned-url
  - springboot
series: "📂 AWS S3 Presigned URL"
---

## ☀️ 테스트 환경
> - OpenJDK 17.0.2  
> - Gradle 8.0.2    
> - Spring Boot 3.0.5

## ✋ 들어가며

이번 포스팅 에서는 EC2에 올라간 SpringBoot 기반 웹어플리케이션에서 Presigned URL을 발급받는 과정을 작성해보려고 한다.
현재 작성중인 Series의 첫번째 포스팅은 EC2에 S3 Bucket 접근 권한을 부여하는 과정을 작성했었다.

이미 EC2에 S3 Bucket 접근 권한을 부여했기 때문에 이 글에서는 Credentials(Access key, Secret key)에 대한 내용은 언급하지 않는다.

## ❓ Presigned URL이란?

> ☑️ Presigned URL은 모두 유추 할 수 있겠지만 S3 Bucket에 파일을 업로드/다운로드할 수 있는 미리 서명된 URL으로 해당 URL을 통해서만 파일에 접근할 수 있다.


## 🛠️ Presigned URL 발급받기

#### ***build.gradle***

먼저 AWS SDK를 사용하기 위해서 아래와 같이 의존성을 추가해준다.

```gradle
dependencies {
    //  AWS
    implementation 'com.amazonaws:aws-java-sdk-s3:1.12.770'
    implementation 'com.amazonaws:aws-java-sdk-core:1.12.770'
    implementation 'com.amazonaws:aws-java-sdk-sts:1.12.770'
}
``` 

#### ***config 파일 수정***

`application.properties` 또는 `application.yml` 파일에 S3 Bucket 이름을 추가해준다.

- application.properties
   ```properties
   cloud.aws.s3.bucket=S3_BUCKET_NAME
   ```
- application.yml
   ```yml
   cloud:
     aws:
       s3:
         bucket: S3_BUCKET_NAME
   ```

#### ***Presigned URL 발급받기***

- 업로드용 Presigned URL 발급
  ```java
  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  AmazonS3 s3Client;
  ```
  ```java
  String filePath = "upload/test.jpg"; // 업로드할 파일 경로
  
  // S3 Client 생성
  s3Client = AmazonS3ClientBuilder
            .standard()
            .withRegion(Regions.AP_NORTHEAST_2) // Region 설정
            .build();    
  
  // Pre-Signed URL 만료 시간 설정 (10분 후)
  Date expiration = new Date();
  long expTimeMillis = expiration.getTime();
  expTimeMillis += TimeUnit.MINUTES.toMillis(10);
  expiration.setTime(expTimeMillis);
  
  // Upload Pre-Signed URL Generate (PUT Method)
  GeneratePresignedUrlRequest generatePresignedUrlRequest =
            new GeneratePresignedUrlRequest(bucket, filePath)
                    .withMethod(HttpMethod.PUT)
                    .withExpiration(expiration);
  URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
  
  // 발급된 업로드용 Pre-Signed URL
  String putPreSignedUrl = url.toString();
  ```


- 다운로드용 Presigned URL 발급
  ```java
  @Value("${cloud.aws.s3.bucket}")
  private String bucket;

  AmazonS3 s3Client;
  ```
  ```java
  String filePath = "upload/test.jpg"; // 다운로드할 파일 경로t
  
  // S3 Client 생성
  s3Client = AmazonS3ClientBuilder
            .standard()
            .withRegion(Regions.AP_NORTHEAST_2) // Region 설정
            .build();    

  // Pre-Signed URL 만료 시간 (10분 후)
  Date expiration = new Date();
  long expTimeMillis = expiration.getTime();
  expTimeMillis += TimeUnit.MINUTES.toMillis(10);
  expiration.setTime(expTimeMillis);
  
  // Download Pre-Signed URL Generate (GET Method)
  GeneratePresignedUrlRequest generatePresignedUrlRequest =
            new GeneratePresignedUrlRequest(bucket, filePath)
                    .withMethod(HttpMethod.GET)
                    .withExpiration(expiration);
  URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
  
  // 발급된 다운로드용 Pre-Signed URL
  String putPreSignedUrl = url.toString();
  ```


## 👋
SpringBoot에서 S3Client를 사용해서 Presigned URL을 발급받는 방법에 대해서 알아보았다.
다음 포스팅에서는 React에서 발급받은 Presigned URL을 사용해서 파일을 업로드/다운로드 하는 방법에 대해서 작성해보려고 한다.
