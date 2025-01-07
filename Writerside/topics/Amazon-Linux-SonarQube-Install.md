# Amazon Linux SonarQube 설치

> ***테스트 환경***
>
> Amazon Linux 2023 (EC2)
>
> OpenJDK 17.0.2
> 
> PostgreSQL 17.2
> 
> SonarQube 9.9 LTA 

## ✋ 소나큐브란?
> 소나큐브는 20개 이상의 프로그래밍 언어에서 버그, 코드 스멜, 보안 취약점을 발견할 목적으로 정적 코드 분석으로 자동 리뷰를 수행하기 위한 지속적인 코드 품질 검사용 오픈 소스 플랫폼이다. 소나소스(SonarSource)가 개발하였다. 소나큐브는 중복 코드, 코딩 표준, 유닛 테스트, 코드 커버리지, 코드 복잡도, 주석, 버그 및 보안 취약점의 보고서를 제공한다.
> <br/>
> <br/>
> 출처 : [위키백과](https://ko.wikipedia.org/wiki/소나큐브)

## 📂 PostgreSQL User 및 Database 생성

> JDK와 PostgreSQL 등 지원 가능한 데이터베이스의 설치가 선행되어야 한다.
> <br/>
> <br/>
> 참고 : [PostgreSQL 설치 포스팅](Amazon-Linux-PostgreSQL-17.md)
{style='note'}

### ***User 생성***
<code-block lang="SQL">
CREATE USER sonar PASSWORD 'sonar';
</code-block>

### ***Database 생성***
앞에서 생성한 'sonar' User를 owner로 설정
<code-block lang="SQL">
CREATE DATABASE sonar OWNER sonar;
</code-block>

### ***권한 설정***
<code-block lang="SQL">
ALTER ROLE sonar WITH createdb;
GRANT ALL PRIVILEGES ON DATABASE sonar TO sonar;
</code-block>


## 🚀 SonarQube 다운로드 및 설치
[소나큐브 다운로드 페이지](https://www.sonarsource.com/products/sonarqube/downloads/historical-downloads/)에서 원하는 버전을 다운로드하거나 링크를 복사해둔다.

### ***다운로드***
원하는 위치에 다운로드한 파일을 업로드하거나 wget을 이용해서 다운로드 한다. 
<code-block lang="sh">
sudo wget https://binaries.sonarsource.com/Distribution/sonarqube/sonarqube-9.9.8.100196.zip
</code-block>

### ***압축풀기***
<code-block lang="sh">
sudo unzip sonarqube-9.9.8.100196.zip
</code-block>

### ***sonar.properties 수정***
_설치경로/conf/sonar.properties_
 
1. 앞에서 설정한 Database의 정보를 입력한다
2. 웹페이지에서 사용할 포트와 Elastic Search에서 사용할 포트를 수정한다
   - 기본 포트를 사용해도 무방하고 당연한 말씀이지만 이미 사용중인 포트의 경우에는 오류를 만날 수 있다
<code-block lang="properties">
...
sonar.jdbc.username=sonar
sonar.jdbc.password=sonar
sonar.jdbc.url=jdbc:postgresql://localhost:5432/sonar

sonar.web.port=9002
sonar.search.port=9003
...
</code-block>

### ***실행***
_설치경로/bin/linux-x86-64/sonar.sh_
<code-block lang="sh">
./sonar.sh start
</code-block>
<code-block lang="sh">
✔
Starting SonarQube...
Started SonarQube.
</code-block>

## ⛔ 예상되는 오류
생각처럼 실행이 안된다면 _설치경로/logs/es.log_ 파일에서 오류를 확인해보자
<br/>
오류를 만나게 되더라도 누구나 겪을 수 있는 일이기 때문에 침착하게 수정하면 된다.

### ***can not run elasticsearch as root***

#### 오류 내용
```shell
java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Bootstrap.initializeNatives(Bootstrap.java:107) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Bootstrap.setup(Bootstrap.java:183) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Bootstrap.init(Bootstrap.java:434) [elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:166) [elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:157) [elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:77) [elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:112) [elasticsearch-cli-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.Command.main(Command.java:77) [elasticsearch-cli-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:122) [elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:80) [elasticsearch-7.16.2.jar:7.16.2]
2025.01.02 06:49:40 ERROR es[][o.e.b.ElasticsearchUncaughtExceptionHandler] uncaught exception in thread [main]
org.elasticsearch.bootstrap.StartupException: java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:170) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.execute(Elasticsearch.java:157) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.EnvironmentAwareCommand.execute(EnvironmentAwareCommand.java:77) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.Command.mainWithoutErrorHandling(Command.java:112) ~[elasticsearch-cli-7.16.2.jar:7.16.2]
        at org.elasticsearch.cli.Command.main(Command.java:77) ~[elasticsearch-cli-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:122) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.main(Elasticsearch.java:80) ~[elasticsearch-7.16.2.jar:7.16.2]
Caused by: java.lang.RuntimeException: can not run elasticsearch as root
        at org.elasticsearch.bootstrap.Bootstrap.initializeNatives(Bootstrap.java:107) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Bootstrap.setup(Bootstrap.java:183) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Bootstrap.init(Bootstrap.java:434) ~[elasticsearch-7.16.2.jar:7.16.2]
        at org.elasticsearch.bootstrap.Elasticsearch.init(Elasticsearch.java:166) ~[elasticsearch-7.16.2.jar:7.16.2]
        ... 6 more
```

#### 해결
elasticsearch는 root 권한으로 실행할 수 없기 때문에 소나큐브의 설치 경로의 소유자를 변경한다.
<br/>
필자의 경우 ec2-user를 사용해서 실행했지만 가능하면 소나큐브용 User와 Group을 생성해주자. 
<code-block lang="sh">
sudo chown -R ec2-user:ec2-user 설치경로
</code-block>

### ***vm.max_map_count***
Elasticsearch를 실행하기 위해서는 vm.max_map_count 값이 최소 262144는 필요하다고 한다.

#### 오류 내용
```Shell
[1] bootstrap checks failed. You must address the points described in the following [1] lines before starting Elasticsearch.
bootstrap check failure [1] of [1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
```

#### 해결
현재 설정된 vm.max_map_count 값을 확인해보자.
<code-block lang="sh">
sysctl vm.max_map_count
</code-block>
<code-block lang="sh">
✔
vm.max_map_count = 65530
</code-block>
vm.max_map_count 값이 최소 값보다 작게 설정이 되어있기 때문에 다시 설정해주면 해결
<code-block lang="sh">
sudo sysctl -w vm.max_map_count=262144
</code-block>

## 👋
다음 포스팅은 Jenkins 파이프라인에서 SonarQube를 활용한 정적 코드 분석을 해봐야겠다.

<inline-frame src="static/giscus.html"/>