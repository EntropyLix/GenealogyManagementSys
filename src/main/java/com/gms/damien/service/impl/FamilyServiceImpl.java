package com.gms.damien.service.impl;

import com.gms.damien.domain.Family;
import com.gms.damien.repository.FamilyRepository;
import com.gms.damien.service.FamilyService;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Family}.
 */
@Service
public class FamilyServiceImpl implements FamilyService {

    private final Logger log = LoggerFactory.getLogger(FamilyServiceImpl.class);

    private final FamilyRepository familyRepository;

    public FamilyServiceImpl(FamilyRepository familyRepository) {
        this.familyRepository = familyRepository;
    }

    @Override
    public Family save(Family family) {
        log.debug("Request to save Family : {}", family);
        family.setCreatedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        return familyRepository.save(family);
    }

    @Override
    public Family update(Family family) {
        log.debug("Request to update Family : {}", family);
        Family family2 = familyRepository.findById(family.getId()).get();
        family.setCreatedBy(family2.getCreatedBy());
        family.setCreatedDate(family2.getCreatedDate());
        family.setLastModifiedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        family.setLastModifiedDate(Instant.now());
        return familyRepository.save(family);
    }

    @Override
    public Optional<Family> partialUpdate(Family family) {
        log.debug("Request to partially update Family : {}", family);

        return familyRepository
            .findById(family.getId())
            .map(existingFamily -> {
                if (family.getFamilyName() != null) {
                    existingFamily.setFamilyName(family.getFamilyName());
                }
                if (family.getDescription() != null) {
                    existingFamily.setDescription(family.getDescription());
                }
                if (family.getPic() != null) {
                    existingFamily.setPic(family.getPic());
                }

                return existingFamily;
            })
            .map(familyRepository::save);
    }

    @Override
    public Page<Family> findAll(Pageable pageable) {
        log.debug("Request to get all Families");
        return familyRepository.findAll(pageable);
    }

    @Override
    public Optional<Family> findOne(Long id) {
        log.debug("Request to get Family : {}", id);
        return familyRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Family : {}", id);
        familyRepository.deleteById(id);
    }

    @Override
    public List<Family> findByName(String name) {
        log.debug("Request to search Family  by : {} name", name);
        return "SEARCH_ALL".equals(name)
            ? StreamSupport.stream(familyRepository.findAll().spliterator(), false).collect(Collectors.toList())
            : familyRepository.findByFamilyNameLike("*" + name + "*");
    }
}
