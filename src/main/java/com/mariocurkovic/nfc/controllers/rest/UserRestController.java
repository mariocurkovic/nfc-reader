package com.mariocurkovic.nfc.controllers.rest;

import com.mariocurkovic.nfc.domain.User;
import com.mariocurkovic.nfc.service.UserService;
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
@RequestMapping("/api/user")
public class UserRestController {

    @Autowired
    private UserService userService;

    @PostMapping("/all")
    public DataTablesOutput<User> getAll(@Valid @RequestBody DataTablesInput dataTablesInput) {
        return userService.get(dataTablesInput);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable("id") int id) {
        return userService.get(Long.valueOf(id));
    }

    @PostMapping("/")
    public User save(@Valid @RequestBody User user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") int id) {
        User user = userService.get(Long.valueOf(id));
        if (user != null) {
            userService.delete(user);
        }
    }

}