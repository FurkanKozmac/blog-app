# --- BUILD ---
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Testleri atlayarak .jar dosyasını oluştur
RUN mvn clean package -DskipTests

# --- RUN ---
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p uploads

ENTRYPOINT ["java", "-jar", "app.jar"]