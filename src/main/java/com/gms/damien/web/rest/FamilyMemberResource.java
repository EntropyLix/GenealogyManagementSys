package com.gms.damien.web.rest;

import com.gms.damien.domain.FamilyMember;
import com.gms.damien.repository.FamilyMemberRepository;
import com.gms.damien.service.FamilyMemberService;
import com.gms.damien.service.NodeService;
import com.gms.damien.service.dto.RelastionshipDTO;
import com.gms.damien.service.impl.NodeServiceImpl;
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
 * REST controller for managing {@link com.gms.damien.domain.FamilyMember}.
 */
@RestController
@RequestMapping("/api")
public class FamilyMemberResource {

    private final Logger log = LoggerFactory.getLogger(FamilyMemberResource.class);

    private static final String ENTITY_NAME = "familyMember";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FamilyMemberService familyMemberService;

    private final FamilyMemberRepository familyMemberRepository;

    private final NodeService nodeService;

    public FamilyMemberResource(
        FamilyMemberService familyMemberService,
        FamilyMemberRepository familyMemberRepository,
        NodeService nodeService
    ) {
        this.familyMemberService = familyMemberService;
        this.familyMemberRepository = familyMemberRepository;
        this.nodeService = nodeService;
    }

    /**
     * {@code POST  /family-members} : Create a new familyMember.
     *
     * @param familyMember the familyMember to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new familyMember, or with status {@code 400 (Bad Request)}
     *         if the familyMember has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/family-members")
    public ResponseEntity<FamilyMember> createFamilyMember(@Valid @RequestBody FamilyMember familyMember) throws URISyntaxException {
        log.debug("REST request to save FamilyMember : {}", familyMember);
        if (familyMember.getId() != null) {
            throw new BadRequestAlertException("A new familyMember cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FamilyMember result = familyMemberService.save(familyMember);
        return ResponseEntity
            .created(new URI("/api/family-members/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId() + ""))
            .body(result);
    }

    @PostMapping("/family-members-relastionship")
    public ResponseEntity<FamilyMember> createRelastionship(@RequestBody RelastionshipDTO relastionship) throws URISyntaxException {
        log.debug("REST request to create Relastionship between Family Member : {}", relastionship);
        nodeService.createRelastionship(relastionship);
        return ResponseEntity.ok().build();
    }

    /**
     * {@code PUT  /family-members/:id} : Updates an existing familyMember.
     *
     * @param id           the id of the familyMember to save.
     * @param familyMember the familyMember to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated familyMember, or with status {@code 400 (Bad Request)} if
     *         the familyMember is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the familyMember couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/family-members/{id}")
    public ResponseEntity<FamilyMember> updateFamilyMember(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FamilyMember familyMember
    ) throws URISyntaxException {
        log.debug("REST request to update FamilyMember : {}, {}", id, familyMember);
        if (familyMember.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familyMember.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyMemberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FamilyMember result = familyMemberService.update(familyMember);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familyMember.getId() + ""))
            .body(result);
    }

    /**
     * {@code PATCH  /family-members/:id} : Partial updates given fields of an
     * existing familyMember, field will ignore if it is null
     *
     * @param id           the id of the familyMember to save.
     * @param familyMember the familyMember to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated familyMember, or with status {@code 400 (Bad Request)} if
     *         the familyMember is not valid, or with status {@code 404 (Not Found)}
     *         if the familyMember is not found, or with status
     *         {@code 500 (Internal Server Error)} if the familyMember couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/family-members/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FamilyMember> partialUpdateFamilyMember(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FamilyMember familyMember
    ) throws URISyntaxException {
        log.debug("REST request to partial update FamilyMember partially : {}, {}", id, familyMember);
        if (familyMember.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, familyMember.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyMemberRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FamilyMember> result = familyMemberService.partialUpdate(familyMember);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, familyMember.getId() + "")
        );
    }

    /**
     * {@code GET  /family-members} : get all the familyMembers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of familyMembers in body.
     */
    @GetMapping("/family-members")
    public ResponseEntity<List<FamilyMember>> getAllFamilyMembers(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of FamilyMembers");
        Page<FamilyMember> page = familyMemberService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /family-members/:id} : get the "id" familyMember.
     *
     * @param id the id of the familyMember to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the familyMember, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/family-members/{id}")
    public ResponseEntity<FamilyMember> getFamilyMember(@PathVariable Long id) {
        log.debug("REST request to get FamilyMember : {}", id);
        Optional<FamilyMember> familyMember = familyMemberService.findOne(id);
        return ResponseUtil.wrapOrNotFound(familyMember);
    }

    /**
     * {@code DELETE  /family-members/:id} : delete the "id" familyMember.
     *
     * @param id the id of the familyMember to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/family-members/{id}")
    public ResponseEntity<Void> deleteFamilyMember(@PathVariable Long id) {
        log.debug("REST request to delete FamilyMember : {}", id);
        familyMemberService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id + ""))
            .build();
    }
}
