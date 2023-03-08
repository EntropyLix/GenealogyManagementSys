package com.gms.damien.service;

import com.gms.damien.domain.HvAuth;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link HvAuth}.
 */
public interface HvAuthService {
    /**
     * Save a hvAuth.
     *
     * @param hvAuth the entity to save.
     * @return the persisted entity.
     */
    HvAuth save(HvAuth hvAuth);

    /**
     * Updates a hvAuth.
     *
     * @param hvAuth the entity to update.
     * @return the persisted entity.
     */
    HvAuth update(HvAuth hvAuth);

    /**
     * Partially updates a hvAuth.
     *
     * @param hvAuth the entity to update partially.
     * @return the persisted entity.
     */
    Optional<HvAuth> partialUpdate(HvAuth hvAuth);

    /**
     * Get all the hvAuths.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HvAuth> findAll(Pageable pageable);

    /**
     * Get the "id" hvAuth.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HvAuth> findOne(String id);

    /**
     * Delete the "id" hvAuth.
     *
     * @param id the id of the entity.
     */
    void delete(String id);
}
