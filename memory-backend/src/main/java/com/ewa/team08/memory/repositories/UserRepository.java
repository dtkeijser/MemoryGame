package com.ewa.team08.memory.repositories;

import com.ewa.team08.memory.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository  {

    User findByUsername(String username);
}
