/*
 *
 */
package it.planetek.rheticus.mule.components;

import org.apache.commons.lang.StringUtils;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * The Class Logstash.
 */
public class Logstash
        implements Callable
    {
        private static final Logger log = LoggerFactory.getLogger(Logstash.class);


        @Override
        public Object onCall(final MuleEventContext eventContext) throws Exception
            {
                final String text2log = eventContext.getMessage().getInvocationProperty("logstash");
                if (StringUtils.isBlank(text2log) == false)
                    {
                        log.info(StringUtils.trimToEmpty(text2log));
                    }
                return eventContext.getMessage();
            }

    }