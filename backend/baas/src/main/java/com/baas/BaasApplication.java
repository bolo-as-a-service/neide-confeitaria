package com.baas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com")
public class BaasApplication {

	public static void main(String[] args) {
		SpringApplication.run(BaasApplication.class, args);
	}

}
