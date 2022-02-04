package com.ewa.team08.memory.repositories;

import com.ewa.team08.memory.models.Game;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;
import java.util.List;

@Transactional
public abstract class AbstractEntityRepositoryJpa<E extends Identifiable> implements EntityRepository<E> {

    @PersistenceContext
    protected EntityManager em;

    private Class<E> entityClass;

    public AbstractEntityRepositoryJpa(Class<E> entityClass){
        this.entityClass = entityClass;
    }

    @Override
    public E findById(long id) {
        return em.find(this.entityClass, id);
    }

    @Override
    public List<E> findAll() {
        TypedQuery<E> query = this.em.createQuery(
                "SELECT  o FROM " + this.entityClass.getName() +" o ", this.entityClass);
        return query.getResultList();
    }

    //save or update game
    @Override
    public E save(E entity) {
        if (entity.getId() == 0) {
            em.persist(entity);
        } else {
            em.merge(entity);
        }
        return entity;
    }

    @Override
    public boolean deleteById(long id) {
        E entity = this.findById(id);
        em.remove(entity);
        return true;
    }

    public List<E> findByQuery(String jpqlName, Object ...params) {
        TypedQuery<E> query =
                this.em.createNamedQuery(jpqlName, this.entityClass);
        for (int i = 0; i < params.length; i++) {
            query.setParameter(i+1, params[i]);
        }
        return query.getResultList();
    }
}
