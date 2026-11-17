package edu.lab4.mysql;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/** MySQL 链路只扫描本包仓储，避免将公共双映射模型的 Mongo 仓储交给 JPA 解析。 */
@Configuration
@Profile("mysql")
@EnableJpaRepositories(basePackageClasses = LogJpaRepository.class)
public class MySqlRepositoryConfiguration {}
