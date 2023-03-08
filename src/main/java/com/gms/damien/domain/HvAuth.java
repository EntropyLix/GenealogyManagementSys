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
 * A HvAuth.
 */
@NodeEntity
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HvAuth extends AbstractAuditingEntity<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = UuidStrategy.class)
    private String id;

    @NotNull
    @Property("auth_type")
    private String authType;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    private User user;

    @Relationship(value = "HAS_", direction = Relationship.INCOMING)
    @JsonIgnoreProperties(value = { "members", "auths" }, allowSetters = true)
    private Family family;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public HvAuth id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAuthType() {
        return this.authType;
    }

    public HvAuth authType(String authType) {
        this.setAuthType(authType);
        return this;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public HvAuth user(User user) {
        this.setUser(user);
        return this;
    }

    public Family getFamily() {
        return this.family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public HvAuth family(Family family) {
        this.setFamily(family);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HvAuth)) {
            return false;
        }
        return id != null && id.equals(((HvAuth) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HvAuth{" +
            "id=" + getId() +
            ", authType='" + getAuthType() + "'" +
            "}";
    }
}
