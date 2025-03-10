---
emoji: "🔐"
title: "리눅스 SSH 포트 변경 (Amazon Linux, RHEL)"
date: 2025-03-10 16:00:00 +0900
update: 2025-03-10 16:00:00 +0900
tags:
  - aws
  - ec2
  - amazon-linux
  - linux
---

## ☀️ 테스트 환경
> - Amazon Linux 2023 (EC2)

## ✋ 들어가며
SSH 프로토콜의 포트는 일반적으로 기본 포트인 22번 포트를 사용하는데
자동화된 스크립트를 통한 공격이나 불필요한 접근을 차단하는 등 보안을 강화하기 위해서 포트를 변경하는 시스템들이 많이 있다.

RHEL(Red Hat Enterprise Linux) 환경에서 어떻게 포트를 변경하는지 알아보겠다. 

## 🔄️ SSH 포트 변경하기
RHEL 환경에서 SSH 포트를 변경하는 방법은 아주 간단하다. 설정 파일을 열어서 포트를 변경한 후 SSH 서비스를 재시작하면 끝

#### ***설정 파일 수정***
```shell
vi /etc/ssh/sshd_config
```
```shell
# semanage port -a -t ssh_port_t -p tcp #PORTNUMBER
#
# Port 22
Port 2222
...
```
#### ***sshd 재시작***
```shell
systemctl restart sshd
```

#### ***변경된 포트 확인***
```shell
netstat -nlp | grep sshd
```
```shell
✔
tcp        0      0 0.0.0.0:2222            0.0.0.0:*               LISTEN      2313825/sshd: /usr/
tcp6       0      0 :::2222                 :::*                    LISTEN      2313825/sshd: /usr/
```


## 👋 마치며
아주 간단한 방법으로 SSH 포트 변경이 가능한데도 매번 변경을 진행할 때마다 잘 생각이 안나는데 이참에 기록해뒀으니 다른 블로그는 안찾아봐도 될 것 같다.

