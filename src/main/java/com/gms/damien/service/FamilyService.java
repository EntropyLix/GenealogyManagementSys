package com.gms.damien.service;

import com.gms.damien.domain.Family;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Family}.
 */
public interface FamilyService {
    /**
     * Save a family.
     *
     * @param family the entity to save.
     * @return the persisted entity.
     */
    Family save(Family family);

    /**
     * Updates a family.
     *
     * @param family the entity to update.
     * @return the persisted entity.
     */
    Family update(Family family);

    /**
     * Partially updates a family.
     *
     * @param family the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Family> partialUpdate(Family family);

    /**
     * Get all the families.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Family> findAll(Pageable pageable);

    /**
     * Get the "id" family.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Family> findOne(Long id);

    /***
     * Get the families by name.
     * @param name
     * @return the entities list
     */
    List<Family> findByName(String name);

    /**
     * Delete the "id" family.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
