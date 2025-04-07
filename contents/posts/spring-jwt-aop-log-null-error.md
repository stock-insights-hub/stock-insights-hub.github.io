---
emoji: "🧨"
title: "Spring AOP + JWT logger is null 수정"
date: 2025-04-04 16:00:00 +0900
update: 2025-04-04 16:00:00 +0900
tags:
    - spring
    - springboot
    - aop
    - jwt
    - error
---

## ☀️ 테스트 환경
> - OpenJDK 17.0.2
> - Spring Boot 3.0.5


## ✋ 들어가며
JWT를 구현하는 중에 내장 톰캣이 시작되지 못했다는 아주 기분나쁜 에러를 만났다. `"this.logger" is null`, `Unable to start embedded Tomcat`
필자가 겪은 문제는 JWT Filter와 AOP의 조합에서 문제가 생겼는데 오류의 원인과 해결방법을 공유하보려고 한다.
---

## ‼️ 문제의 재구성
실제로 겪었던 문제를 다시 살펴보기 위해서 아래와 같은 문제의 소스를 다시 만들어봤다.
AOP에서는 `PointCut`의 범위를 `JwtAuthenticationFilter`까지 포함할 수 있도록 패키지내 모든 클래스에 진입할때 로그가 발생하도록 작성했다. (이유를 알고 봐도 크게 문제가 없어보인다.)

#### ***문제의 소스코드***

1. Spring Security에서 JWT 토큰 인증을 위한 필터. `OncePerRequestFilter`를 상속
    ```java
    @Slf4j
    public class JwtAuthenticationFilter extends OncePerRequestFilter {
        private final JwtUtil jwtUtil;
        private final UserDetailsService userDetailsService;
    ...
    ```

2. 패키지내 클래스에 진입할 때 로그를 찍는 AOP
    ```java
    @Pointcut("execution(* com.sample..*(..))")
    public void logPointcut() {}
    
    @Before("logPointcut()")
    public void doLog(JoinPoint joinPoint) {
        log.debug("[ENTER] " + joinPoint.getSignature());
    }
    ...
    ```

#### ***에러 내용***
- 실행하면 내장 톰캣이 올라오지 않고 아래와 같은 에러가 발생한다. 다시 봐도 기분이 몹시 나쁘다. `"this.logger" is null`, `Unable to start embedded Tomcat`
    ```java
    Cannot invoke "org.apache.commons.logging.Log.isDebugEnabled()" because "this.logger" is null
    
    Caused by: java.lang.NullPointerException: Cannot invoke "org.apache.commons.logging.Log.isDebugEnabled()" because "this.logger" is null
        at org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:109)
        at com.sample.security.filter.JwtAuthenticationFilter.doFilterInternal(JwtAuthenticationFilter.java:42)
        at org.springframework.security.web.FilterChainProxy.doFilterInternal(FilterChainProxy.java:209)
        at org.springframework.security.web.FilterChainProxy.doFilter(FilterChainProxy.java:178)
    
    Caused by: org.springframework.context.ApplicationContextException: Unable to start web server
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.onRefresh(ServletWebServerApplicationContext.java:164)
    
    Caused by: org.springframework.boot.web.server.WebServerException: Unable to start embedded Tomcat
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer.initialize(TomcatWebServer.java:142)
    ```
---

## ❓왓 더 Logger가 왜 Null인데

Spring Security + JWT + AOP 조합에서 `JwtAuthenticationFilter`가 AOP `PointCut`의 범위에 포함되는 순간 에러가 발생한다.

- Spring AOP는 메서드를 가로채기 위해 프록시 객체를 생성한다.
- AOP는 클래스의 메서드만 프록시로 감싸고, 필드는 복제하지 않는다.
- `JwtAuthenticationFilter`에서 상속받고 있는 `OncePerRequestFilter` 클래스에는 ```if (logger.isDebugEnabled()) {``` 구문이 존재한다.
- 필드는 복제되지 않기 때문에 `logger.isDebugEnabled()` 호출 시 `"this.logger" is null`
- 결국 내장 톰캣은 실행되지 못하고 `Unable to start embedded Tomcat`을 내뱉는다.

---

## ✅ 해결: AOP Pointcut에서 필터 제외시키기

AOP 대상에서 `JwtAuthenticationFilter`를 명시적으로 제외시켜주는걸로 톰캣이 다시 살아났다.

```java
@Pointcut(
        "(execution(* com.sample..*(..)))" 
        + " && !within(com.sample.security.filter.JwtAuthenticationFilter)"
)
public void logPointcut() {}

    @Before("logPointcut()")
    public void doLog(JoinPoint joinPoint) {
        log.debug("[ENTER] " + joinPoint.getSignature());
    }
    ...
```

---

## 👋 마치며
로컬 환경에서도 로그 레벨을 `error`로 해두고 개발을 하다가 콘솔에  
`[Cannot invoke... is null]`이 찍히지 않아서 문제를 정확하게 파악하지 못하고 있었다.
옆자리 은인에게 도움을 받아서 해결.. (결국 로그 레벨의 중요성을 이제야 깨달은 멍청한 나의 탓)