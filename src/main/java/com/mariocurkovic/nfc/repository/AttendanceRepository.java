package com.mariocurkovic.nfc.repository;

import com.mariocurkovic.nfc.domain.Attendance;
import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttendanceRepository extends DataTablesRepository<Attendance, Long> {

}
