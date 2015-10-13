/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 09/ott/2015
 ***********************************************/
package it.planetek.rheticus.api;

import java.io.IOException;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.codehaus.jackson.map.ObjectMapper;


/**
 * Represents a incoming message from external process
 */
@SuppressWarnings("javadoc")
public class JobMessageExtIncoming
    {
        public boolean isOk;
        public String  status;
        public String  payload;
        public String  message;


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
                        .append(" isOk", isOk)
                        .append(" status", status)
                        .append(" payload", payload)
                        .append(" message", message)
                        .toString();
            }

    }
