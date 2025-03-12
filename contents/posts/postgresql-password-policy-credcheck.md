---
emoji: "📃"
title: "PostgreSQL 패스워드 정책 설정 (CredCheck)"
date: 2025-03-12 14:30:00 +0900
update: 2025-03-12 14:30:00 +0900
tags:
  - postgresql
  - ec2
---

## ️🧪 테스트 환경
> - Amazon Linux 2023 (EC2)
> - PostgreSQL 17.2

## ✋ 들어가며
PostgreSQL을 사용하면서 패스워드 복잡도와 같은 정책들을 적용하게 되었는데 다양한 정책을 쉽게 적용할 수 있는
`CredCheck`를 활용하기로 했다. 'pass123' 같은 쉬운 패스워드를 설정하지 못하게 하려면 `cracklib` 패키지를 추가로 설치해야하는데 이 글에서는 다루지 않는다.

## 🏗️ CredCheck 확장프로그램 설치하기

#### ***다운로드***
만약 Git이 설치되어있지 않다면 [CredCheck↗](https://github.com/HexaCluster/CredCheck)에서 다운받아 아래 경로에 올려둔다.

```shell
cd `PostgreSQL설치경로`/share/contrib
git clone https://github.com/MigOpsRepos/CredCheck
```

#### ***설치 전 설정***
Makefile을 열어서 PG_CONFIG 경로를 지정한다. 

```shell
cd `PostgreSQL설치경로`/share/contrib/credcheck
vi Makefile
```

```shell
...
#PG_CONFIG = pg_config
PG_CONFIG = `PostgreSQL설치경로`/bin/pg_config
...
```

#### ***컴파일 및 설치***
```shell
make
make install
```

#### ***설치 후 설정***
PostgreSQL 데이터 경로에서 `postgresql.conf`를 아래와 같이 수정한다.

```shell
vi `PostgreSQL데이터경로`/postgresql.conf
```
```shell
...
#shared_preload_libraries = ''          # (change requires restart)
shared_preload_libraries = '$libdir/credcheck'
...
```

### ***DB 설정***
데이터베이스에 접근 후 쿼리로 CredCheck 확장 프로그램을 활성화한다.

```sql
create extension credcheck;
select * from pg_extension;
```

아래와 같이 CredCheck 확장 프로그램이 활성화된걸 확인할 수 있다.
```shell
✔
  oid  |  extname  | extowner | extnamespace | extrelocatable | extversion | extconfig | extcondition
-------+-----------+----------+--------------+----------------+------------+-----------+--------------
 22488 | credcheck |       10 |         2200 | f              | 3.0.0      |           |
...
```


## 🔐️ PostgreSQL 패스워드 정책 설정
설치가 완료되었으면 이제 아주 간단하게 패스워드 정책을 설정할 수 있다. 모든 작업은 데이터베이스에 접근해서 쿼리로 수행한다.

#### ***사용가능한 정책 목록***

| Check                       | Type     | Description                                         									  |
|-----------------------------|----------|------------------------------------------------------------------------------------------|
| `username_min_length      ` | username | 사용자 이름의 최소 길이                            									  |
| `username_min_special     ` | username | 최소 특수 문자 수                                  									  |
| `username_min_digit       ` | username | 최소 숫자 수                                      									  |
| `username_min_upper       ` | username | 최소 대문자 수                                    									  |
| `username_min_lower       ` | username | 최소 소문자 수                                    									  |
| `username_min_repeat      ` | username | 문자가 반복될 수 있는 최대 횟수                    									  |
| `username_contain_password` | username | 사용자 이름에 비밀번호가 포함되어서는 안 됨         									  |
| `username_contain         ` | username | 사용자 이름에 다음 문자 중 하나가 포함되어야 함   									  |
| `username_not_contain     ` | username | 사용자 이름에 다음 문자가 포함되어서는 안 됨      									  |
| `username_ignore_case     ` | username | 위의 검사를 수행할 때 대소문자를 무시함           									  |
| `password_min_length      ` | password | 비밀번호의 최소 길이                                									  |
| `password_min_special     ` | password | 최소 특수 문자 수                                  									  |
| `password_min_digit       ` | password | 비밀번호의 최소 숫자 수                            									  |
| `password_min_upper       ` | password | 최소 대문자 수                                    									  |
| `password_min_lower       ` | password | 최소 소문자 수                                    									  |
| `password_min_repeat      ` | password | 문자가 반복될 수 있는 최대 횟수                    									  |
| `password_contain_username` | password | 비밀번호에 사용자 이름이 포함되어서는 안 됨        									  |
| `password_contain         ` | password | 비밀번호에 다음 문자가 포함되어야 함               									  |
| `password_not_contain     ` | password | 비밀번호에 다음 문자가 포함되어서는 안 됨         									  |
| `password_ignore_case     ` | password | 위의 검사를 수행할 때 대소문자를 무시함           									  |
| `password_valid_until     ` | password | 최소 일수와 함께 CREATE ROLE 문에서 VALID UNTIL 절 사용 강제화                       |
| `password_valid_max       ` | password | 최대 일수와 함께 CREATE ROLE 문에서 VALID UNTIL 절 사용 강제화                       |

#### ***정책 적용 방법***
`ALTER SYSTEM SET` 구문을 이용해서 위 정책들을 하나씩 설정할 수 있다.

```sql
ALTER SYSTEM SET credcheck.password_min_length = 8; -- 비밀번호의 최소 길이
ALTER SYSTEM SET credcheck.password_min_special = 1; -- 특수문자 포함
ALTER SYSTEM SET credcheck.password_min_digit = 1; -- 숫자 포함
ALTER SYSTEM SET credcheck.password_min_upper = 1; -- 대문자 포함
ALTER SYSTEM SET credcheck.password_min_lower = 1; -- 소문자 포함
ALTER SYSTEM SET credcheck.password_contain_username  = on; -- 사용자명 포함 불가

SELECT pg_reload_conf();
```

설정된 정책을 확인하기 위해서는 `SHOW` 구문을 사용해서 출력한다.
```sql
SHOW credcheck.password_min_length;
```
```shell
✔
 credcheck.password_min_length
-------------------------------
 8
```

#### ***테스트***
위 설정이 모두 끝났다면 실제로 User를 생성해보면 정상적으로 설정되었는지 확인할 수 있다.

```sql
CREATE USER aa WITH PASSWORD 'aaa';
```

설정하려고하는 패스워드의 길이가 8자리가 안되기 떄문에 어림없다는 메시지와 함께 정상 설정 되었음을 알 수 있다.
```shell
```sql
✔
ERROR:  password length should match the configured credcheck.password_min_length (8)
```

## 👋 마치며
PostgreSQL에서 안전한 비밀번호 관리 절차와 작성 규칙을 수립하기 위해서 `CredCheck`를 사용해봤는데 간단하고 유용한 것 같다.
