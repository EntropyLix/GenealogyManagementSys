package com.gms.damien.service.impl;

import com.gms.damien.domain.Family;
import com.gms.damien.domain.FamilyMember;
import com.gms.damien.domain.Group;
import com.gms.damien.repository.GroupRepository;
import com.gms.damien.repository.UserRepository;
import com.gms.damien.service.GroupService;
import com.gms.damien.service.NodeService;
import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Group}.
 */
@Service
public class GroupServiceImpl implements GroupService {

    private final Logger log = LoggerFactory.getLogger(GroupServiceImpl.class);

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final NodeService nodeService;

    public GroupServiceImpl(GroupRepository groupRepository, UserRepository userRepository, NodeService nodeService) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.nodeService = nodeService;
    }

    @Override
    public Group save(Group group) {
        log.debug("Request to save Group : {}", group);
        // List
        // list=group.getMembers().stream().map(user->userRepository.findById(user.getId())).collect(Collectors.toList());
        group.setCreatedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        Set<com.gms.damien.domain.User> set = group.getMembers();
        group.setMembers(new HashSet<>());
        // group.setMembers(new HashSet<>(list));
        Group newGroup = groupRepository.save(group);
        createOrDeleleUserRelastionship(set, newGroup.getId());
        return newGroup;
    }

    @Override
    public Group update(Group group) {
        log.debug("Request to update Group : {}", group);
        Group group2 = groupRepository.findById(group.getId()).get();
        // List
        // list=group.getMembers().stream().map(user->userRepository.findById(user.getId())).collect(Collectors.toList());
        group.setLastModifiedBy(((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
        group.setLastModifiedDate(Instant.now());
        group.setCreatedBy(group2.getCreatedBy());
        group.setCreatedDate(group2.getCreatedDate());
        // group.setMembers(new HashSet<>(list));
        createOrDeleleUserRelastionship(group.getMembers(), group.getId());
        deleleFamiliesRelastionship(group);
        group.setMembers(new HashSet<>());
        return groupRepository.save(group);
    }

    @Override
    public Optional<Group> partialUpdate(Group group) {
        log.debug("Request to partially update Group : {}", group);

        return groupRepository
            .findById(group.getId())
            .map(existingGroup -> {
                if (group.getName() != null) {
                    existingGroup.setName(group.getName());
                }

                return existingGroup;
            })
            .map(groupRepository::save);
    }

    @Override
    public Page<Group> findAll(Pageable pageable) {
        log.debug("Request to get all Groups");
        return groupRepository.findAll(pageable);
    }

    @Override
    public Optional<Group> findOne(Long id) {
        log.debug("Request to get Group : {}", id);
        return groupRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Group : {}", id);
        groupRepository.deleteById(id);
    }

    private void createOrDeleleUserRelastionship(Set<com.gms.damien.domain.User> set, Long groupId) {
        nodeService.deleteGroupRelastionshipOfUser(groupId);
        set.forEach(item -> nodeService.createGroupRelastionship(groupId, item.getId()));
    }

    private void deleleFamiliesRelastionship(Group group) {
        nodeService.deleteGroupRelastionshipOfFamilies(group.getId());
    }
}
