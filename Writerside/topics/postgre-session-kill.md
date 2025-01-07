# 세션 정보 확인 및 종료

> ***테스트 환경***
>
> PostgreSQL 16.1 (Amazon Aurora)
> - [Amazon Aurora](https://docs.aws.amazon.com/ko_kr/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)는 MySQL 및 PostgreSQL과 호환되는 완전 관리형 관계형 데이터베이스 엔진이다. 
>

## ✋ 들어가며
database를 통으로 날려버리기 위해서 문제의 쿼리를 실행하다가 오류를 발견했다.
없어질 건 없어져야 하기 대문에 세션을 종료하고 쿼리를 실행하는걸로 해결.

### ***문제의 쿼리***
```SQL
drop database _YOUR_DATABASE_NAME_;
```

### ***오류 내용***
```Bash
[55006] ERROR: database "_YOUR_DATABASE_NAME_" is being accessed by other users
Detail: There are `n` other sessions using the database.
```


## 🧹 세션 정보 확인
pg_stat_activity 테이블에서 접속중인 세션 정보를 확인한다.

```SQL
select pid
    , usename
    , application_name 
    , client_addr
from pg_stat_activity
where datname = '_YOUR_DATABASE_NAME_';
```


## 🧲 세션 종료

### ***단건 종료 처리***
```SQL
select pg_terminate_backend(pid);
```

### ***일괄 종료 처리***
```SQL
select pg_terminate_backend(pid)
from pg_stat_activity
where datname = '_YOUR_DATABASE_NAME_';
```

## 👋

<inline-frame src="static/giscus.html" width="100%"/>