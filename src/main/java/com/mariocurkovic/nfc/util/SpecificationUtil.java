package com.mariocurkovic.nfc.util;

import com.mariocurkovic.nfc.domain.Attendance;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class SpecificationUtil {

    public static Specification<Attendance> isInDateRange(Date minDate, Date maxDate) {
        return (root, query, builder) -> builder.between(root.get("date"), minDate, maxDate);
    }

}
