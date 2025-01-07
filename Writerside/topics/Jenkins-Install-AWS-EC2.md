# Amazon Linux에 Jenkins 설치하기

> ***테스트 환경***
>
> Amazon Linux 2023 (EC2)
> 
> OpenJDK 17.0.2

## ✋ 들어가며
AWS EC2 환경에 [공식 문서](https://www.jenkins.io/doc/tutorials/tutorial-for-installing-jenkins-on-AWS/#downloading-and-installing-jenkins)를 보고 Jenkins를 설치했다.
여기까지 찾아온 방문자에게는 고맙고 미안하지만 블로그 글 보다는 역시 공식 문서를 활용하는게 더 좋다.

## 🚀 Jenkins 다운로드 및 설치

> JDK가 설치되어있는 환경이라 생략되어있지만 먼저 JDK를 꼭 설치해주자
{style='note'}

### ***패키지 업데이트***
<code-block lang="sh">
sudo yum update -y
</code-block>

### ***Jenkins Repo 추가***
<code-block lang="sh">
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
</code-block>

### ***패키지 설치를 활성화하기 위한 키 파일 Import***
<code-block lang="sh">
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
</code-block>

### ***Jenkins 설치*** {id="jenkins install"}
<code-block lang="sh">
sudo yum install jenkins -y
</code-block>

### ***부팅시 시작되는 서비스 등록***
<code-block lang="sh">
sudo systemctl enable jenkins
</code-block>

### ***Jenkins 시작*** {id="jenkins start"}
<code-block lang="sh">
sudo systemctl start jenkins
</code-block>

### ***Jenkins 상태 확인*** {id="jenkins status check"}
<code-block lang="sh">
sudo systemctl status jenkins
</code-block>
<code-block lang="sh">
✔
● jenkins.service - Jenkins Continuous Integration Server
   Loaded: loaded (/usr/lib/systemd/system/jenkins.service; enabled; vendor preset: disabled)
   Active: active (running) since Wed 2024-12-18 01:26:13 UTC; 3h 22min ago
...
</code-block>

## ⛔ 예상되는 오류
필자는 운이 좋게도 한번에 시작이 되었지만 시작시 알 수 없는 오류에 시달릴 수도 있다. 시달리는 중이라면 왜 시달리고 있는지 상세 오류 내용을 확인해보자.

<code-block lang="sh">
sudo journalctl -xe
</code-block>

### ***jenkins: failed to find a valid Java installation***

#### 오류 내용
```shell
-- Unit jenkins.service has begun starting up.
jenkins[25524]: jenkins: failed to find a valid Java installation
systemd[1]: jenkins.service: main process exited, code=exited, status=1/FAILURE
systemd[1]: Failed to start Jenkins Continuous Integration Server.
-- Subject: Unit jenkins.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
--
-- Unit jenkins.service has failed.
--
-- The result is failed.
```

#### 해결
JAVA_HOME에 JDK 설치 경로를 설정해주면 끝.
<code-block lang="sh">
sudo vi /usr/lib/systemd/system/jenkins.service
</code-block>
<code-block lang="sh">
...
# The Java home directory. When left empty, JENKINS_JAVA_CMD and PATH are consulted.
Environment="JAVA_HOME=[JDK 설치 경로]"
...
</code-block>
<code-block lang="sh">
sudo systemctl daemon-reload
</code-block>

### ***Failed to bind to 0.0.0.0/0.0.0.0:8080***
다른 프로세스에서 사용중인 포트인 경우 이런 오류를 만날 수 있고 다른 프로세스의 포트를 변경하든 젠킨스 포트를 변경하든 해야하는데 우리는 젠킨스 포트를 변경해보자.

#### 오류 내용
```Shell
jenkins[16253]: Caused: java.io.IOException: Failed to bind to 0.0.0.0/0.0.0.0:8080
jenkins[16253]: at Jenkins Main ClassLoader//org.eclipse.jetty.server.ServerConnector.openAcceptChannel(ServerConnector.java:349)
jenkins[16253]: at Jenkins Main ClassLoader//org.eclipse.jetty.server.ServerConnector.open(ServerConnector.java:313)
jenkins[16253]: at Jenkins Main ClassLoader//org.eclipse.jetty.server.Server.lambda$doStart$0(Server.java:552)
jenkins[16253]: at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.accept(ForEachOps.java:183)
jenkins[16253]: at java.base/java.util.stream.ReferencePipeline$3$1.accept(ReferencePipeline.java:197)
jenkins[16253]: at java.base/java.util.stream.ReferencePipeline$2$1.accept(ReferencePipeline.java:179)
jenkins[16253]: at java.base/java.util.Spliterators$ArraySpliterator.forEachRemaining(Spliterators.java:992)
jenkins[16253]: at java.base/java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:509)
jenkins[16253]: at java.base/java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:499)
jenkins[16253]: at java.base/java.util.stream.ForEachOps$ForEachOp.evaluateSequential(ForEachOps.java:150)
jenkins[16253]: at java.base/java.util.stream.ForEachOps$ForEachOp$OfRef.evaluateSequential(ForEachOps.java:173)
jenkins[16253]: at java.base/java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
jenkins[16253]: at java.base/java.util.stream.ReferencePipeline.forEach(ReferencePipeline.java:596)
jenkins[16253]: at Jenkins Main ClassLoader//org.eclipse.jetty.server.Server.doStart(Server.java:548)
jenkins[16253]: at Jenkins Main ClassLoader//org.eclipse.jetty.util.component.AbstractLifeCycle.start(AbstractLifeCycle.java:93)
jenkins[16253]: at Jenkins Main ClassLoader//winstone.Launcher.<init>(Launcher.java:190)
jenkins[16253]: Caused: java.io.IOException: Failed to start Jetty
jenkins[16253]: at Jenkins Main ClassLoader//winstone.Launcher.<init>(Launcher.java:194)
jenkins[16253]: at Jenkins Main ClassLoader//winstone.Launcher.main(Launcher.java:490)
jenkins[16253]: at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
jenkins[16253]: at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:77)
jenkins[16253]: at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
jenkins[16253]: at java.base/java.lang.reflect.Method.invoke(Method.java:568)
jenkins[16253]: at executable.Main.main(Main.java:335)
systemd[1]: jenkins.service: main process exited, code=exited, status=1/FAILURE
systemd[1]: Failed to start Jenkins Continuous Integration Server.
-- Subject: Unit jenkins.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
--
-- Unit jenkins.service has failed.
--
-- The result is failed.

```

#### 해결
<code-block lang="sh">
sudo vi /usr/lib/systemd/system/jenkins.service
</code-block>
<code-block lang="sh">
...
# Port to listen on for HTTP requests. Set to -1 to disable.
# To be able to listen on privileged ports (port numbers less than 1024),
# add the CAP_NET_BIND_SERVICE capability to the AmbientCapabilities
# directive below.
Environment="JENKINS_PORT=[변경할 포트]"
...
</code-block>
<code-block lang="sh">
sudo systemctl daemon-reload
</code-block>

## 👋

<inline-frame src="https://github.com/rundevelrun/rundevelrun.github.io/raw/refs/heads/main/Writerside/cfg/static/giscus.html" width="100%"/>