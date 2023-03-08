package com.gms.damien.repository;

import com.gms.damien.domain.Family;
import java.util.List;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Family entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FamilyRepository extends Neo4jRepository<Family, Long> {
    List<Family> findByFamilyNameLike(String familyName);
}
