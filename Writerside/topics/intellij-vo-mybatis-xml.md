# ⚽ VO 및 Mybatis XML 자동 생성

> ***테스트 환경***
> 
> IntelliJ IDEA 2024.3 (Ultimate Edition)
>
> PostgreSQL 16.1 (Amazon Aurora)
>

## ✋ 들어가며
데이터베이스에 생성되어있는 테이블을 기반으로 VO(DTO)를 생성하고 매번 작성해야하는 Mybatis 기반의 쿼리를 자동으로 생성할 수 없을까?

고민하는 중에 인텔리제이와 약간의 Groovy 기반의 코딩을 이용하는 좋은 방법이 생겼다. 테스트 환경은 Ultimate Edition이지만 Community Edition도 가능하다.

## 💾 Database 설정 및 연결

### ***Database ➡ <shortcut> + </shortcut> ➡ Data Source ➡ PostgreSQL*** 
- 테스트 환경은 PostgreSQL이지만 지원하는 Data Source라면 모두 사용 가능하다.
![](20241205_100506.png)

### ***PostgreSQL 연결***
1. PostgreSQL의 Host, User 등 접속 정보를 입력하고 OK 버튼을 클릭한다.
![](20241205_101046.png)

2. 연결되면 Database 탭에서 테이블 정보를 확인 할 수 있다.
![](20241205_101236.png)

## 📝 Groovy Script 작성

### ***스크립트 파일 생성***
1. 데이터베이스 연결이 완료되면 Project 탭에서 아래와 같은 내용을 확인 할 수 있다.
2. _Generate POJOs.groovy_ 파일을 복사해서 새로운 이름으로 만들어준다.
![](20241205_101358.png)

### ***스크립트 수정***
1. VO 파일에 _lombok_, _Swagger_ 등을 적용하기 위해서 기본 파일을 수정 했다.
2. 그리고 Mybatis 기반의 XML 쿼리까지 생성해주길 원하기 때문에 해당 부분을 추가 작성. 
3. 소스 전문
```groovy
import com.intellij.database.model.DasTable
import com.intellij.database.util.Case
import com.intellij.database.util.DasUtil

/*
 * Available context bindings:
 *   SELECTION   Iterable<DasObject>
 *   PROJECT     project
 *   FILES       files helper
 */
packageName = "_packageName_;"
typeMapping = [
        (~/(?i)int/)                      : "int",
        (~/(?i)float|double|decimal|real/): "double",
        (~/(?i)datetime|timestamp/)       : "String",
        (~/(?i)date/)                     : "String",
        (~/(?i)time/)                     : "String",
        (~/(?i)/)                         : "String"
]

FILES.chooseDirectoryAndSave("Choose directory", "Choose where to store generated files") { dir ->
    SELECTION.filter { it instanceof DasTable }.each { generateVo(it, dir) }
    SELECTION.filter { it instanceof DasTable }.each { generateSql(it, dir) }
}

def generateVo(table, dir) {
    def className = javaName(table.getName(), true)
    def fields = calcFields(table)
    def folderName = "${dir}/model"
    def folder = new File(folderName)
    if (!folder.exists()) {
        folder.mkdirs()
    }
    new File(folderName, className + ".java").withPrintWriter { out -> generateVo(out, className, fields) }
}

def generateSql(table, dir) {
    def camelClassName = javaName(table.getName(), true)
    def className = table.getName()
    def fields = calcFields(table)
    def folderName = "${dir}/sql"
    def folder = new File(folderName)
    if (!folder.exists()) {
        folder.mkdirs()
    }
    new File(folder, className + ".xml").withPrintWriter { out -> generateSql(out, camelClassName, className, fields) }
}

def generateVo(out, className, fields) {
    out.println "package $packageName"
    out.println ""
    out.println "import lombok.*;"
    out.println "import com.fasterxml.jackson.annotation.JsonInclude;"
    out.println "import io.swagger.v3.oas.annotations.media.Schema;"
    out.println ""
    out.println "@AllArgsConstructor(access = AccessLevel.PRIVATE)"
    out.println "@NoArgsConstructor"
    out.println "@Data"
    out.println "@Builder"
    out.println "@JsonInclude(JsonInclude.Include.NON_NULL)"
    out.println "public class $className {"
    out.println ""
    fields.each() {
        if (it.annos != "") out.println "  ${it.annos}"
        out.println "\t@Schema(description = \"${it.comment}\", example = \"${it.comment}\")"
        out.println "\tprivate ${it.type} ${it.camelName};"
        out.println ""
    }
    out.println "}"
}

def generateSql(out, camelClassName, className, fields) {
    out.println '<?xml version="1.0" encoding="UTF-8"?>'
    out.println '<!DOCTYPE mapper'
    out.println '\t\tPUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"'
    out.println '\t\t"http://mybatis.org/dtd/mybatis-3-mapper.dtd">'
    out.println "<mapper namespace=\"_namespace_\">"

    out.println ""
    out.println "\t<select id=\"select${camelClassName}\" parameterType=\"\" resultType=\"\">"
    out.println "\t\t/* Query ID : _namespace_.select${camelClassName} */"
    out.println "\t\tSELECT "
    def index = 0;

    fields.each() {
        if (index != 0) {
            out.println "\t\t\t,${Case.UPPER.apply(it.name)}"
        } else {
            index = 1;
            out.println "\t\t\t${Case.UPPER.apply(it.name)}"
        }
    }
    out.println "\t\tFROM ${Case.UPPER.apply(className)}"
    out.println "\t\tWHERE 1=1"
    out.println "\t</select>"


    out.println ""
    out.println "\t<insert id=\"insert${camelClassName}\" parameterType=\"\">"
    out.println "\t\t/* Query ID : _namespace_.insert${camelClassName} */"
    out.println "\t\tINSERT INTO ${Case.UPPER.apply(className)} ("
    index = 0;
    fields.each() {
        if (index != 0) {
            out.println "\t\t\t,${Case.UPPER.apply(it.name)}"
        } else {
            index = 1;
            out.println "\t\t\t${Case.UPPER.apply(it.name)}"
        }
    }
    out.println "\t\t) VALUES ("
    index = 0;
    fields.each() {
        if (index != 0) {
            out.println "\t\t\t,#{${it.camelName}}"
        } else {
            index = 1;
            out.println "\t\t\t#{${it.camelName}}"
        }
    }
    out.println "\t\t)"
    out.println "\t</insert>"

    out.println ""
    out.println "\t<update id=\"update${camelClassName}\" parameterType=\"\">"
    out.println "\t\t/* Query ID : _namespace_.update${camelClassName} */"
    out.println "\t\tUPDATE ${Case.UPPER.apply(className)} SET "
    index = 0;

    fields.each() {
        if (index != 0) {
            out.println "\t\t\t,${Case.UPPER.apply(it.name)} = #{${it.camelName}}"
        } else {
            index = 1;
            out.println "\t\t\t${Case.UPPER.apply(it.name)} = #{${it.camelName}}"
        }
    }
    out.println "\t\tWHERE 1=1"
    out.println "\t</update>"


    out.println '</mapper>'
}

def calcFields(table) {
    DasUtil.getColumns(table).reduce([]) { fields, col ->
        def spec = Case.LOWER.apply(col.getDasType().getSpecification())
        def typeStr = typeMapping.find { p, t -> p.matcher(spec).find() }.value
        fields += [[
                           camelName: javaName(col.getName(), false),
                           name     : col.getName(),
                           type     : typeStr,
                           comment  : col.getComment(),
                           annos    : ""]]
    }
}

def javaName(str, capitalize) {
    def s = com.intellij.psi.codeStyle.NameUtil.splitNameIntoWords(str)
            .collect { Case.LOWER.apply(it).capitalize() }
            .join("")
            .replaceAll(/[^\p{javaJavaIdentifierPart}[_]]/, "_")
    capitalize || s.length() == 1 ? s : Case.LOWER.apply(s[0]) + s[1..-1]
}
```

