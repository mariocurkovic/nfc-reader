package com.mariocurkovic.nfc.controllers.rest;

import com.mariocurkovic.nfc.domain.Attendance;
import com.mariocurkovic.nfc.service.AttendanceService;
import com.mariocurkovic.nfc.util.CustomDataTablesInput;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/attendance")
public class AttendancesRestController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/all")
    public DataTablesOutput<Attendance> getAll(@Valid @RequestBody CustomDataTablesInput dataTablesInput) {
        return attendanceService.get(dataTablesInput);
    }

    @GetMapping("/{id}")
    public Attendance getById(@PathVariable("id") int id) {
        return attendanceService.get(Long.valueOf(id));
    }

    @PostMapping("/")
    public Attendance save(@Valid @RequestBody Attendance attendance) {
        return attendanceService.save(attendance);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") int id) {
        Attendance attendance = attendanceService.get(Long.valueOf(id));
        if (attendance != null) {
            attendanceService.delete(attendance);
        }
    }

}