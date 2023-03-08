package com.gms.damien.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.validation.constraints.*;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;
import org.neo4j.ogm.id.UuidStrategy;

/**
 * A Family.
 */
@NodeEntity
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Family extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    @Property("family_name")
    private String familyName;

    @Property("description")
    private String description;

    @Property("pic")
    private String pic;

    @Relationship(value = "HAS_MEMBER", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "family", "fromMember", "toMember" }, allowSetters = true)
    private Set<FamilyMember> members = new HashSet<>();

    @Relationship("HAS_AUTH")
    @JsonIgnoreProperties(value = { "user", "family" }, allowSetters = true)
    private Set<HvAuth> auths = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Family id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFamilyName() {
        return this.familyName;
    }

    public Family familyName(String familyName) {
        this.setFamilyName(familyName);
        return this;
    }

    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    public String getDescription() {
        return this.description;
    }

    public Family description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPic() {
        return this.pic;
    }

    public Family pic(String pic) {
        this.setPic(pic);
        return this;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public Set<FamilyMember> getMembers() {
        return this.members;
    }

    public void setMembers(Set<FamilyMember> FamilyMembers) {
        this.members = FamilyMembers;
    }

    public Family members(Set<FamilyMember> FamilyMembers) {
        this.setMembers(FamilyMembers);
        return this;
    }

    public Family addMember(FamilyMember FamilyMember) {
        this.members.add(FamilyMember);
        return this;
    }

    public Family removeMember(FamilyMember FamilyMember) {
        this.members.remove(FamilyMember);
        return this;
    }

    public Set<HvAuth> getAuths() {
        return this.auths;
    }

    public void setAuths(Set<HvAuth> HvAuths) {
        this.auths = HvAuths;
    }

    public Family auths(Set<HvAuth> HvAuths) {
        this.setAuths(HvAuths);
        return this;
    }

    public Family addAuth(HvAuth HvAuth) {
        this.auths.add(HvAuth);
        return this;
    }

    public Family removeAuth(HvAuth HvAuth) {
        this.auths.remove(HvAuth);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Family)) {
            return false;
        }
        return id != null && id.equals(((Family) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Family{" +
            "id=" + getId() +
            ", familyName='" + getFamilyName() + "'" +
            ", description='" + getDescription() + "'" +
            ", pic='" + getPic() + "'" +
            "}";
    }
}
