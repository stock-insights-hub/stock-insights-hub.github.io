# Spring Custom Annotation 만들기 (Feat. AOP)

> ***테스트 환경***
>
> OpenJDK 17.0.2
> 
> Gradle 8.0.2
> 
> Spring Boot 3.0.5

## ✋ 들어가며
_@Scheduled_ Annotation으로 정해진 시간에 수행되는 메소드를 구현했다.
해당 Annotation을 사용하는 메소드 내에서 정상 여부의 로그를 남기기 위해서는 똑같은 소스를 매번 작성해야하는 문제가 발생했다.

그리하여 _@Scheduled_ Annotation을 커스텀하고 AOP를 활용하여 해당 Annotation을 사용할때 로그를 남기도록 구현해보고자한다.

### ***문제의 소스***
> ***로그를 남기기 위해서 매번 같은 소스가 작성되어 있다.***
>
> logService.insertLog(result);
{style="warning"}
```Java
@Component
public class ScheduledComponent {
    @Scheduled(cron= "0 0 0 * * *")
    public Map<String, Object> scheduled1() {
        ...
        // 로그 저장
        logService.insertLog(result);
        ...
        return result;
    }
    @Scheduled(cron= "0 0 1 * * *")
    public int scheduled2() {
        ...
        // 로그 저장
        logService.insertLog(result);
        ...
        return result;
    }
    ...
}
```

## 🧰 AOP를 통한 Custom Annotation 처리

### ***CustomScheduled.java***
1. @Target : Annotation이 적용될 위치
    - @CustomScheduled를 메소드에 적용하기 위해서 `ElementType.METHOD` 사용
2. @Retention : Annotation이 적용될 범위
    - 런타임까지 유지되는 Annotation을 정의하기 위해서 `RetentionPolicy.RUNTIME` 사용 
3. @Scheduled : Scheduled Annotation과 같은 동작을 위해서 사용
```Java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Scheduled
public @interface CustomScheduled {
    String cron() default "";
}
```

### ***CustomScheduledAspect.java*** ###
1. AOP가 구현된 클래스에는 *@Aspect* Annotation을 사용한다. 
2. 해당 클래스의 메소드에는 AOP를 적용할 패턴 혹은 관심사를 구현할 수 있다.
    - @Before : 패턴이 실행되기 전에 동작
    - @After : 패턴이 실행된 이후에 동작
    - @Around : 패턴이 실행되기 전, 후 모두 동작 (실행결과 반환을 위해 반환 값은 Object)
3. 예제에서는 *@CustomScheduled*가 사용된 클래스명, 메소드명 그리고 결과를 로그 테이블에 저장하고 있다 
```Java
@Aspect
@Component
public class CustomScheduledAspect {

    @Around("@annotation(customScheduled)")
    public Object handleWsfScheduled(ProceedingJoinPoint joinPoint, CustomScheduled customScheduled) throws Throwable {

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();

        // 실행
        Object result = joinPoint.proceed();

        Map<String, Object> logParam = new HashMap<String, Object>();
        logParam.put("className", joinPoint.getSignature().getDeclaringTypeName());
        logParam.put("methodName", joinPoint.getSignature().getName());
        logParam.put("result", result.toString());

        // 배치 로그 저장
        logService.insertLog(param);

        return result;

    }
}
```

### ***Custom Annotation 사용***
> *@CustomScheduled*를 사용하면 로그 관련 처리는 AOP에서 하고 있기 때문에 메소드에는 비즈니스 로직 수행 및 결과 반환에 대한 소스만 작성되어 있다. 
{style="note"}
```Java
@Component
public class ScheduledComponent {
    @CustomScheduled(cron= "0 0 0 * * *")
    public Map<String, Object> scheduled1() {
        ...
        return result;
    }
    @CustomScheduled(cron= "0 0 1 * * *")
    public Map<String, Object> scheduled2() {
        ...
        return result;
    }
    ...
}
```

## 👋

<inline-frame src="static/giscus.html" width="100%" height="100px"/>