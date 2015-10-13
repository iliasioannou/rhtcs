/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.api;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;


/**
 * Classe utility per la creazione di un job
 */
@XmlRootElement
@SuppressWarnings("javadoc")
public class JobMessageIntCreate
    {
        private static final int NO_TIMEOUT    = 0;

        public String            type;
        public String            step;
        public String            externalUrlResource;
        public String            callbackUrl;
        public String            payloadForExternalResource;
        public long              secondTimeout = NO_TIMEOUT;


        public JobMessageIntCreate()
            {} // JAXB needs this


        /**
         * Instantiates a new job jax bean create.
         *
         * @param type
         *            the type
         * @param step
         *            the step
         * @param externalUrlResource
         *            the external url resource
         * @param callbackUrl
         *            the callback url
         * @param payloadForExternalResource
         *            the payload for external resource
         * @param secondTimeout
         *            the second timeout
         */
        public JobMessageIntCreate(final String type, final String step, final String externalUrlResource, final String callbackUrl, final String payloadForExternalResource, final long secondTimeout)
            {
                super();
                this.type = type;
                this.step = step;
                this.externalUrlResource = externalUrlResource;
                this.callbackUrl = callbackUrl;
                this.payloadForExternalResource = payloadForExternalResource;
                this.secondTimeout = (secondTimeout < 0) ? NO_TIMEOUT : secondTimeout;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" Type", type)
                        .append(" Step", step)
                        .append(" externalUrlResource", externalUrlResource)
                        .append(" callbackUrl", callbackUrl)
                        .append(" secondTimeout", secondTimeout)
                        .append(" payload", payloadForExternalResource)
                        .toString();
            }
    }
