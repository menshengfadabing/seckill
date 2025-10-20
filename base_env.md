maven环境初始化配置(maven3.9.11)
mvn archetype:generate ^
 -DarchetypeGroupId=org.apache.maven.archetypes ^
 -DarchetypeArtifactId=maven-archetype-quickstart ^
 -DarchetypeVersion=1.5 ^
 -DgroupId=com.example ^
 -DartifactId=seckill ^
 -Dversion=1.0-SNAPSHOT ^
 -Dpackage=com.example ^
 -DinteractiveMode=false
 -DjavaCompilerVersion=25

Redis 7.0.15已经启动且跑在6379端口

MySQL80已经启动且跑在3306端口，密码123456

现在处于名为claude的git分支中

相关依赖和框架请采用较新的版本，如
springboot 4.0.x

