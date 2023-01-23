package com.mariocurkovic.nfc.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Util {

    public static Date parseDate(String date, String format) {
        Date result = null;
        try {
            result = new SimpleDateFormat(format).parse(date);
        } catch (ParseException e) {
        }
        return result;
    }

    public static Date addDays(Date date, int numberOfDays) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, numberOfDays);
        return calendar.getTime();
    }

}
