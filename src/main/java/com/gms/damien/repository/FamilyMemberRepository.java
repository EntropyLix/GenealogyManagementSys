package com.gms.damien.repository;

import com.gms.damien.domain.FamilyMember;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the FamilyMember entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FamilyMemberRepository extends Neo4jRepository<FamilyMember, Long> {}
