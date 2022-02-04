package com.ewa.team08.memory.repositories;

import com.ewa.team08.memory.models.User;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.Optional;

@Repository
public class UserRepositoryJPA extends AbstractEntityRepositoryJpa<User> implements UserRepository{
    @PersistenceContext
    EntityManager em;

    public UserRepositoryJPA() {
        super(User.class);
    }

    @Override
    public User findByUsername(String name){
         TypedQuery<User> query = em.createQuery("select u from User u where u.username = '" + name + "'", User.class);
         return query.getSingleResult();
    }

}
