package com.gms.damien.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.validation.constraints.*;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;
import org.neo4j.ogm.id.UuidStrategy;

/**
 * A MemberRelationship.
 */
@NodeEntity
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MemberRelationship extends AbstractAuditingEntity<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = UuidStrategy.class)
    private String id;

    @NotNull
    @Property("relationship_name")
    private String relationshipName;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "family", "fromMember", "toMember" }, allowSetters = true)
    private FamilyMember fromMember;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "family", "fromMember", "toMember" }, allowSetters = true)
    private FamilyMember toMember;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public MemberRelationship id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRelationshipName() {
        return this.relationshipName;
    }

    public MemberRelationship relationshipName(String relationshipName) {
        this.setRelationshipName(relationshipName);
        return this;
    }

    public void setRelationshipName(String relationshipName) {
        this.relationshipName = relationshipName;
    }

    public FamilyMember getFromMember() {
        return this.fromMember;
    }

    public void setFromMember(FamilyMember FamilyMember) {
        this.fromMember = FamilyMember;
    }

    public MemberRelationship fromMember(FamilyMember FamilyMember) {
        this.setFromMember(FamilyMember);
        return this;
    }

    public FamilyMember getToMember() {
        return this.toMember;
    }

    public void setToMember(FamilyMember FamilyMember) {
        this.toMember = FamilyMember;
    }

    public MemberRelationship toMember(FamilyMember FamilyMember) {
        this.setToMember(FamilyMember);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MemberRelationship)) {
            return false;
        }
        return id != null && id.equals(((MemberRelationship) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MemberRelationship{" +
            "id=" + getId() +
            ", relationshipName='" + getRelationshipName() + "'" +
            "}";
    }
}
