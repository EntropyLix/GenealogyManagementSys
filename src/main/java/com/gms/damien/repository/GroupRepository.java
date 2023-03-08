package com.gms.damien.repository;

import com.gms.damien.domain.Group;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Group entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GroupRepository extends Neo4jRepository<Group, Long> {}
