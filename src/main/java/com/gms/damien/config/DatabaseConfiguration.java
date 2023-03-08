package com.gms.damien.config;

import org.neo4j.ogm.session.SessionFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.data.neo4j.transaction.Neo4jTransactionManager;

@Configuration
@EnableNeo4jRepositories("com.gms.damien.repository")
public class DatabaseConfiguration {

    @Bean("transactionManager")
    public Neo4jTransactionManager neo4jTransactionManager(SessionFactory sessionFactory) {
        return new Neo4jTransactionManager(sessionFactory);
    }

    @Value("${spring.neo4j.uri}")
    private String databaseUrl;

    @Value("${spring.neo4j.authentication.username}")
    private String userName;

    @Value("${spring.neo4j.authentication.password}")
    private String password;

    @Bean
    public SessionFactory sessionFactory() {
        org.neo4j.ogm.config.Configuration configuration = new org.neo4j.ogm.config.Configuration.Builder()
            .uri(databaseUrl)
            .credentials(userName, password)
            .build();
        return new SessionFactory(configuration, "com.gms.damien.domain");
    }
}
