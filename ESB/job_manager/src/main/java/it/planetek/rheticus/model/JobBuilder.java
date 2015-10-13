/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

import org.apache.commons.lang.StringUtils;


/**
 * Builder for Job
 * <p>
 * Pattern Builder
 *
 * @author <a href="mailto:coletta@planetek.it">coletta</a>.
 */
public final class JobBuilder
        implements Builder<Job>
    {
        private final Job instanceToBuild = new Job();


        /**
         * Gets the builder.
         *
         * @return the builder
         */
        public static JobBuilder getBuilder()
            {
                return new JobBuilder();
            }


        // /**
        // * With type.
        // *
        // * @param type
        // * the type
        // * @return the job builder
        // */
        // public JobBuilder withType(final String type)
        // {
        // instanceToBuild.setType(StringUtils.trimToEmpty(type));
        // return this;
        // }

        // /**
        // * With step.
        // *
        // * @param step
        // * the step
        // * @return the job builder
        // */
        // public JobBuilder withStep(final String step)
        // {
        // instanceToBuild.setStep(StringUtils.trimToEmpty(step));
        // return this;
        // }

        /**
         * With external url resource.
         *
         * @param externalUrlResource
         *            the external url resource
         * @return the job builder
         */
        public JobBuilder withExternalUrlResource(final String externalUrlResource)
            {
                instanceToBuild.setExternalUrlResource(StringUtils.trimToEmpty(externalUrlResource));
                return this;
            }


        /**
         * With callback url.
         *
         * @param callbackUrl
         *            the callback url
         * @return the job builder
         */
        public JobBuilder withCallbackUrl(final String callbackUrl)
            {
                instanceToBuild.setCallbackUrl(StringUtils.trimToEmpty(callbackUrl));
                return this;
            }


        /**
         * With payload for external resource.
         *
         * @param payloadForExternalResource
         *            the payload for external resource
         * @return the job builder
         */
        public JobBuilder withPayloadForExternalResource(final String payloadForExternalResource)
            {
                instanceToBuild.setPayloadForExternalResource(StringUtils.trimToEmpty(payloadForExternalResource));
                return this;
            }


        /**
         * With second timeout.
         *
         * @param secondTimeout
         *            the second timeout
         * @return the job builder
         */
        public JobBuilder withSecondTimeout(final long secondTimeout)
            {
                instanceToBuild.setSecondTimeout(secondTimeout);
                return this;
            }


        @Override
        public Job build()
            {
                return instanceToBuild;
            }
    }
