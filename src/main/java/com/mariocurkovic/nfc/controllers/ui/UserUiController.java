package com.mariocurkovic.nfc.controllers.ui;

import com.mariocurkovic.nfc.libs.KTTheme;
import com.mariocurkovic.nfc.libs.config.KTThemeBaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class UserUiController {
    @Autowired
    private KTTheme theme;

    @Autowired
    private KTThemeBaseConfig settings;

    @ModelAttribute
    public void init() {
        theme.setLayout(settings.getDefaultLayout());
        theme.initLayout();
    }

    @GetMapping("/users")
    public String groups() {
        String[] vendors = { "amcharts", "amcharts-maps", "amcharts-stock" };
        theme.addVendors(vendors);

        theme.addJavascriptFile("js/custom/users/datatable.js");
        theme.addJavascriptFile("js/custom/users/crud.js");

        theme.addKey("pageTitle", "Korisnici");

        return theme.getPageView("dashboards", "users");
    }

    @GetMapping("/stats")
    public String stats() {
        String[] vendors = { "amcharts", "amcharts-maps", "amcharts-stock" };
        theme.addVendors(vendors);

        theme.addJavascriptFile("js/custom/stats/datatable.js");

        theme.addKey("pageTitle", "Statistika dolazaka");

        return theme.getPageView("dashboards", "stats");
    }

}
