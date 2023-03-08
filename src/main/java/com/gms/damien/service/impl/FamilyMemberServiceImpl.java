package com.gms.damien.service.impl;

import com.gms.damien.domain.FamilyMember;
import com.gms.damien.repository.FamilyMemberRepository;
import com.gms.damien.service.FamilyMemberService;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link FamilyMember}.
 */
@Service
public class FamilyMemberServiceImpl implements FamilyMemberService {

    private final Logger log = LoggerFactory.getLogger(FamilyMemberServiceImpl.class);

    private final FamilyMemberRepository familyMemberRepository;

    public FamilyMemberServiceImpl(FamilyMemberRepository familyMemberRepository) {
        this.familyMemberRepository = familyMemberRepository;
    }

    @Override
    public FamilyMember save(FamilyMember familyMember) {
        log.debug("Request to save FamilyMember : {}", familyMember);
        familyMember.setCreatedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        return familyMemberRepository.save(familyMember);
    }

    @Override
    public FamilyMember update(FamilyMember familyMember) {
        familyMember.setLastModifiedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        familyMember.setLastModifiedDate(Instant.now());
        log.debug("Request to update FamilyMember : {}", familyMember);
        return familyMemberRepository.save(familyMember);
    }

    @Override
    public Optional<FamilyMember> partialUpdate(FamilyMember familyMember) {
        log.debug("Request to partially update FamilyMember : {}", familyMember);

        return familyMemberRepository
            .findById(familyMember.getId())
            .map(existingFamilyMember -> {
                existingFamilyMember.setLastModifiedBy(
                    ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername()
                );
                existingFamilyMember.setLastModifiedDate(Instant.now());
                if (familyMember.getName() != null) {
                    existingFamilyMember.setName(familyMember.getName());
                }
                if (familyMember.getGender() != null) {
                    existingFamilyMember.setGender(familyMember.getGender());
                }
                if (familyMember.getAge() != null) {
                    existingFamilyMember.setAge(familyMember.getAge());
                }
                if (familyMember.getAddress() != null) {
                    existingFamilyMember.setAddress(familyMember.getAddress());
                }
                if (familyMember.getBirthDate() != null) {
                    existingFamilyMember.setBirthDate(familyMember.getBirthDate());
                }

                return existingFamilyMember;
            })
            .map(familyMemberRepository::save);
    }

    @Override
    public Page<FamilyMember> findAll(Pageable pageable) {
        log.debug("Request to get all FamilyMembers");
        return familyMemberRepository.findAll(pageable);
    }

    @Override
    public Optional<FamilyMember> findOne(Long id) {
        log.debug("Request to get FamilyMember : {}", id);
        return familyMemberRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FamilyMember : {}", id);
        familyMemberRepository.deleteById(id);
    }
}
