---
emoji: "🗄️"
title: "Amazon Linux에 PostgreSQL 수동 설치"
date: 2025-01-20 13:09:00 +0900
update: 2025-01-20 13:09:00 +0900
tags:
  - aws
  - ec2
  - amazon-linux
  - linux
  - postgresql
---

## ☀️ 테스트 환경
> - Amazon Linux 2023 (EC2)
> - PostgreSQL 17.2

## ✋ 들어가며
AWS EC2 환경에 PostgreSQL 17 버전을 설치했는데 [공식 문서↗](https://www.postgresql.org/download/linux/redhat/)를 보고 설치하려 했으나 생각처럼 순탄하게 되지 않아서 수동 설치를 하기로 했다.

## 💾 PostgreSQL 다운로드

#### ***다운로드 링크 확인***
[여기↗](https://ftp.postgresql.org/pub/source/)에서 원하는 버전을 선택하고 postgresql-[_VERSION_].tar.gz의 링크를 복사한다. (EC2에 직접 업로드 하는 경우는 다운로드 후 원하는 위치에 업로드한다.)

#### ***필수 패키지 설치***
```Shell
sudo yum -y install gcc gcc-c++ make autoconf readline readline-devel zlib zlib-devel openssl openssl-devel gettext gettext-devel python python-devel bison flex perl
```

#### ***다운로드 및 압축해제***
```Shell
sudo wget https://ftp.postgresql.org/pub/source/v17.2/postgresql-17.2.tar.gz
```

```Shell
sudo tar zxvf postgresql-17.2.tar.gz
```


## 🚀 PostgreSQL 설치
미리 설치 폴더와 data 폴더를 생성해둔다. (e.g. /postgresql-17.2, /postgresql-17.2/data) 

#### ***소스 코드 빌드***
```Shell
sudo ./configure --prefix=/postgresql-17.2 --with-openssl --sysconfdir=/postgresql-17.2/data
```

_configure: error: ICU library not found_ 에러 발생시 _--without-icu_ 옵션을 추가한다.

```Shell
sudo ./configure --prefix=/postgresql-17.2 --with-openssl --sysconfdir=/postgresql-17.2/data --without-icu
```

#### ***컴파일 및 설치***
```Shell
sudo make
sudo make install
```

## 💿 실행

#### ***설치 폴더 소유권 변경***
PostgreSQL은 sudo 권한으로 실행시 오류가 발생하기 떄문에 설치된 폴더의 소유권을 변경해준다.

```Shell
sudo useradd postgres
sudo chown -R postgres:postgres /postgresql-17.2
```

``` Shell
✔
drwxr-xr-x.  7 postgres postgres    68 Jan  2 04:53 postgresql-17.2
...
```

#### ***환경 변수 설정***
위에서 생성한 계정에 PATH를 설정한다.
```Shell
sudo su - postgres
vi ~/.bashrc
```
```Shell
...
export PATH="$PATH:/postgresql-17.2/bin"
...
```

#### ***초기화***
```Shell
initdb -E utf-8 -D /postgresql-17.2/data
```

#### ***실행 및 확인***
```Shell
pg_ctl -D /postgresql-17.2/data start
```
```Shell
psql -d postgres
```
```Shell
✔
psql (17.2)
Type "help" for help.

postgres=#
```

## 👋

