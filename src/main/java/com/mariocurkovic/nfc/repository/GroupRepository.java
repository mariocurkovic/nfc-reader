package com.mariocurkovic.nfc.repository;

import com.mariocurkovic.nfc.domain.Group;
import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupRepository extends DataTablesRepository<Group, Long> {

}
