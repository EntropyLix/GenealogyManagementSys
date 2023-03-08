package com.gms.damien.repository;

import com.gms.damien.domain.MemberRelationship;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the MemberRelationship entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MemberRelationshipRepository extends Neo4jRepository<MemberRelationship, String> {}
