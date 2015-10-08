/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.model;

import java.io.IOException;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;


/**
 * The Class CustomDateTimeDeserializer.
 */
public class CustomDateTimeDeserializer
        extends JsonDeserializer<DateTime>
    {

        private static final String      ISO_8601  = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        private static DateTimeFormatter formatter = DateTimeFormat
                                                           .forPattern(ISO_8601);


        @Override
        public DateTime deserialize(final JsonParser jsonparser, final DeserializationContext deserializationcontext) throws IOException, JsonProcessingException
            {
                final String date = jsonparser.getText();
                return formatter.parseDateTime(date);
            }

    }
