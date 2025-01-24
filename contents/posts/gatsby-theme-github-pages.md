---
emoji: "💬"
title: "Gatsby 테마 설치 후 Github Pages에 배포하기 (feat. gatsby-starter-rundevelrun)"
date: 2025-01-24 13:20:00 +0900
update: 2025-01-24 13:20:00 +0900
tags:
   - github-pages
   - blog
   - gatsby
series: "📝 나만의 블로그를 운영하며"
---

## ✋ 들어가며
지금 보고있는 이 글의 시리즈에서 알 수 있듯이 얼마전까지는 Jetbrains에서 만든 문서도구인 [Writerside](https://www.jetbrains.com/ko-kr/writerside/)로 블로그를 운영했었는데 
정말 좋은 도구임은 틀림 없지만 블로그와는 좀 맍지 않는 부분이 많이 있었다. (아마도 API 문서 등에 적합할 것 같다.)
그리하여 Gatsby를 이용한 블로그를 만들게 되었다.

> ☑️ Gatsby는 React와 GraphQL을 사용하여 Node.js 위에 구축된 오픈 소스 정적 사이트 생성기 입니다.
> <br/><br/>
> 출처 : [위키백과↗](https://en.wikipedia.org/wiki/Gatsby_(software))

## 🤔 왜 Gatsby를 선택했나?

1. Markdown 형식의 포스트 (Markdown, JSX가 포함된 MDX)
   - Writerside에서 작성한 글들을 최소한의 수정으로 사용하기 위함
2. Adsense 등 2500개 이상의 플러그인
3. 필자가 더 알아가고 싶은 React 기반 
4. 많은 수의 레퍼런스
5. 블로그를 운영하면서 원하는건 모두 할 수 있을 것 같은 자유도 (GraphQL 등)

## 🌱 테마 제작기

> ☑️ 제작한 테마는 누구나 사용할 수 있도록 [Github↗](https://github.com/rundevelrun/gatsby-starter-rundevelrun)에 공개되어있다.

편하게 사용할 수 있도록 [devHudi↗](https://github.com/devHudi/gatsby-starter-hoodie)님이 공개해주신 소스를 바탕으로 수정을 진행했다.

1. SEO 최적화 진행
2. Adsense 광고
   - 본문 상/하단, 리스트 사이, ToC 하단에 광고 표시
3. 본문 Emoji 영역과 Title 분리
4. UI 변경
5. 마이너한 버그 수정


## 🏗️ 테마 설치하기

> ☀️ ***테스트 환경***
> <br/><br/>
> - NodeJS v22.13.0
> - yarn 1.22.22

#### ***NodeJS 설치***
자신의 OS에 맞는 [NodeJS↗](https://nodejs.org/ko/download) 설치

#### ***Yarn 설치***
```shell
npm install -g yarn
```

#### ***gatsby-cli 설치***
```shell
yarn global add gatsby-cli
```

#### ***gatsby-starter-rundevelrun 테마 설치***
```shell
gatsby new your-blog-name https://github.com/rundevelrun/gatsby-starter-rundevelrun.git
```

## 🤖 구동하기

#### ***의존성 패키지 설치***
```shell
cd your-blog-name
yarn install
```

#### ***구동***
구동 후 `http://localhost:8000`으로 접속한다.
```shell
yarn develop
```

## 👨‍💻 사용자화
`blog-config.js`의 내용을 자신에게 맞게 수정한다.

```javascript
module.exports = {
  title: "YOUR:BLOG:NAME",    // SEO Blog title
  headerTitle: "YOUR:<em style='color:#ed6c02'>BLOG</em>:NAME", // Logo 1
  headerSubTitle: "<em style='color:#ed6c02'>YOUR</em>:BLOG:<em style='color:#ed6c02'>NAME</em>", // Logo 2
  copyright: "©YOUR:BLOG:NAME", // copyright in footer
  author: "YOUR:NAME",  // Your Name
  description: "Hi, Nice to meet you !",  // description
  siteUrl: "https://6developer.com/", // Your Site URL
  links: {
    github: "https://github.com/rundevelrun",
    ...
  },
  giscus: {
    ...
  },
  adsense: { 
    ...
  }
}
```

1. title : SEO에서 사용할 블로그명
2. headerTitle : 블로그에 표시될 제목 (HTML 태그 가능)
3. headerSubTitle : 블로그에 표시될 부제목
   - HTML 태그 가능
   - 옵션 값이며 있는 경우 블로그의 로고 영역이 5초마다 바뀐다.
4. copyright : Footer 영역에 표시될 저작권 표시 이름
5. author : 루트 페이지와 포스트 하단에 표시되는 작성자 이름
6. description : 루트 페이지와 포스트 하단에 표시되는 작성자 설명
7. siteUrl : 현재 블로그 URL
8. links : 루트 페이지와 포스트 하단에 표시되는 Icon의 링크 목록
9. giscus : 댓글 기능을 사용하기 위한 Giscus 정보
10. adsense : 광고 기능을 사용하기 위한 Adsense 정보


## 📝 포스트 작성하기
1. `contents/posts` 폴더에 게시글 파일 생성 (두가지 방법)
   - pathname으로 사용할 이름의 폴더를 만들고 하위에 'index.md'를 생성
   - pathname으로 사용할 이름으로 `*.md` 파일 생성
2. frontmatter 작성
   ```yaml
   ---
   emoji: "🚀"
   title: "어떻게 시작할까요?"
   date: 2025-01-19 13:53:00
   update: 2025-01-19 13:53:00
   tags:
      - rundevelrun
      - howto
   series: "Gatsby 블로그 시작하기"
   ---
   ```

## 🚀 Github Pages 배포하기
Gatsby를 인수한 [Netlify](https://app.netlify.com/)를 아용한 아주 쉬운 배포 방법도 있지만 이 글에서는 Github Action을 이용하려고한다. 
필자의 경우 Git branch를 2개를 사용하고 있는데 `gatsby`에는 전체 소스가 올라가고 `main`에는 빌드된 소스가 배포된다.


#### ***workflow 작성*** `.github/workflows/ci.yml`
배포된 소스는 main에 push될 예정이므로 branchs 부분을 `main`으로 설정했다.
```yaml
# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          # Upload entire repository
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### ***배포 스크립트 작성*** `package.json`

빌드된 정적 소스를 `main`에 배포하는 스크립트
```json
...
"scripts": {
   ...
   "deploy": "gatsby build && gh-pages -d public -b main"
},
```

#### ***배포 브랜치 최신화***
배포 브랜치(현재 글에서는 main)에 위에서 작성한 `ci.yml`이 없는 상태라면 Github Action이 동작하지 않기 때문에 먼저 소스를 최신화한다.

#### ***배포***
`main` 브랜치에 빌드된 소스 push가 이루어지고 이후 `ci.yml`의 파이프라인이 동작한다.
```shell
yarn deploy
```

## 👋 마치며
작성하다보니 너무 긴 글을 작성한 것 같다. 다음엔 조절해야지