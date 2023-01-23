package com.mariocurkovic.nfc.util;

import lombok.Getter;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;

public class CustomDataTablesInput extends DataTablesInput {

    @Getter
    private String minDate;

    @Getter
    private String maxDate;
}
