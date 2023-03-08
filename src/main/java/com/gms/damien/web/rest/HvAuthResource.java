package com.gms.damien.web.rest;

import com.gms.damien.domain.HvAuth;
import com.gms.damien.repository.HvAuthRepository;
import com.gms.damien.service.HvAuthService;
import com.gms.damien.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gms.damien.domain.HvAuth}.
 */
@RestController
@RequestMapping("/api")
public class HvAuthResource {

    private final Logger log = LoggerFactory.getLogger(HvAuthResource.class);

    private static final String ENTITY_NAME = "hvAuth";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HvAuthService hvAuthService;

    private final HvAuthRepository hvAuthRepository;

    public HvAuthResource(HvAuthService hvAuthService, HvAuthRepository hvAuthRepository) {
        this.hvAuthService = hvAuthService;
        this.hvAuthRepository = hvAuthRepository;
    }

    /**
     * {@code POST  /hv-auths} : Create a new hvAuth.
     *
     * @param hvAuth the hvAuth to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new hvAuth, or with status {@code 400 (Bad Request)} if the hvAuth has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/hv-auths")
    public ResponseEntity<HvAuth> createHvAuth(@Valid @RequestBody HvAuth hvAuth) throws URISyntaxException {
        log.debug("REST request to save HvAuth : {}", hvAuth);
        if (hvAuth.getId() != null) {
            throw new BadRequestAlertException("A new hvAuth cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HvAuth result = hvAuthService.save(hvAuth);
        return ResponseEntity
            .created(new URI("/api/hv-auths/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /hv-auths/:id} : Updates an existing hvAuth.
     *
     * @param id the id of the hvAuth to save.
     * @param hvAuth the hvAuth to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hvAuth,
     * or with status {@code 400 (Bad Request)} if the hvAuth is not valid,
     * or with status {@code 500 (Internal Server Error)} if the hvAuth couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/hv-auths/{id}")
    public ResponseEntity<HvAuth> updateHvAuth(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody HvAuth hvAuth
    ) throws URISyntaxException {
        log.debug("REST request to update HvAuth : {}, {}", id, hvAuth);
        if (hvAuth.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hvAuth.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hvAuthRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HvAuth result = hvAuthService.update(hvAuth);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hvAuth.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /hv-auths/:id} : Partial updates given fields of an existing hvAuth, field will ignore if it is null
     *
     * @param id the id of the hvAuth to save.
     * @param hvAuth the hvAuth to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated hvAuth,
     * or with status {@code 400 (Bad Request)} if the hvAuth is not valid,
     * or with status {@code 404 (Not Found)} if the hvAuth is not found,
     * or with status {@code 500 (Internal Server Error)} if the hvAuth couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/hv-auths/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HvAuth> partialUpdateHvAuth(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody HvAuth hvAuth
    ) throws URISyntaxException {
        log.debug("REST request to partial update HvAuth partially : {}, {}", id, hvAuth);
        if (hvAuth.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, hvAuth.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!hvAuthRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HvAuth> result = hvAuthService.partialUpdate(hvAuth);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, hvAuth.getId()));
    }

    /**
     * {@code GET  /hv-auths} : get all the hvAuths.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of hvAuths in body.
     */
    @GetMapping("/hv-auths")
    public ResponseEntity<List<HvAuth>> getAllHvAuths(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of HvAuths");
        Page<HvAuth> page = hvAuthService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /hv-auths/:id} : get the "id" hvAuth.
     *
     * @param id the id of the hvAuth to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the hvAuth, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/hv-auths/{id}")
    public ResponseEntity<HvAuth> getHvAuth(@PathVariable String id) {
        log.debug("REST request to get HvAuth : {}", id);
        Optional<HvAuth> hvAuth = hvAuthService.findOne(id);
        return ResponseUtil.wrapOrNotFound(hvAuth);
    }

    /**
     * {@code DELETE  /hv-auths/:id} : delete the "id" hvAuth.
     *
     * @param id the id of the hvAuth to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/hv-auths/{id}")
    public ResponseEntity<Void> deleteHvAuth(@PathVariable String id) {
        log.debug("REST request to delete HvAuth : {}", id);
        hvAuthService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
