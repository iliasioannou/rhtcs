/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.util;

import java.lang.reflect.Type;

import org.apache.commons.lang.StringUtils;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;


/**
 * Serialize7Deserialize DateTime Joda Object
 */
public final class DateTimeDeserializer
        implements JsonDeserializer<DateTime>,
        JsonSerializer<DateTime>
    {
        private static final DateTimeFormatter DATE_TIME_FORMATTER = ISODateTimeFormat
                                                                           .dateTime().withZone(DateTimeZone.UTC);


        @Override
        public DateTime deserialize(final JsonElement je, final Type type,
                                    final JsonDeserializationContext jdc)
            {
                return je.getAsString().length() == 0 ? null : DATE_TIME_FORMATTER
                        .parseDateTime(je.getAsString());
            }


        @Override
        public JsonElement serialize(final DateTime src, final Type typeOfSrc,
                                     final JsonSerializationContext context)
            {
                return new JsonPrimitive(src == null ? StringUtils.EMPTY
                                                    : DATE_TIME_FORMATTER.print(src));
            }

    }