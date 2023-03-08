package com.gms.damien.service.impl;

import com.gms.damien.domain.MemberRelationship;
import com.gms.damien.repository.MemberRelationshipRepository;
import com.gms.damien.service.MemberRelationshipService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link MemberRelationship}.
 */
@Service
public class MemberRelationshipServiceImpl implements MemberRelationshipService {

    private final Logger log = LoggerFactory.getLogger(MemberRelationshipServiceImpl.class);

    private final MemberRelationshipRepository memberRelationshipRepository;

    public MemberRelationshipServiceImpl(MemberRelationshipRepository memberRelationshipRepository) {
        this.memberRelationshipRepository = memberRelationshipRepository;
    }

    @Override
    public MemberRelationship save(MemberRelationship memberRelationship) {
        log.debug("Request to save MemberRelationship : {}", memberRelationship);
        return memberRelationshipRepository.save(memberRelationship);
    }

    @Override
    public MemberRelationship update(MemberRelationship memberRelationship) {
        log.debug("Request to update MemberRelationship : {}", memberRelationship);
        return memberRelationshipRepository.save(memberRelationship);
    }

    @Override
    public Optional<MemberRelationship> partialUpdate(MemberRelationship memberRelationship) {
        log.debug("Request to partially update MemberRelationship : {}", memberRelationship);

        return memberRelationshipRepository
            .findById(memberRelationship.getId())
            .map(existingMemberRelationship -> {
                if (memberRelationship.getRelationshipName() != null) {
                    existingMemberRelationship.setRelationshipName(memberRelationship.getRelationshipName());
                }

                return existingMemberRelationship;
            })
            .map(memberRelationshipRepository::save);
    }

    @Override
    public Page<MemberRelationship> findAll(Pageable pageable) {
        log.debug("Request to get all MemberRelationships");
        return memberRelationshipRepository.findAll(pageable);
    }

    @Override
    public Optional<MemberRelationship> findOne(String id) {
        log.debug("Request to get MemberRelationship : {}", id);
        return memberRelationshipRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete MemberRelationship : {}", id);
        memberRelationshipRepository.deleteById(id);
    }
}
