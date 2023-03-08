package com.gms.damien.web.rest;

import com.gms.damien.domain.Family;
import com.gms.damien.repository.FamilyRepository;
import com.gms.damien.service.FamilyService;
import com.gms.damien.service.NodeService;
import com.gms.damien.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.neo4j.ogm.model.Result;
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
 * REST controller for managing {@link com.gms.damien.domain.Family}.
 */
@RestController
@RequestMapping("/api")
public class FamilyResource {

    private final Logger log = LoggerFactory.getLogger(FamilyResource.class);

    private static final String ENTITY_NAME = "family";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FamilyService familyService;

    private final FamilyRepository familyRepository;

    private final NodeService nodeService;

    public FamilyResource(FamilyService familyService, FamilyRepository familyRepository, NodeService nodeService) {
        this.familyService = familyService;
        this.familyRepository = familyRepository;
        this.nodeService = nodeService;
    }

    /**
     * {@code POST  /families} : Create a new family.
     *
     * @param family the family to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new family, or with status {@code 400 (Bad Request)} if the
     *         family has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/families")
    public ResponseEntity<Family> createFamily(@Valid @RequestBody Family family) throws URISyntaxException {
        log.debug("REST request to save Family : {}", family);
        if (family.getId() != null) {
            throw new BadRequestAlertException("A new family cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Family result = familyService.save(family);
        return ResponseEntity
            .created(new URI("/api/families/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId() + ""))
            .body(result);
    }

    /**
     * {@code PUT  /families/:id} : Updates an existing family.
     *
     * @param id     the id of the family to save.
     * @param family the family to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated family, or with status {@code 400 (Bad Request)} if the
     *         family is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the family couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/families/{id}")
    public ResponseEntity<Family> updateFamily(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Family family
    ) throws URISyntaxException {
        log.debug("REST request to update Family : {}, {}", id, family);
        if (family.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, family.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Family result = familyService.update(family);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, family.getId() + ""))
            .body(result);
    }

    /**
     * {@code PATCH  /families/:id} : Partial updates given fields of an existing
     * family, field will ignore if it is null
     *
     * @param id     the id of the family to save.
     * @param family the family to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated family, or with status {@code 400 (Bad Request)} if the
     *         family is not valid, or with status {@code 404 (Not Found)} if the
     *         family is not found, or with status
     *         {@code 500 (Internal Server Error)} if the family couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/families/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Family> partialUpdateFamily(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Family family
    ) throws URISyntaxException {
        log.debug("REST request to partial update Family partially : {}, {}", id, family);
        if (family.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, family.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!familyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Family> result = familyService.partialUpdate(family);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, family.getId() + "")
        );
    }

    /**
     * {@code GET  /families} : get all the families.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of families in body.
     */
    @GetMapping("/families")
    public ResponseEntity<List<Family>> getAllFamilies(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Families");
        Page<Family> page = familyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /families/:id} : get the "id" family.
     *
     * @param id the id of the family to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the family, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/families/{id}")
    public ResponseEntity<Family> getFamily(@PathVariable Long id) {
        log.debug("REST request to get Family : {}", id);
        Optional<Family> family = familyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(family);
    }

    /**
     * {@code GET  /families/:id} : get the "id" family.
     *
     * @param id the id of the family to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the family, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/find-path-by-family/{id}")
    public ResponseEntity<Map<String, Object>> findThePathByFamily(@PathVariable Long id) {
        log.debug("REST request to get path by id : {}", id);
        Map<String, Object> reslut = nodeService.searchPath(id);
        return ResponseEntity.ok(reslut);
    }

    /**
     * {@code GET  /families/:id} : get the "id" family.
     *
     * @param id the id of the family to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the family, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/families_by_name/{name}")
    public ResponseEntity<List<Family>> getFamiliesByName(@PathVariable String name) {
        log.debug("REST request to get Families by : {} name", name);
        List<Family> families = familyService.findByName(name);
        return ResponseEntity.ok().body(families);
    }

    /**
     * {@code DELETE  /families/:id} : delete the "id" family.
     *
     * @param id the id of the family to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/families/{id}")
    public ResponseEntity<Void> deleteFamily(@PathVariable Long id) {
        log.debug("REST request to delete Family : {}", id);
        familyService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id + ""))
            .build();
    }
}
