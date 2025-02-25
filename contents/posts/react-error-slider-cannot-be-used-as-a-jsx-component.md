---
emoji: "️🌋"
title: "ERROR. 'Slider' cannot be used as a JSX component."
date: 2025-01-20 14:12:00 +0900
update: 2025-01-20 14:12:00 +0900
tags:
    - react
    - error
---

## ☀️ 테스트 환경
> - node v20.16.0
> - yarn 1.22.22
> - react ^18.2.0

## ⛔ ERROR

#### ***어제까지는 잘 되던게 갑자기 안됨***
- _yarn.lock_ 파일삭제하고 다시 `yarn install` 실행 후 `build`를 수행하면 아래와 같은 오류가 발생한다.

```javascript
error TS2322: Type '{ children: Element[]; dots: boolean; infinite: boolean; speed: number; slidesToShow: number; slidesToScroll: number; autoplay: boolean; autoplaySpeed: number; centerMode: boolean; swipeToSlide: boolean; ... 5 more ...; ref: RefObject<...>; }' is not assignable to type 'Readonly<Settings>'.
  Types of property 'appendDots' are incompatible.
    Type '(dots: ReactNode) => JSX.Element' is not assignable to type '(dots: ReactNode) => Element'.
      Types of parameters 'dots' and 'dots' are incompatible.
        Type 'import("~~").ReactNode' is not assignable to type 'React.ReactNode'.
          Type 'bigint' is not assignable to type 'ReactNode'.

        <Slider ref={sliderRef} {...settings}>
```

```javascript
error TS2786: 'Slider' cannot be used as a JSX component.
Its type 'typeof Slider' is not a valid JSX element type.
Types of construct signatures are incompatible.
Type 'new (props: Settings) => Slider' is not assignable to type 'new (props: any, deprecatedLegacyContext?: any) => Component<any, any, any>'.
Property 'refs' is missing in type 'Slider' but required in type 'Component<any, any, any>'.

        <Slider ref={sliderRef} {...settings}>
```

## ❓ 왜

#### ***설지된 패키지(@types/react) 버전이 이상하다***
- 문제의 패키지 버전을 `^18.2.43`으로 명시해놓고 사용하는데 `yarn install` 이후 생성된 _yarn.lock_ 파일에는 `19.0.1`로 설치가 되었다.

```json
// package.json

...
"devDependencies": {
  "@types/react": "^18.2.43",
...
```

```json
// yarn.lock

...
"@types/react@*", "@types/react@>=16":
  version "19.0.1"
  resolved "https://~~~"
  integrity ~~~
  dependencies:
    csstype "^3.0.2"
...
```

#### ***하위 의존성 패키지 문제***
- _package.json_ 에 명시되어있는 몇개의 패키지가 하위 의존성 패키지로 _@types/react_ 의 버전을 `19.0.1`로 불러오고 있었다. 아래 두가지 패키지가 문제였다.

```JSON
// package.json

...
"dependencies": {
  "@mui/material": "^5.15.0",        
},
"devDependencies": {
  "@types/react-slick": "^0.23.13" ,
...
```

## ✅ 해결

#### ***하위 패키지 버전 명시***
- 여러 패키지가 동일한 의존성을 가질 때 버전을 일관되게 유지할 수 있도록 [resuolutions↗](https://classic.yarnpkg.com/lang/en/docs/selective-version-resolutions/)를 사용 할 수 있다.

```JSON
// package.json

...
"resolutions": {
  "@types/react": "^18.2.43",
}
```

## 👋 마치며
별게 다 속을 썩인다.

