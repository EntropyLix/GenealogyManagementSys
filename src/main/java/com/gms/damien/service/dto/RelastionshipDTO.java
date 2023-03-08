package com.gms.damien.service.dto;

import java.io.Serializable;

public class RelastionshipDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long fromId;
    private Long toId;
    private String relationshipName;

    /**
     * @return the fromId
     */
    public Long getFromId() {
        return fromId;
    }

    /**
     * @param fromId the fromId to set
     */
    public void setFromId(Long fromId) {
        this.fromId = fromId;
    }

    /**
     * @return the toId
     */
    public Long getToId() {
        return toId;
    }

    /**
     * @param toId the toId to set
     */
    public void setToId(Long toId) {
        this.toId = toId;
    }

    /**
     * @return the relationshipName
     */
    public String getRelationshipName() {
        return relationshipName;
    }

    /**
     * @param relationshipName the relationshipName to set
     */
    public void setRelationshipName(String relationshipName) {
        this.relationshipName = relationshipName;
    }
}
