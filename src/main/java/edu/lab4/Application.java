package edu.lab4;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
/** 实验应用入口。通过 mysql 或 mongo profile 选择当前轮次的持久化实现。 */
public class Application {
  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
