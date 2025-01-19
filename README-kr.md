<h1 align="center">
  👋
</h1>
<h1 align="center">
  gatsby-starter-rundevelrun
</h1>


## 🎬 시작

<img src="screen.png"/>

Gatsby를 사용하기 전에는 Jetbrains의 [Writerside↗](https://www.jetbrains.com/help/writerside/discover-writerside.html)를 이용해서 개인 블로그를 운영하면서 디자인적인 요소들은 상당히 만족스러웠지만
문서의 목적으로 만들어진 도구이기 때문에 블로그 운영에는 적합하지 않은 부분이 많이 있었습니다. (RSS Feed 미지원, 사용자화의 어려움, GraphQL 미지원 등)

그러던 중 정말 감사하게도 아주 깔끔하게 제작된 소스를 Github에 공개해주신 [devHudi↗](https://github.com/devHudi/gatsby-starter-hoodie)님 덕분에 Gatsby에 입문할 수 있었고, 제가 필요한 부분을 일부 수정하는 과정을 거쳤지만 대부분의 소스는 원본소스를 바탕으로 제작되었습니다.

깊은 감사의 말씀을 전해드립니다.

## ▶️️ Live Demo

> [https://6developer.com](https://6developer.com)

## ✅ 주요 기능

주요한 기능은 [devHudi↗](https://github.com/devHudi/gatsby-starter-hoodie)님이 작성하신 내용을 가지고 왔습니다.
> - 마크다운
> - 코드 하이라이팅
> - Katex 문법
> - 다크모드 (OS 환경설정과 연동)
> - 태그 분류
> - 시리즈 분류
> - 반응형 웹
> - SEO
> - Giscus

## ✍️ 수정된 내용

### 2025.01.19
1. SEO에 사용되는 title 외 headerTitle, headerSubTitle이 추가되었습니다.
    - headerTitle, headerSubTitle은 Html 태그를 지원합니다.
    - headerSubTitle이 있는 경우 5초에 한번 Title 영역을 변경합니다.
2. Frontmatter에 'emoji' 추가
    - SEO Title에 Emoji가 포함되지 않은 제목만 표시하기 위함
3. SEO 수정
    - 게시글의 제목 뒤에 블로그의 제목이 추가되었습니다. <br/> e.g. 'Overview | YOUR:BLOG:NAME'
    - '/' 페이지에서는 블로그의 제목만 표시합니다. <br/> e.g. 'YOUR:BLOG:NAME'
4. '/' 페이지에 검색기능을 추가했습니다.
5. '/' 및 '/search' 페이지에 검색된 게시글의 수를 Badge로 표시합니다
6. title과 copyright를 구분했습니다.
7. 일부 UI 요소 변경


## 🧪 테스트 환경
> NodeJS v22.13.0 <br/>
> yarn 1.22.22

## 🛠️ 환경 설정
1. [NodeJS↗](https://nodejs.org/ko/download) 설치
2. yarn 설치
   ```shell
   npm install -g yarn
   ```
3. gatsby-cli 설치
   ```shell
   yarn global add gatsby-cli
   ```
4. Gatsby 블로그 생성
   ```shell
   gatsby new your-blog-name https://github.com/rundevelrun/gatsby-starter-rundevelrun.git
   ```

## 🚀 개발 환경 구동
아래 과정을 거친 후 `http://localhost:8000`으로 접속
1. 의존성 패키지 설치
   ```shell
   cd your-blog-name
   yarn install
   ```
2. 구동
   ```shell
   yarn develop
   ```

## ☺️ 사용자화
`blog-config.js`의 내용 수정

```javascript
module.exports = {
  title: "YOUR:BLOG:NAME",    // SEO Blog title
  headerTitle: "YOUR:<em style='color:#ed6c02'>BLOG</em>:NAME", // Logo 1
  headerSubTitle: "<em style='color:#ed6c02'>YOUR</em>:BLOG:<em style='color:#ed6c02'>NAME</em>", // Logo 2
  copyright: "©YOUR:BLOG:NAME", // copyright in footer
  author: "YOUR:NAME",  // Your Name
  siteUrl: "https://6developer.com/", // Your Site URL
  description: "Hi, Nice to meet you !",  // Blog description
  links: {
    github: "https://github.com/rundevelrun",
    ...
  },
  giscus: {
    ...
  },
}
```

## 📝 게시글 작성
1. `contents/posts` 폴더에 게시글 파일 생성 (두가지 방법)
    1. pathname으로 사용할 이름의 폴더를 만들고 하위에 'index.md'를 생성
    2. pathname으로 사용할 이름으로 `*.md` 파일 생성
2. frontmatter 작성
   ```yaml
   ---
   emoji: "🚀"
   title: "2. 어떻게 시작할까요?"
   date: 2025-01-19 13:53:00
   update: 2025-01-19 13:53:00
   tags:
      - rundevelrun
      - howto
   series: "Gatsby 블로그 시작하기"
   ---
   ```