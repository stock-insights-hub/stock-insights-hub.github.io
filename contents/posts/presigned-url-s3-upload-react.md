---
emoji: "⬆️"
title: "React에서 S3 Presigned URL을 이용한 파일 업로드/다운로드"
date: 2025-01-21 15:27:00 +0900
update: 2025-01-21 15:27:00 +0900
tags:
  - aws
  - s3
  - presigned-url
  - react
series: "📂 AWS S3 Presigned URL 업로드/다운로드"
---

> ☀️ ***테스트 환경***
> <br/><br/>
> - node v20.16.0
> - yarn 1.22.22
> - react ^18.2.0

## ✋ 들어가며

지난 포스팅에서는 EC2에 올라간 SpringBoot 기반 웹어플리케이션에서 Presigned URL을 발급받는 과정을 알아보았다.
이번에는 발급받은 Presigned URL을 사용해서 Client(React)에서 S3로 파일을 직접 업로드/다운로드 하는 방법에 대해서 작성해보려고 한다.


## 🛠️ Presigned URL을 이용한 파일 업로드/다운로드

#### ***파일 업로드***
```tsx
import axios from "axios";
```
```tsx
// File Object와 Presigned URL을 파라미터로 받아서 파일을 업로드
const uploadFile= async (file: File, presignedUrl: string) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (e) {
    console.error(e);
  }
}
```

#### ***파일 다운로드***

```tsx
import axios from "axios";
```
```tsx
// Presigned URL을 파라미터로 받아서 파일을 다운로드
const downloadFile = async (presignedUrl: string) => {
  const response = await fetch(presignedUrl);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
```

## 👋

