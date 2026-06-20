package com.config;

import java.io.File;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Bean
    @Primary
    public DataSource dataSource() {
        String pgUrl = "jdbc:postgresql://localhost:5432/neide_confeitaria";
        String pgUser = "postgres";
        String pgPass = "1234";

        try {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(pgUrl);
            config.setUsername(pgUser);
            config.setPassword(pgPass);
            config.setDriverClassName("org.postgresql.Driver");
            config.setConnectionTimeout(3000);
            HikariDataSource ds = new HikariDataSource(config);
            ds.getConnection().close();
            log.info("Connected to PostgreSQL");
            System.setProperty("app.hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
            return ds;
        } catch (Exception e) {
            log.warn("PostgreSQL unavailable ({}), falling back to SQLite", e.getMessage());
            return sqliteDataSource();
        }
    }

    private DataSource sqliteDataSource() {
        File dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:sqlite:data/neide_confeitaria.db");
        config.setDriverClassName("org.sqlite.JDBC");
        config.setMaximumPoolSize(1);
        config.setConnectionTimeout(3000);

        log.info("Using SQLite at data/neide_confeitaria.db");
        System.setProperty("app.hibernate.dialect", "com.config.SQLiteDialect");
        return new HikariDataSource(config);
    }
}
