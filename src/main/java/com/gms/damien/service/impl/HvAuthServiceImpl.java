package com.gms.damien.service.impl;

import com.gms.damien.domain.HvAuth;
import com.gms.damien.repository.HvAuthRepository;
import com.gms.damien.service.HvAuthService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link HvAuth}.
 */
@Service
public class HvAuthServiceImpl implements HvAuthService {

    private final Logger log = LoggerFactory.getLogger(HvAuthServiceImpl.class);

    private final HvAuthRepository hvAuthRepository;

    public HvAuthServiceImpl(HvAuthRepository hvAuthRepository) {
        this.hvAuthRepository = hvAuthRepository;
    }

    @Override
    public HvAuth save(HvAuth hvAuth) {
        log.debug("Request to save HvAuth : {}", hvAuth);
        return hvAuthRepository.save(hvAuth);
    }

    @Override
    public HvAuth update(HvAuth hvAuth) {
        log.debug("Request to update HvAuth : {}", hvAuth);
        return hvAuthRepository.save(hvAuth);
    }

    @Override
    public Optional<HvAuth> partialUpdate(HvAuth hvAuth) {
        log.debug("Request to partially update HvAuth : {}", hvAuth);

        return hvAuthRepository
            .findById(hvAuth.getId())
            .map(existingHvAuth -> {
                if (hvAuth.getAuthType() != null) {
                    existingHvAuth.setAuthType(hvAuth.getAuthType());
                }

                return existingHvAuth;
            })
            .map(hvAuthRepository::save);
    }

    @Override
    public Page<HvAuth> findAll(Pageable pageable) {
        log.debug("Request to get all HvAuths");
        return hvAuthRepository.findAll(pageable);
    }

    @Override
    public Optional<HvAuth> findOne(String id) {
        log.debug("Request to get HvAuth : {}", id);
        return hvAuthRepository.findById(id);
    }

    @Override
    public void delete(String id) {
        log.debug("Request to delete HvAuth : {}", id);
        hvAuthRepository.deleteById(id);
    }
}
