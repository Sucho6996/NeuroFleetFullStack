package com.suchorit.NeurofleetLoginBack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class NeurofleetLoginBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(NeurofleetLoginBackApplication.class, args);
	}

}
