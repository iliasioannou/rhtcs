/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.model;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;


/**
 * The Class CustomJobStatusDeserializer.
 */
public class CustomJobStatusDeserializer
        extends JsonDeserializer<JobStatus>
    {

        @Override
        public JobStatus deserialize(final JsonParser jsonparser, final DeserializationContext deserializationcontext) throws IOException, JsonProcessingException
            {
                final String jobStatus = jsonparser.getText();
                return JobStatus.getValue(jobStatus);
            }

    }
