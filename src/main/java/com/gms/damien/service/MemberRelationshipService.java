package com.gms.damien.service;

import com.gms.damien.domain.MemberRelationship;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link MemberRelationship}.
 */
public interface MemberRelationshipService {
    /**
     * Save a memberRelationship.
     *
     * @param memberRelationship the entity to save.
     * @return the persisted entity.
     */
    MemberRelationship save(MemberRelationship memberRelationship);

    /**
     * Updates a memberRelationship.
     *
     * @param memberRelationship the entity to update.
     * @return the persisted entity.
     */
    MemberRelationship update(MemberRelationship memberRelationship);

    /**
     * Partially updates a memberRelationship.
     *
     * @param memberRelationship the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MemberRelationship> partialUpdate(MemberRelationship memberRelationship);

    /**
     * Get all the memberRelationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<MemberRelationship> findAll(Pageable pageable);

    /**
     * Get the "id" memberRelationship.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MemberRelationship> findOne(String id);

    /**
     * Delete the "id" memberRelationship.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
