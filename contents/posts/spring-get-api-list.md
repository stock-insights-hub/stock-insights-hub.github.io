---
emoji: "📖"
title: "Spring Annotation 값 읽기 (API 전체 목록 조회)"
date: 2025-04-03 16:30:00 +0900
update: 2025-04-03 16:30:00 +0900
tags:
   - spring
   - springboot
   - annotation
---

## ☀️ 테스트 환경
> - OpenJDK 17.0.2
> - Gradle 8.0.2
> - Spring Boot 3.0.5

## ✋ 들어가며
API 권한 관리 화면을 만들기 위해서 전체 API의 전체 목록을 조회해야 하는 상황이 생겨버렸다.

첫번째로 생각했던 방법은 프로젝트에 설정되어있는 스웨거 화면을 크롤링하는 것이었는데 스웨거가 없는 환경에서도 언젠가 활용할지도 모른다는 생각에 이 포스팅의 목적인 두번째 아이디어를 실행하기로 했다.

## 💡 아이디어

#### ***API가 구성된 패턴***
내가 뽑아와야할 API는 주소와 메소드를 확인할 수 있도록 아래와 같은 형태로 구성이 되어있다.
```java
@RequestMapping("/api")
public class SampleController {
   @GetMapping(value = "/v1/get", produces = MediaType.APPLICATION_JSON_VALUE)
   public ... {}
    
   @PostMapping(value = "/v1/post", produces = MediaType.APPLICATION_JSON_VALUE)
   public ... {}
   
   @PutMapping(value = "/v1/put", produces = MediaType.APPLICATION_JSON_VALUE)
   public ... {}
    
   @DeleteMapping(value = "/v1/delete", produces = MediaType.APPLICATION_JSON_VALUE)
   public ... {}
}
```

#### ***만들어내고 싶은 데이터의 모습***

| className                   | apiUrl         | httpMethod |
|-----------------------------|----------------|------------|
| com.sample.SampleController | /api/vi/get    | GET        |
| com.sample.SampleController | /api/vi/post   | POST       |
| com.sample.SampleController | /api/vi/delete | DELETE     |
| com.sample.SampleController | /api/vi/put    | PUT        |

#### ***그래서 어떻게 만들건데?***
패키지내 모든 클래스와 메소드를 순회하면서
`@RequestMapping`, `@GetMapping`, `@PostMapping`, `@DeleteMapping`, `@PutMapping`에 포함된 값을 읽어오는 클래스를 만들어보자


## 💿 실현된 아이디어
설명을 좀 해보려고 했는데 `com.sample` 패키지 내 모든 컨트롤러 또 컨트롤러 하위에 있는 메소드들을 모두 스캔하면서
Annotation의 값을 읽어오는게 전부라 별로 할말이 없다.

```java
package com.sample;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

public class APIFinder {
    public static void main(String[] args) {
        ClassPathScanningCandidateComponentProvider provider = new ClassPathScanningCandidateComponentProvider(false);
        provider.addIncludeFilter(new AnnotationTypeFilter(Controller.class));

        Set<BeanDefinition> controllerBeans = provider.findCandidateComponents("com.sample");

        for (BeanDefinition beanDefinition : controllerBeans) {
            String className = beanDefinition.getBeanClassName();
            Class<?> clazz = ClassUtils.resolveClassName(className, ClassUtils.getDefaultClassLoader());

            RequestMapping requestMapping = clazz.getAnnotation(RequestMapping.class);
            String prefix = requestMapping.value()[0];

            for (java.lang.reflect.Method method : clazz.getMethods()) {
                GetMapping getMapping = method.getAnnotation(GetMapping.class);
                PostMapping postMapping = method.getAnnotation(PostMapping.class);
                PutMapping putMapping = method.getAnnotation(PutMapping.class);
                DeleteMapping deleteMapping = method.getAnnotation(DeleteMapping.class);

                String mapping = "";
                String methodStr = "";
                
                if(getMapping != null){
                    methodStr = "GET";
                    String [] arr = method.getAnnotation(GetMapping.class).value();
                    if(arr.length != 0){
                        mapping = arr[0];
                    }
                }else if(postMapping != null){
                    methodStr = "POST";
                    String [] arr = method.getAnnotation(PostMapping.class).value();
                    if(arr.length != 0){
                        mapping = arr[0];
                    }
                }else if(putMapping != null){
                    methodStr = "PUT";
                    String [] arr = method.getAnnotation(PutMapping.class).value();
                    if(arr.length != 0){
                        mapping = arr[0];
                    }
                }else if(deleteMapping != null){
                    methodStr = "DELETE";
                    String [] arr = method.getAnnotation(DeleteMapping.class).value();
                    if(arr.length != 0){
                        mapping = arr[0];
                    }
                }
                if(!methodStr.equals("")){
                    System.out.println(className + "\t" + prefix + mapping + "\t" + methodStr);
                }
            }
        }
    }
}
```

```shell
✔
com.sample.SampleController   /api/vi/get       GET
com.sample.SampleController   /api/vi/post      POST
com.sample.SampleController   /api/vi/delete    DELETE
com.sample.SampleController   /api/vi/put       PUT
```

## 👋 마치며
깔끔하게 짜여진 소스는 아니지만 언젠가 필요할지도 모르겠다.

