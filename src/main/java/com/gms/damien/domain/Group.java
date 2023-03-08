package com.gms.damien.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;

/**
 * A Group.
 */
@NodeEntity
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Group extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue
    private Long id;

    @Property("name")
    private String name;

    @Relationship(value = "HAS_MEMBERS", direction = Relationship.OUTGOING)
    // @JsonIgnoreProperties(value = { "password", "firstName","lastName","email" }, allowSetters = true)
    private Set<User> members = new HashSet<>();

    @Relationship(value = "HAS_READ", direction = Relationship.OUTGOING)
    @JsonIgnoreProperties(value = { "members", "auths" }, allowSetters = true)
    private Set<Family> reads = new HashSet<>();

    @Relationship(value = "HAS_WRITE", direction = Relationship.OUTGOING)
    @JsonIgnoreProperties(value = { "members", "auths" }, allowSetters = true)
    private Set<Family> writes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Group id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Group name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<User> getMembers() {
        return this.members;
    }

    public void setMembers(Set<User> users) {
        this.members = users;
    }

    public Group members(Set<User> users) {
        this.setMembers(users);
        return this;
    }

    public Group addMember(User user) {
        this.members.add(user);
        return this;
    }

    public Group removeMember(User user) {
        this.members.remove(user);
        return this;
    }

    public Set<Family> getReads() {
        return this.reads;
    }

    public void setReads(Set<Family> families) {
        this.reads = families;
    }

    public Group reads(Set<Family> families) {
        this.setReads(families);
        return this;
    }

    public Group addRead(Family family) {
        this.reads.add(family);
        return this;
    }

    public Group removeRead(Family family) {
        this.reads.remove(family);
        return this;
    }

    public Set<Family> getWrites() {
        return this.writes;
    }

    public void setWrites(Set<Family> families) {
        this.writes = families;
    }

    public Group writes(Set<Family> families) {
        this.setWrites(families);
        return this;
    }

    public Group addWrite(Family family) {
        this.writes.add(family);
        return this;
    }

    public Group removeWrite(Family family) {
        this.writes.remove(family);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Group)) {
            return false;
        }
        return id != null && id.equals(((Group) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Group{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
