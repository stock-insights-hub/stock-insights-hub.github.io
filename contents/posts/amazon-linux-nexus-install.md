---
emoji: "🔗"
title: "Amazon Linux에 Nexus 설치하기"
date: 2025-01-20 12:21:00 +0900
update: 2025-01-20 12:21:00 +0900
tags:
  - aws
  - ec2
  - amazon linux
  - nexus
---


> ☀️ ***테스트 환경***
> <br/><br/>
> - Amazon Linux 2023 (EC2)
> - OpenJDK 17.0.2
> - Nexus 3.75.1-01

## ✋ 넥서스란?
Nexus는 Sonartype에서 만든 Repository Manager 솔루션이다. Node 기반의 Package나 Gradle, Maven 기반의 Library 등 다양한 Format의 저장소를 지원한다.

## 🚀 Nexus 다운로드 및 설치

> ☑️ JRE 환경에서 구동되기 때문에 JRE 혹은 JRE가 포함된 JDK의 설치가 필수적이다.


[Nexus 다운로드↗](https://help.sonatype.com/en/download-archives---repository-manager-3.html)에서 원하는 버전을 다운로드하거나 링크를 복사해둔다.

#### ***다운로드***
원하는 위치에 다운로드한 파일을 업로드하거나 wget을 이용해서 다운로드 한다.
```shell
cd /nexus
sudo wget https://download.sonatype.com/nexus/3/nexus-3.75.1-01-unix.tar.gz
```

#### ***압축풀기***
```shell
sudo tar zxvf nexus-3.75.1-01-unix.tar.gz
```

#### ***계정 생성***
- 넥서스를 기동할 계정을 생성하고 위에서 압축해제된 폴더 2개의 소유권을 변경한다.
    ```shell
    sudo adduser nexus
    sudo chown -R nexus:nexus /nexus/nexus-3.75.1-01
    sudo chown -R nexus:nexus /nexus/sonatype-work
    ```

- nexus.rc 수정
    ```shell
    sudo vi /nexus/nexus-3.75.1-01/bin/nexus.rc
    ```
    ```vim
    run_as_user="nexus"
    ```

- ***서비스 등록***
    ```shell
    sudo vi /etc/systemd/system/nexus.service
    ```
    ```vim
    [Unit]
    Description=nexus service
    After=network.target
    
    [Service]
    Type=forking
    LimitNOFILE=65536
    User=nexus
    Group=nexus
    ExecStart=/nexus/nexus-3.75.1-01/bin/nexus start
    ExecStop=/nexus/nexus-3.75.1-01/bin/nexus stop
    User=nexus
    Restart=on-abort
    
    [Install]
    WantedBy=multi-user.target
    ```
    ```shell
    sudo systemctl enable nexus
    ```

## 💿 실행

#### ***서비스 시작***
```shell
sudo systemctl start nexus
```

#### ***Admin 초기 패스워드 확인***
```shell
cat /nexus/sonatype-work/nexus3/admin.password
```
```shell
✔
XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

## 💡 기타
마지막으로 Nexus가 실행되는 포트를 변경하고 싶다면 아래와 같이 수정하면 된다. (기본 포트는 8081)
```shell
sudo vi /nexus/nexus-3.75.1-01/etc/nexus-default.properties
```
```vim
...
application-port=9000
...
```

## 👋

