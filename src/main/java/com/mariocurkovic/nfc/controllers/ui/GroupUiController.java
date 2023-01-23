package com.mariocurkovic.nfc.controllers.ui;

import com.mariocurkovic.nfc.libs.KTTheme;
import com.mariocurkovic.nfc.libs.config.KTThemeBaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class GroupUiController {
    @Autowired
    private KTTheme theme;

    @Autowired
    private KTThemeBaseConfig settings;

    @ModelAttribute
    public void init() {
        theme.setLayout(settings.getDefaultLayout());
        theme.initLayout();
    }

    @GetMapping({  "/groups" })
    public String groups() {
        String[] vendors = { "amcharts", "amcharts-maps", "amcharts-stock" };
        theme.addVendors(vendors);

        theme.addJavascriptFile("js/custom/groups/datatable.js");
        theme.addJavascriptFile("js/custom/groups/crud.js");

        theme.addKey("pageTitle", "Grupe");

        return theme.getPageView("dashboards", "groups");
    }

}
