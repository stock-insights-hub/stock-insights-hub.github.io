# Writerside Font 변경하기 (feat. D2Coding)

> ***사전 준비***
>
> ttf 확장자를 가진 폰트 파일
>  - 현재 페이지에서는 네이버에서 만든 [D2Coding](https://github.com/naver/d2codingfont)을 사용했다.
>
{style='note'}

## ✏️ StyleSheet

### ***디렉토리 생성***
- _Writerside/cfg/static_ 경로에 준비한 글꼴 파일을 옮기고 CSS 파일을 생성한다.

![](20241209_132048.png)

### ***CSS 작성***
- font-face를 설정하고 모든 elements 영역의 글꼴을 d2coding으로 설정.

```css
@font-face {
    font-family: d2coding;
    src: url('D2Coding-Ver1.3.2-20180524.ttf');
}
* {
    font-family: d2coding !important;
}
```

## 🛠️ Writerside buildprofiles 설정

### ***Writerside/cfg/buildprofiles.xml***
- *buildprofiles ➡ variables ➡ custom-css* 영역에 생성한 CSS 파일명을 입력한다.
- 
```xml
<?xml version="1.0" encoding="UTF-8"?>
<buildprofiles xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/build-profiles.xsd"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <variables>
        <custom-css>custom.css</custom-css>
    </variables>
    <build-profile instance="in">
        <variables>
            <noindex-content>false</noindex-content>
        </variables>
    </build-profile>
    <footer>
        <link href="https://github.com/rundevelrun">GitHub</link>
        <copyright>2024. RUN:DEVEL:RUN All Rights Reserved.</copyright>
    </footer>
    <sitemap priority="0.35" change-frequency="daily"/>
</buildprofiles>
```

## 👋 마치며
D2Coding을 사용하면 개발을 하면서 구분하지 못하는 문자가 없어져서 좋은데 개발 블로그를 운영할때도 좋은 것 같다.




