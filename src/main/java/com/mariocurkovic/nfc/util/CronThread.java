package com.mariocurkovic.nfc.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mariocurkovic.nfc.service.AttendanceService;
import lombok.SneakyThrows;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.Map;

@Component
public class CronThread implements DisposableBean, Runnable {

    private volatile boolean isActive;

    @Autowired
    private AttendanceService attendanceService;

    private static final Logger logger = LoggerFactory.getLogger(CronThread.class);

    CronThread() {
        logger.info("Starting cron thread...");
        Thread thread = new Thread(this);
        thread.start();
    }

    @SneakyThrows
    @Override
    public void run() {

        isActive = true;

        String filePath = System.getProperty("user.home") + "\\Desktop\\NFC";

        final Path path = FileSystems.getDefault().getPath(filePath);
        try (final WatchService watchService = FileSystems.getDefault().newWatchService()) {
            final WatchKey watchKey = path.register(watchService, StandardWatchEventKinds.ENTRY_MODIFY);
            while (isActive) {
                final WatchKey wk = watchService.take();
                for (WatchEvent<?> event : wk.pollEvents()) {
                    //we only register "ENTRY_MODIFY" so the context is always a Path.
                    final Path changed = (Path) event.context();
                    if (changed.endsWith("reader.txt")) {
                        String content = Files.readString(FileSystems.getDefault().getPath(filePath + "\\reader.txt"));
                        // logger.info(content);
                        ObjectMapper mapper = new ObjectMapper();
                        String nfcUid = (String) mapper.readValue(content, Map.class).get("Uid");
                        logger.info(nfcUid);

                        if (nfcUid != null) {
                            attendanceService.save(nfcUid);
                        }

                    }
                }
                // reset the key
                boolean valid = wk.reset();
                if (!valid) {
                    System.out.println("Key has been unregistered");
                }
            }
        }

    }

    @Override
    public void destroy() {
        isActive = false;
    }
}
