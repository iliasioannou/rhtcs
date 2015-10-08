/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

import org.elasticsearch.common.lang3.StringUtils;


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


        /**
         * With type.
         *
         * @param type
         *            the type
         * @return the job builder
         */
        public JobBuilder withType(final String type)
            {
                instanceToBuild.setType(StringUtils.trimToEmpty(type));
                return this;
            }


        /**
         * With step.
         *
         * @param step
         *            the step
         * @return the job builder
         */
        public JobBuilder withStep(final String step)
            {
                instanceToBuild.setStep(StringUtils.trimToEmpty(step));
                return this;
            }


        @Override
        public Job build()
            {
                return instanceToBuild;
            }
    }
