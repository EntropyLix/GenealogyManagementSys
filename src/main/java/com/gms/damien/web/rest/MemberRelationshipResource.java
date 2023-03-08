package com.gms.damien.web.rest;

import com.gms.damien.domain.MemberRelationship;
import com.gms.damien.repository.MemberRelationshipRepository;
import com.gms.damien.service.MemberRelationshipService;
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
 * REST controller for managing {@link com.gms.damien.domain.MemberRelationship}.
 */
@RestController
@RequestMapping("/api")
public class MemberRelationshipResource {

    private final Logger log = LoggerFactory.getLogger(MemberRelationshipResource.class);

    private static final String ENTITY_NAME = "memberRelationship";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MemberRelationshipService memberRelationshipService;

    private final MemberRelationshipRepository memberRelationshipRepository;

    public MemberRelationshipResource(
        MemberRelationshipService memberRelationshipService,
        MemberRelationshipRepository memberRelationshipRepository
    ) {
        this.memberRelationshipService = memberRelationshipService;
        this.memberRelationshipRepository = memberRelationshipRepository;
    }

    /**
     * {@code POST  /member-relationships} : Create a new memberRelationship.
     *
     * @param memberRelationship the memberRelationship to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new memberRelationship, or with status {@code 400 (Bad Request)} if the memberRelationship has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/member-relationships")
    public ResponseEntity<MemberRelationship> createMemberRelationship(@Valid @RequestBody MemberRelationship memberRelationship)
        throws URISyntaxException {
        log.debug("REST request to save MemberRelationship : {}", memberRelationship);
        if (memberRelationship.getId() != null) {
            throw new BadRequestAlertException("A new memberRelationship cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MemberRelationship result = memberRelationshipService.save(memberRelationship);
        return ResponseEntity
            .created(new URI("/api/member-relationships/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /member-relationships/:id} : Updates an existing memberRelationship.
     *
     * @param id the id of the memberRelationship to save.
     * @param memberRelationship the memberRelationship to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated memberRelationship,
     * or with status {@code 400 (Bad Request)} if the memberRelationship is not valid,
     * or with status {@code 500 (Internal Server Error)} if the memberRelationship couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/member-relationships/{id}")
    public ResponseEntity<MemberRelationship> updateMemberRelationship(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody MemberRelationship memberRelationship
    ) throws URISyntaxException {
        log.debug("REST request to update MemberRelationship : {}, {}", id, memberRelationship);
        if (memberRelationship.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, memberRelationship.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!memberRelationshipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        MemberRelationship result = memberRelationshipService.update(memberRelationship);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, memberRelationship.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /member-relationships/:id} : Partial updates given fields of an existing memberRelationship, field will ignore if it is null
     *
     * @param id the id of the memberRelationship to save.
     * @param memberRelationship the memberRelationship to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated memberRelationship,
     * or with status {@code 400 (Bad Request)} if the memberRelationship is not valid,
     * or with status {@code 404 (Not Found)} if the memberRelationship is not found,
     * or with status {@code 500 (Internal Server Error)} if the memberRelationship couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/member-relationships/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MemberRelationship> partialUpdateMemberRelationship(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody MemberRelationship memberRelationship
    ) throws URISyntaxException {
        log.debug("REST request to partial update MemberRelationship partially : {}, {}", id, memberRelationship);
        if (memberRelationship.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, memberRelationship.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!memberRelationshipRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MemberRelationship> result = memberRelationshipService.partialUpdate(memberRelationship);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, memberRelationship.getId())
        );
    }

    /**
     * {@code GET  /member-relationships} : get all the memberRelationships.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of memberRelationships in body.
     */
    @GetMapping("/member-relationships")
    public ResponseEntity<List<MemberRelationship>> getAllMemberRelationships(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of MemberRelationships");
        Page<MemberRelationship> page = memberRelationshipService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /member-relationships/:id} : get the "id" memberRelationship.
     *
     * @param id the id of the memberRelationship to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the memberRelationship, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/member-relationships/{id}")
    public ResponseEntity<MemberRelationship> getMemberRelationship(@PathVariable String id) {
        log.debug("REST request to get MemberRelationship : {}", id);
        Optional<MemberRelationship> memberRelationship = memberRelationshipService.findOne(id);
        return ResponseUtil.wrapOrNotFound(memberRelationship);
    }

    /**
     * {@code DELETE  /member-relationships/:id} : delete the "id" memberRelationship.
     *
     * @param id the id of the memberRelationship to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/member-relationships/{id}")
    public ResponseEntity<Void> deleteMemberRelationship(@PathVariable String id) {
        log.debug("REST request to delete MemberRelationship : {}", id);
        memberRelationshipService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
