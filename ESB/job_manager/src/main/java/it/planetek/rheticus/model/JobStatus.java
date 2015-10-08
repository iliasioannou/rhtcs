/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

/**
 * The Enum JobStatus.
 */
public enum JobStatus
    {
        /** New job */
        CREATED("CREATED"),
        /** Job in progress */
        PROGRESS("PROGRESS"),
        /** Job finished with success */
        SUCCESS("SUCCESS"),
        /** Job finished with failure */
        FAILURE("FAILURE"),
        /** Job in timeout */
        TIMEOUT("TIMEOUT"),
        /** Job status unknown */
        UNKNOWN("UNKNOWN");

        private String code;


        /**
         * Instantiates a new job status.
         *
         * @param code
         *            the code
         */
        private JobStatus(final String code)
            {
                this.code = code;
            }


        /**
         * Gets the code.
         *
         * @return the code
         */
        public String getCode()
            {
                return code;
            }


        /**
         * Check if a string value is contained into enum
         *
         * @param value
         *            the value
         * @return true, if successful
         */
        public static boolean contains(final String value)
            {
                for (final JobStatus jobStatus : values())
                    {
                        if (jobStatus.name().equalsIgnoreCase(value))
                            {
                                return true;
                            }
                    }
                return false;
            }


        /**
         * Gets the value.
         *
         * @param value
         *            the value
         * @return the value
         */
        public static JobStatus getValue(final String value)
            {
                for (final JobStatus jobStatus : values())
                    {
                        if (jobStatus.name().equalsIgnoreCase(value))
                            {
                                return jobStatus;
                            }
                    }
                return UNKNOWN;
            }
    }
