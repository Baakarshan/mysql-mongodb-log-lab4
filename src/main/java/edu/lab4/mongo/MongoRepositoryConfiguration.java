package edu.lab4.mongo;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/** Mongo 链路只扫描本包仓储，避免公共双映射模型使 JPA 仓储被识别为 Mongo 仓储。 */
@Configuration
@Profile("mongo")
@EnableMongoRepositories(basePackageClasses = LogMongoRepository.class)
public class MongoRepositoryConfiguration {}
