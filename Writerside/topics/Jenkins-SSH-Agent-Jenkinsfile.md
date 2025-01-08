# Jenkins Agent Node 설정하기

> ***테스트 환경***
>
> Jenkins 2.387.3
>
> Amazon Linux 2023 (EC2) 

## ✋ 들어가며
젠킨스가 설치되어있는 서버와 실제로 어플리케이션이 배포될 대상 서버가 다른 경우에 _SSH Agent_ 를 이용한 원격 배포 방법도 있겠지만 이 글에서는 Jenkins Node Agent를 활용한 방법을 다뤄보려고한다.


## 🔑 SSH Key 생성 및 복사
SSH를 활용해서 Agent를 시작하는 방식을 선택하려고 하기 떄문에 Agent가 동작할 서버에서 SSH Key를 생성한다. 

### ***ssh-keygen***
1. 놀랍게도 Enter의 입력만으로 SSH Key가 생성된다.
<code-block lang="sh">
cd ~/.ssh
ssh-keygen -t rsa
</code-block>
<code-block lang="sh">
✔
Your identification has been saved in /home/rundevelrun/.ssh/id_rsa.
Your public key has been saved in /home/rundevelrun/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:~~~
The key's randomart image is:
+---[RSA 2048]----+
| ...             |
+----[SHA256]-----+
</code-block>
2. ~/.ssh 경로에 아래와 같은 파일들이 생성되었다면 성공이다.
<code-block lang="sh">
ls -al
</code-block>
<code-block lang="sh">
✔
-rw------- 1 rundevelrun rundevelrun  401 Aug  5 05:45 authorized_keys
-rw------- 1 rundevelrun rundevelrun 1679 Dec 12 02:22 id_rsa
-rw-r--r-- 1 rundevelrun rundevelrun  438 Dec 12 02:22 id_rsa.pub
</code-block>

### ***SSH Key 확인*** {id="ssh-key_1"}
*id_rsa* 파일을 열어서 내용을 확인하고 Jenkins 설정에 사용해야하기 때문에 복사해둔다.
<code-block lang="sh">
cat id_rsa
</code-block>
<code-block lang="sh">
✔
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBA...


-----END RSA PRIVATE KEY-----
</code-block>

## 🔐 Jenkins Credentials 설정

### ***등록 화면 접속***
*Dashboard ➡ Jenkins 관리 ➡ Credentials  ➡  System ➡ Global credentials (unrestricted) ➡ Add Credentials*

### ***Credentials 생성***
- Kind : SSH Username with private key
- Scope : Global
- ID : 젠킨스에서 사용하는 중복되지 않는 Credential ID
- Description : 설명
- Username : SSH Key를 생성한 계정
- Private Key : `Enter directly`를 체크하고 위에서 복사한 SSH Key를 입력

![](20241212_144903.png)

## 💼 Jenkins Node 설정

### ***등록 화면 접속***
*Dashboard ➡ Jenkins 관리 ➡ 노드 관리  ➡  New Node*

노드명 입력 및 Permanent Agent에 체크하고 다음으로 넘어간다.
![](20241212_150059.png)

### ***Node 생성***
- Name : 노드명
- Description : 설명
- Number of executors : 노드에서 수행할 수 있는 동시 빌드 수
- Remote root directory : Agent가 사용할 디렉토리
- Labels : Jenkinsfile에서 사용할 Label
- Launch method : label이 일치할때만 빌드가 실핼되도록 `Only build jobs...` 선택
  - Host : 원격지 IP
  - Credentials : 앞에서 등록한 Credential 선택
  - Host Key Verification Strategy : 호스트 키 검증 전략 (검증하지 않는 전략을 사용하도록 설정)
- Availability : Agent를 온라인 상태로 유지하도록 `Keep this agent online as...` 선택

![](20241212_153946.png)

## 📌 사용 예시 (Jenkinsfile Pipeline)
Agent 설정을 마쳤으니 마지막으로 Jenkins Pipeline에서 어떻게 Agent를 사용하는지 확인할 차례다.

### ***Pipeline 전체에 적용***
```Groovy
pipeline {
    agent {
        label 'rundevelrun_node'
    }
    ...
}
```

### ***특정 stage에만 적용***
```Groovy
pipeline {
    agent any
    stages {
        stage('rundevelrun stage') {
            agent {
                label 'rundevelrun_node'
            }
            steps {
                // rundevelrun_node agent가 수행할 작업
            }
        }
    }
    ...
}
```

## 👋 마치며
Jenkins Node Agent를 사용해서 원격 서버에 배포하는 방식을 기록해봤는데 곧  _SSH Agent_ 를 활용하는 방법도 기록해야겠다.

<inline-frame src="https://rundevelrun.6developer.com/static/giscus.html" width="100%"/>