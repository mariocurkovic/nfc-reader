package com.mariocurkovic.nfc.repository;

import com.mariocurkovic.nfc.domain.User;
import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface UserRepository extends DataTablesRepository<User, Long> {

    @Query("SELECT count(a) from Attendance a where a.user.id = :userId and a.date >= :minDate and a.date <= :maxDate")
    Long countUserAttenancesInPeriod(@Param("userId") Long userId, @Param("minDate") Date minDate, @Param("maxDate") Date maxDate);

    public User findByNfcUid(String nfcUid);

}
