---
emoji: "☝️"
title: "무료 블로그 방문자 카운터 만들기 | 설치부터 배포까지 요구사항 총정리"
date: 2025-04-26 13:30:00 +0900
update: 2025-04-29 17:30:00 +0900
tags:
  - visitorcounter
  - opensource
  - free
  - blog
  - github-pages
  - react
  - flask
series: "📊 블로그/홈페이지 방문자 카운터 무료 배포하기"
description: "무료로 사용할 수 있는 블로그 및 홈페이지 방문자 카운터를 직접 제작합니다. Flask API 서버와 React 컴포넌트를 조합하여 Github Pages에서도 쉽게 설치할 수 있는 방법을 소개합니다."
---

## ✋ 들어가며
`웹사이트용 방문자 카운터 무료 배포하기` 시리즈의 첫번째 포스팅이다.
티스토리, 네이버 블로그 등에서는 당연히 있고 없으면 안되는 부가 기능 중에 하나가 `방문자 카운터`가 아닐까?

일반적인 블로그 처럼 접속하면 바로 보이는 *총 방문자, 오늘 방문자*가 필자와 같이 `Github Pages`등을 이용해서 운영하는 블로그에도 표시되면 좋겠다는 생각으로 이 시리즈를 시작하게 되었다.

## 😎 완성된 소스 미리보기
사실 이미 완료되어 서비스를 진행중이기 때문에 급하신 분들은 아래 링크를 확인하면 된다.

- **API & Dashboard**
  - [대시보드 화면](https://visitor.6developer.com/dashboard?domain=6developer.com)
  - [API 문서](https://visitor.6developer.com/api-docs)
  - [소스 공개 (Github)](https://github.com/rundevelrun/free-visit-counter-api-dashboard)
- **NPM Package**
  - [NPM Registry](https://www.npmjs.com/package/@rundevelrun/free-visitor-counter)
  - [소스 코드 (Github)](https://github.com/rundevelrun/free-visitor-counter)
- **적용된 블로그 테마**
  - [Gatsby테마(gatsby-starter-rundevelrun)](https://github.com/rundevelrun/gatsby-starter-rundevelrun)

## 📋 무료 방문자 카운터 요구사항을 분석

### 기능 요구사항 (Functional Requirements)

#### ***백엔드 (API 서버)***

| ID    | 기능명           | 설명 |
|:------|:--------------|:---|
| FR-01 | 방문자 기록 API 제공 | 웹사이트 접속 시 방문자 데이터를 기록한다. |
| FR-02 | 중복 방문 방지      | Redis를 이용하여 20분 이내 재접속 시 중복 카운트 방지한다. |
| FR-03 | 대시보드 제공       | 기간별 방문자 수, 리퍼러, 검색어 등을 시각화하여 보여준다. |
| FR-04 | API 문서 제공     | API 명세를 제공하여 외부 시스템 연동이 가능하도록 지원한다. |
| FR-05 | 다국어 지원        | 대시보드 페이지는 영어, 한국어, 일본어를 지원한다. |
| FR-06 | 다크/라이트 테마 지원  | 사용자 브라우저 설정에 따라 테마를 자동 적용한다. |

#### ***프론트엔드 (React 컴포넌트)***

| ID    | 기능명 | 설명 |
|:------|:---|:---|
| FR-07 | 방문자 수 표시 | 총 방문자 수 및 오늘 방문자 수를 표시한다. |
| FR-08 | 스타일 커스터마이징 | 표시 텍스트, 구분자, 스타일 등을 커스터마이징할 수 있다. |
| FR-09 | 비동기 호출 및 데이터 갱신 | API 호출 결과를 받아 비동기적으로 렌더링한다. |

---

### 비기능 요구사항 (Non-Functional Requirements)

| ID | 항목 | 설명 |
|:---|:---|:---|
| NFR-01 | 무료 배포 | 시스템은 누구나 무료로 사용할 수 있어야 한다. |
| NFR-02 | 소스코드 공개 | 소스코드는 GitHub에 공개하며, MIT 라이선스를 적용한다. |
| NFR-03 | 경량화된 구성 | 빠른 로딩을 위해 API 서버와 React 컴포넌트는 경량화되어야 한다. |
| NFR-04 | 반응형 UI 지원 | 대시보드는 PC, 태블릿, 모바일에서도 잘 작동해야 한다. |
| NFR-05 | 데이터베이스 안정성 | PostgreSQL을 사용하여 방문자 기록을 안정적으로 저장한다. |
| NFR-06 | 서버 보안 | 모든 API 호출은 HTTPS를 통해 이루어져야 한다. |
| NFR-07 | NPM 패키지 배포 | React 방문자 카운터 컴포넌트는 NPM Public Registry에 배포하여 누구나 설치할 수 있어야 한다. |
| NFR-08 | 형상 관리 | 프로젝트는 GitHub를 통해 형상 관리 및 버전 관리가 이루어져야 한다. |

---

### 운영 및 배포 요구사항 (Deployment & Operations Requirements)

| ID | 항목 | 설명 |
|:---|:---|:---|
| DOR-01 | 배포 환경 | 백엔드 서버는 cPanel 기반 환경에서 Passenger WSGI를 이용해 구동되어야 한다. |
| DOR-02 | 데이터베이스 연결 | PostgreSQL 데이터베이스와 연결하여 방문자 데이터를 저장해야 한다. |
| DOR-03 | Redis 연결 | 방문자 중복 처리를 위해 Redis 서버가 설치 및 연결되어야 한다. |
| DOR-04 | 환경 변수 관리 | `.env` 파일을 통해 데이터베이스, Redis, 보안 키 등 환경 설정을 관리해야 한다. |
| DOR-05 | HTTPS 지원 | 운영 서버는 반드시 SSL 인증서를 적용하여 HTTPS 통신을 지원해야 한다. |
| DOR-06 | 서버 사이드 렌더링 (SSR) | 대시보드 및 웹페이지는 Flask + Jinja 템플릿 엔진을 사용하여 서버 사이드 렌더링 방식으로 제공되어야 한다. |
| DOR-07 | 다국어 및 테마 대응 | 대시보드는 브라우저 설정에 따라 다국어 및 다크/라이트 테마를 자동 적용해야 한다. |
| DOR-08 | 유지보수 편의성 | 코드 및 환경 설정은 cPanel 환경에서도 수정과 유지보수가 용이하도록 구성되어야 한다. |
| DOR-09 | NPM 패키지 유지관리 | 배포된 NPM 패키지는 주기적으로 업데이트 및 유지보수되어야 한다. |
| DOR-10 | GitHub 관리 | 모든 소스코드 변경사항은 GitHub 저장소를 통해 관리하고, 이슈/PR 기반으로 개발 프로세스를 유지해야 한다. |


## 👋 마치며
이 시리즈에서는 **Flask 백엔드 API + React 컴포넌트** 조합으로
누구나 쉽게 설치할 수 있는 방문자 카운터를 만들어 배포하는 과정을 다룰 예정인데 무료로 배포하는 만큼 많은 사람들이 사용할 수 있으면 좋겠다.