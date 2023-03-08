package com.gms.damien.repository;

import com.gms.damien.domain.HvAuth;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the HvAuth entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HvAuthRepository extends Neo4jRepository<HvAuth, String> {}
