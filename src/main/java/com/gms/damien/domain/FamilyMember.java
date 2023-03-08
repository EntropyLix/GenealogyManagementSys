package com.gms.damien.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.*;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;
import org.neo4j.ogm.id.UuidStrategy;

/**
 * A FamilyMember.
 */
@NodeEntity
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FamilyMember extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Property("name")
    private String name;

    @NotNull
    @Property("gender")
    private String gender;

    @NotNull
    @Property("age")
    private Integer age;

    @NotNull
    @Property("address")
    private String address;

    @NotNull
    @Property("birth_date")
    private Instant birthDate;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "members", "auths" }, allowSetters = true)
    private Family family;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "fromMember", "toMember" }, allowSetters = true)
    private MemberRelationship fromMember;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "fromMember", "toMember" }, allowSetters = true)
    private MemberRelationship toMember;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FamilyMember id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public FamilyMember name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGender() {
        return this.gender;
    }

    public FamilyMember gender(String gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return this.age;
    }

    public FamilyMember age(Integer age) {
        this.setAge(age);
        return this;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getAddress() {
        return this.address;
    }

    public FamilyMember address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Instant getBirthDate() {
        return this.birthDate;
    }

    public FamilyMember birthDate(Instant birthDate) {
        this.setBirthDate(birthDate);
        return this;
    }

    public void setBirthDate(Instant birthDate) {
        this.birthDate = birthDate;
    }

    public Family getFamily() {
        return this.family;
    }

    public void setFamily(Family Family) {
        this.family = Family;
    }

    public FamilyMember family(Family Family) {
        this.setFamily(Family);
        return this;
    }

    public MemberRelationship getFromMember() {
        return this.fromMember;
    }

    public void setFromMember(MemberRelationship MemberRelationship) {
        this.fromMember = MemberRelationship;
    }

    public FamilyMember fromMember(MemberRelationship MemberRelationship) {
        this.setFromMember(MemberRelationship);
        return this;
    }

    public MemberRelationship getToMember() {
        return this.toMember;
    }

    public void setToMember(MemberRelationship MemberRelationship) {
        this.toMember = MemberRelationship;
    }

    public FamilyMember toMember(MemberRelationship MemberRelationship) {
        this.setToMember(MemberRelationship);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FamilyMember)) {
            return false;
        }
        return id != null && id.equals(((FamilyMember) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FamilyMember{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", gender='" + getGender() + "'" +
            ", age=" + getAge() +
            ", address='" + getAddress() + "'" +
            ", birthDate='" + getBirthDate() + "'" +
            "}";
    }
}
