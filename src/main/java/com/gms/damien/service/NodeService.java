package com.gms.damien.service;

import com.gms.damien.service.dto.RelastionshipDTO;
import java.util.Map;

public interface NodeService {
    public Map<String, Object> searchPath(Long id);

    public void createRelastionship(RelastionshipDTO relastionshipDTO);

    public void createGroupRelastionship(Long groupId, String userId);

    public void deleteGroupRelastionshipOfUser(Long groupId);

    public void deleteGroupRelastionshipOfFamilies(Long groupId);
}
