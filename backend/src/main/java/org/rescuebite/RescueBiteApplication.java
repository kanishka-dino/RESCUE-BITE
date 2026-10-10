package org.rescuebite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RescueBiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(RescueBiteApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  RescueBite Spring Boot Backend Started on :8080");
        System.out.println("  Connected to MySQL Database");
        System.out.println("  Ready for React Frontend Requests");
        System.out.println("==================================================");
    }
}
