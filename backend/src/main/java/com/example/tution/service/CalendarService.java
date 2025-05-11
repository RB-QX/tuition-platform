package com.example.tution.service;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.*;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Date;

@Service
public class CalendarService {

    @Value("${google.calendar.service-account-key}")
    private Resource keyFile;

    @Value("${google.calendar.calendar-id}")
    private String calendarId;

    private Calendar buildClient() throws Exception {
        InputStream in = keyFile.getInputStream();
        var creds = ServiceAccountCredentials.fromStream(in)
                .createScoped(Collections.singleton("https://www.googleapis.com/auth/calendar"));
        var httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        return new Calendar.Builder(httpTransport, JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(creds))
                .setApplicationName("TuitionPlatform").build();
    }

    public String createEvent(String title, String desc,
                              java.time.LocalDateTime start, int durationMinutes) throws Exception {

        Calendar client = buildClient();

        Event event = new Event()
                .setSummary(title)
                .setDescription(desc);

        var startDateTime = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(
                        Date.from(start.atZone(ZoneId.systemDefault()).toInstant())))
                .setTimeZone(ZoneId.systemDefault().toString());

        var endDateTime = new EventDateTime()
                .setDateTime(new com.google.api.client.util.DateTime(
                        Date.from(start.plusMinutes(durationMinutes)
                                   .atZone(ZoneId.systemDefault()).toInstant())))
                .setTimeZone(ZoneId.systemDefault().toString());

        event.setStart(startDateTime);
        event.setEnd(endDateTime);

        // request Google Meet link
        ConferenceData conf = new ConferenceData()
                .setCreateRequest(new CreateConferenceRequest()
                        .setRequestId(java.util.UUID.randomUUID().toString())
                        .setConferenceSolutionKey(
                                new ConferenceSolutionKey().setType("hangoutsMeet")));
        event.setConferenceData(conf);

        Event created = client.events().insert(calendarId, event)
                .setConferenceDataVersion(1)
                .execute();

        return created.getHangoutLink(); // Meet URL
    }
}
