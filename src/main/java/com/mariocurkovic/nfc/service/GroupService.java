package com.mariocurkovic.nfc.service;

import com.mariocurkovic.nfc.domain.Group;
import com.mariocurkovic.nfc.repository.GroupRepository;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public DataTablesOutput<Group> get(DataTablesInput dataTablesInput) {
        return groupRepository.findAll(dataTablesInput);
    }

    public List<Group> get() {
        return IterableUtils.toList(groupRepository.findAll()).stream().sorted(Comparator.comparing(Group::getName))
            .collect(Collectors.toList());
    }

    public Group get(Long id) {
        return groupRepository.findById(id).orElse(null);
    }

    @Transactional
    public Group save(Group group) {
        return groupRepository.save(group);
    }

    // TODO: check whether there are users in this group
    @Transactional
    public void delete(Group group) {
        groupRepository.delete(group);
    }

}
