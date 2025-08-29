# Use the official Maven image to build the application.
# FROM maven:3.9.9-openjdk-17 AS build
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory.
WORKDIR /app

# Copy the Maven project files.
COPY pom.xml .
COPY src ./src

# Package the application.
RUN mvn package -DskipTests

# Use a minimal JDK image to run the application.
# FROM openjdk:17-jdk-alpine
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory.
WORKDIR /app

# Copy the built JAR file from the build stage.
COPY --from=build /app/target/*.jar app.jar

# Expose the port that the app runs on.
EXPOSE 8080

# Start the Spring Boot application.
CMD ["java", "-jar", "app.jar"]

# ---------------------------------------------------------------------------------
# Use Tomcat as the base image, since it can run .war files
# FROM tomcat:9.0-jdk17

# Remove default webapps (optional)
# RUN rm -rf /usr/local/tomcat/webapps/*

# Copy the WAR file to the Tomcat webapps directory
# ARG WAR_FILE=target/*.war
# COPY ${WAR_FILE} /usr/local/tomcat/webapps/ROOT.war
# COPY target/backend-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ROOT.war
# COPY target/backend-0.0.1-SNAPSHOT.war /usr/local/tomcat/webapps/ExpenseWise.war

# Expose the default Tomcat port
# EXPOSE 8080

# Command to run Tomcat
# CMD ["catalina.sh", "run"]

# ENV DB_HOST=localhost
# ENV DB_PORT=3306
# ENV DB_NAME=expense
# ENV DB_USERNAME=root
# ENV DB_PASSWORD=''

# ---

# FROM openjdk:17-jdk-slim

# # Set the working directory inside the container
# WORKDIR /ExpenseWise/backend

# # Copy the JAR file into the container
# COPY target/backend-0.0.1-SNAPSHOT.jar /ExpenseWise/backend/backend.jar

# # Copy the wait-for-it.sh script into the container
# COPY wait-for-it.sh /ExpenseWise/backend/wait-for-it.sh
# RUN chmod +x /ExpenseWise/backend/wait-for-it.sh

# EXPOSE 8080

# # Set the entry point to use wait-for-it.sh and then run the JAR
# ENTRYPOINT ["/ExpenseWise/backend/wait-for-it.sh", "mysql:3306", "--", "java", "-jar", "/ExpenseWise/backend/backend.jar"]

# Run the JAR file
# ENTRYPOINT ["java", "-jar", "backend.jar"]

# ---

# ---------------------------------------------------------------------------------
