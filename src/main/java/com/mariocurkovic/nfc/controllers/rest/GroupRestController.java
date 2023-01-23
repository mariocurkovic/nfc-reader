package com.mariocurkovic.nfc.controllers.rest;

import com.mariocurkovic.nfc.domain.Group;
import com.mariocurkovic.nfc.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/group")
public class GroupRestController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/all")
    public DataTablesOutput<Group> getAll(@Valid @RequestBody DataTablesInput dataTablesInput) {
        return groupService.get(dataTablesInput);
    }

    @GetMapping("/all")
    public List<Group> getAll() {
        return groupService.get();
    }

    @GetMapping("/{id}")
    public Group getById(@PathVariable("id") int id) {
        return groupService.get(Long.valueOf(id));
    }

    @PostMapping("/")
    public Group save(@Valid @RequestBody Group group) {
        return groupService.save(group);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") int id) {
        Group group = groupService.get(Long.valueOf(id));
        if (group != null) {
            groupService.delete(group);
        }
    }

}