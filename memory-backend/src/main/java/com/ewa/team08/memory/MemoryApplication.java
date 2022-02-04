package com.ewa.team08.memory;

import com.ewa.team08.memory.repositories.UserRepository;
import com.ewa.team08.memory.models.User;
import com.ewa.team08.memory.repositories.UserRepositoryJPA;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


import java.util.List;

@SpringBootApplication
public class MemoryApplication implements CommandLineRunner {

	@Autowired
	UserRepositoryJPA userRepository;

	public static void main(String[] args) {
		SpringApplication.run(MemoryApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		createInitialUsers();
	}

	protected void createInitialUsers() {
		List<User> users = this.userRepository.findAll();

		if (users.size() > 0) {return;}
		System.out.println("configuring some data");
		this.userRepository.save(new User("dtkeijser@gmail.com", "Daniel"));
		this.userRepository.save(new User("dtkeijser@gmail.com", "DTK" ));
	}
}