## 💿 실행 및 결과

### ***실행*** 
1. *Database ➡ tables ➡ Tools ➡ Scripted Extensions ➡ 생성한 Groovy 파일*
2. 저장할 위치 선택
![](20241205_101601.png)

### ***결과***
1. 선택된 위치에 model, sql 폴더가 각각 생성된다.
![](20241205_101701.png)

2. 생성된 파일 예시
    - VO (TbSample.java)
    ```Java
    package _packageName_;
    
    import lombok.*;
    import com.fasterxml.jackson.annotation.JsonInclude;
    import io.swagger.v3.oas.annotations.media.Schema;
    
    @AllArgsConstructor(access = AccessLevel.PRIVATE)
    @NoArgsConstructor
    @Data
    @Builder
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public class TbSample {
    
        @Schema(description = "Column 1", example = "Column 1")
        private String colOne;
    
        @Schema(description = "Column 2", example = "Column 2")
        private String colTwo;
    
        @Schema(description = "Column 3", example = "Column 3")
        private String colThree;
    }   
    ```
   - Mybatis XML Mapper (tb_sample.xml)
    ```XML
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper namespace="_namespace_">
    
        <select id="selectTbSample" parameterType="" resultType="">
            /* Query ID : _namespace_.selectTbSample */
            SELECT 
                COL_ONE
                ,COL_TWO
                ,COL_THREE
            FROM TB_SAMPLE
            WHERE 1=1
        </select>
    
        <insert id="insertTbSample" parameterType="">
            /* Query ID : _namespace_.insertTbSample */
            INSERT INTO TB_SAMPLE (
                COL_ONE
                ,COL_TWO
                ,COL_THREE
            ) VALUES (
                #{colOne}
                ,#{colTwo}
                ,#{colThree}
            )
        </insert>
    
        <update id="updateTbSample" parameterType="">
            /* Query ID : _namespace_.updateTbSample */
            UPDATE TB_SAMPLE SET 
                COL_ONE = #{colOne}
                ,COL_TWO = #{colTwo}
                ,COL_THREE = #{colThree}
            WHERE 1=1
        </update>
    </mapper>
    ```
   
## 👋 마치며
역시 _Jetbrains_ 은 최고.. _IntelliJ_ 를 사용하지 않을 수 없다. (~~학생계정으로 써서 미안~~)