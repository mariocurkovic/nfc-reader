package com.mariocurkovic.nfc.controllers.rest;

import com.mariocurkovic.nfc.domain.Attendance;
import com.mariocurkovic.nfc.domain.User;
import com.mariocurkovic.nfc.service.UserService;
import com.mariocurkovic.nfc.util.CustomDataTablesInput;
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

@RestController
@RequestMapping("/api/stats")
public class StatsRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/all")
    public DataTablesOutput<User> getAll(@Valid @RequestBody CustomDataTablesInput dataTablesInput) {
        return userService.get(dataTablesInput);
    }
}