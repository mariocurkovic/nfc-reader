package com.mariocurkovic.nfc.service;

import com.mariocurkovic.nfc.domain.Attendance;
import com.mariocurkovic.nfc.domain.User;
import com.mariocurkovic.nfc.repository.AttendanceRepository;
import com.mariocurkovic.nfc.util.CustomDataTablesInput;
import com.mariocurkovic.nfc.util.SpecificationUtil;
import com.mariocurkovic.nfc.util.Util;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserService userService;

    public DataTablesOutput<Attendance> get(CustomDataTablesInput customDataTablesInput) {
        DataTablesInput dataTablesInput = customDataTablesInput;
        Date minDate = customDataTablesInput.getMinDate() != null ? Util.parseDate(customDataTablesInput.getMinDate(), "yyyy-MM-dd") : null;
        if (minDate == null) {
            return attendanceRepository.findAll(dataTablesInput);
        } else {
            Date maxDate =
                customDataTablesInput.getMaxDate() != null ? Util.parseDate(customDataTablesInput.getMaxDate(), "yyyy-MM-dd") : new Date();
            if (minDate.after(maxDate)) {
                maxDate = minDate;
            }
            maxDate = Util.addDays(maxDate, 1);
            return attendanceRepository.findAll(dataTablesInput, SpecificationUtil.isInDateRange(minDate, maxDate));
        }
    }

    public Attendance get(Long id) {
        return attendanceRepository.findById(id).orElse(null);
    }

    @Transactional
    public Attendance save(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    @Transactional
    public void delete(Attendance attendance) {
        attendanceRepository.delete(attendance);
    }

    public void save(String nfcUid) {
        User user = userService.getByNfcUid(nfcUid);
        if (user == null) {
            user = new User();
            user.setNfcUid(nfcUid);
            user = userService.save(user);
        }
        Attendance attendance = new Attendance();
        attendance.setDate(new Date());
        attendance.setUser(user);
        attendanceRepository.save(attendance);
    }

}
