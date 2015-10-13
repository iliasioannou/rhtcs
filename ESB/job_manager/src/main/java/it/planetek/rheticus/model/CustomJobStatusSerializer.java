/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 07 ott 2015
 * Autore.........: adminpk
 ***********************************************/
package it.planetek.rheticus.model;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;


/**
 * The Class CustomJobStatusSerializer.
 */
public class CustomJobStatusSerializer
        extends JsonSerializer<JobStatus>
    {
        @Override
        public void serialize(final JobStatus value, final JsonGenerator gen,
                              final SerializerProvider arg2) throws IOException,
                JsonProcessingException
            {
                gen.writeString(value.toString());
            }

    }