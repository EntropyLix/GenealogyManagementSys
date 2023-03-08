package com.gms.damien.service;

import com.gms.damien.domain.FamilyMember;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link FamilyMember}.
 */
public interface FamilyMemberService {
    /**
     * Save a familyMember.
     *
     * @param familyMember the entity to save.
     * @return the persisted entity.
     */
    FamilyMember save(FamilyMember familyMember);

    /**
     * Updates a familyMember.
     *
     * @param familyMember the entity to update.
     * @return the persisted entity.
     */
    FamilyMember update(FamilyMember familyMember);

    /**
     * Partially updates a familyMember.
     *
     * @param familyMember the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FamilyMember> partialUpdate(FamilyMember familyMember);

    /**
     * Get all the familyMembers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<FamilyMember> findAll(Pageable pageable);

    /**
     * Get the "id" familyMember.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FamilyMember> findOne(Long id);

    /**
     * Delete the "id" familyMember.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
