/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 07 ott 2015
 * Autore.........: adminpk
 ***********************************************/
package it.planetek.rheticus.model;

import java.io.IOException;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;


/**
 * The Class CustomDateTimeSerializer.
 * http://www.baeldung.com/jackson-serialize-dates
 */
public class CustomDateTimeSerializer
        extends JsonSerializer<DateTime>
    {
        private static final String      ISO_8601  = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        private static DateTimeFormatter formatter = DateTimeFormat
                                                           .forPattern(ISO_8601);


        @Override
        public void serialize(final DateTime value, final JsonGenerator gen,
                              final SerializerProvider arg2) throws IOException,
                JsonProcessingException
            {
                gen.writeString(formatter.print(value));
            }

    }