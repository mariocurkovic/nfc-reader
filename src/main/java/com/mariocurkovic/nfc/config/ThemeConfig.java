package com.mariocurkovic.nfc.config;

import com.mariocurkovic.nfc.libs.KTTheme;
import com.mariocurkovic.nfc.libs.config.KTThemeBaseConfig;
import com.mariocurkovic.nfc.libs.config.KTThemeSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.RequestScope;

@Configuration
public class ThemeConfig {
    @Bean("theme")
    @RequestScope
    public KTTheme theme() {
        return new KTTheme();
    }

    @Bean("settings")
    public KTThemeBaseConfig settings() {
        KTThemeSettings settings = new KTThemeSettings();
        return settings.config;
    }
}
