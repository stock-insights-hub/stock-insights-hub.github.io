# Writerside Github에 배포하기

> ***사전 준비***
> 
> 1. Github Page 생성 ([Github Page 시작하기](https://rundevelrun.6developer.com/github-pages-start.html))
> 2. [Writerside](https://www.jetbrains.com/ko-kr/writerside/)
>  - 문서 작성자를 위해, 문서 작성자가 만들었다는 Jetbrains의 문서 작성 도구
>  - 필자는 Jetbrains의 신봉자로서 Writerside를 이용해서 현재 페이지를 운영중이다.
>
{style='note'}

## 📝 Github Actions Workflows 작성
Github Pages에 정적 페이지를 빌드 후 배포하기 위해서는 Jenkins의 Pipeline과 같은 역할을 하는 Github Actions을 사용한다.

### ***Workflows 파일 생성*** {id="workflows_1"}
- _.github/workflows_ 아래 _build-docs.yml_ 파일을 생성한다.
![](20241205_163053.png)

### ***Workflows 작성***
- [공식 문서](https://www.jetbrains.com/help/writerside/deploy-docs-to-github-pages.html#build)를 보고 필요한 부분을 추리고 수정해서 아래와 같은 소스를 완성 했다.
- Job은 간단하게 Build, Deploy로 구성했다.
```yaml
name: Build documentation

on:
  push:
    branches: [ "main" ]
  workflow_dispatch:

permissions:
  id-token: write
  pages: write

env:
  INSTANCE: 'Writerside/in'
  ARTIFACT: 'webHelpIN2-all.zip'
  DOCKER_VERSION: '241.15989'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Build docs using Writerside Docker builder
        uses: JetBrains/writerside-github-action@v4
        with:
          instance: ${{ env.INSTANCE }}
          artifact: ${{ env.ARTIFACT }}
          docker-version: ${{ env.DOCKER_VERSION }}

      - name: Save artifact with build results
        uses: actions/upload-artifact@v4
        with:
          name: docs
          path: |
            artifacts/${{ env.ARTIFACT }}
            artifacts/report.json
          retention-days: 7
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: [ build ]
    runs-on: ubuntu-latest
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: docs

      - name: Unzip artifact
        run: unzip -O UTF-8 -qq '${{ env.ARTIFACT }}' -d dir

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Package and upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dir

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🚀 빌드 및 배포

### ***배포 대상 브랜치 병합***
- 위 소스를 그대로 사용하면 'main' branch에 변화(push or merge)가 생기면 빌드 및 배포가 실행된다.
- 대상 브랜치를 변경하고 싶으면 소스의 아래 부분을 수정한다.
```yaml
...
on:
  push:
    branches: [ "main" ]  # 대상 브랜치 
  workflow_dispatch:
...
```

### ***확인***
- *Actions ➡ Build Number*
- Github Page를 운영중인 Repository에서 배포 상태를 확인 할 수 있다.
![](20241205_165648.png)

## 👋 마치며
지금 보고 있는 이 사이트의 모든 소스는 [여기](https://github.com/rundevelrun/rundevelrun.github.io)에서 확인이 가능하다.

<s id="adsense-bar"></s>