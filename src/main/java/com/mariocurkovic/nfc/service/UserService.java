package com.mariocurkovic.nfc.service;

import com.mariocurkovic.nfc.domain.Attendance;
import com.mariocurkovic.nfc.domain.User;
import com.mariocurkovic.nfc.repository.UserRepository;
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
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public DataTablesOutput<User> get(CustomDataTablesInput customDataTablesInput) {
        DataTablesInput dataTablesInput = customDataTablesInput;
        DataTablesOutput<User> users = userRepository.findAll(dataTablesInput);

        Date minDate = customDataTablesInput.getMinDate() != null ? Util.parseDate(customDataTablesInput.getMinDate(), "yyyy-MM-dd") : null;
        if (minDate != null) {
            Date maxDate =
                customDataTablesInput.getMaxDate() != null ? Util.parseDate(customDataTablesInput.getMaxDate(), "yyyy-MM-dd") : new Date();
            if (minDate.after(maxDate)) {
                maxDate = minDate;
            }
            maxDate = Util.addDays(maxDate, 1);

            for (User user : users.getData()) {
                Long userAttendances = userRepository.countUserAttenancesInPeriod(user.getId(), minDate, maxDate);
                user.setNfcUid(String.valueOf(userAttendances));
            }
        } else {
            for (User user : users.getData()) {
                user.setNfcUid(null);
            }
        }

        return users;
    }

    public DataTablesOutput<User> get(DataTablesInput dataTablesInput) {
        return userRepository.findAll(dataTablesInput);
    }

    public User get(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User save(User user) {
        return userRepository.save(user);
    }

    // TODO: check whether there are attendances for this user
    @Transactional
    public void delete(User user) {
        userRepository.delete(user);
    }

    public User getByNfcUid(String nfcUid) {
        return userRepository.findByNfcUid(nfcUid);
    }

}