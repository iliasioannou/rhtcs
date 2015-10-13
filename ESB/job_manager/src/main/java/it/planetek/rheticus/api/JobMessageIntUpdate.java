/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.api;

import it.planetek.rheticus.model.JobStatus;

import java.io.IOException;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.codehaus.jackson.map.ObjectMapper;


/**
 * Classe utility per l'update di un job
 */
@XmlRootElement
@SuppressWarnings("javadoc")
public class JobMessageIntUpdate
    {
        public JobStatus status;
        public String    message;
        public String    payload;


        public JobMessageIntUpdate()
            {} // JAXB needs this


        /**
         * To json.
         *
         * @return the string
         */
        public String toJson()
            {
                String jsonToReturn = "{}";
                final ObjectMapper mapper = new ObjectMapper();
                try
                    {
                        jsonToReturn = mapper.writeValueAsString(this);
                    }
                catch (final IOException e)
                    {
                        jsonToReturn = "{}";
                    }
                return jsonToReturn;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" status", status)
                        .append(" message", message)
                        .append(" payload", payload)
                        .toString();
            }
    }
