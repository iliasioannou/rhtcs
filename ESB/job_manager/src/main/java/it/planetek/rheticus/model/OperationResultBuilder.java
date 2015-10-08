/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

import org.elasticsearch.common.lang3.StringUtils;


/**
 * Builder for operationResult
 * <p>
 * Pattern Builder
 *
 * @author <a href="mailto:coletta@planetek.it">coletta</a>.
 */
public final class OperationResultBuilder
        implements Builder<OperationResult>
    {
        private final OperationResult instanceToBuild = new OperationResult(false);


        /**
         * Gets the builder.
         *
         * @return the builder
         */
        public static OperationResultBuilder getBuilder()
            {
                return new OperationResultBuilder();
            }


        /**
         * Success operation result.
         *
         * @return the operation result builder
         */
        public OperationResultBuilder successOperationResult()
            {
                instanceToBuild.setOk(true);
                return this;
            }


        /**
         * Failure operation result.
         *
         * @return the operation result builder
         */
        public OperationResultBuilder failureOperationResult()
            {
                instanceToBuild.setOk(false);
                return this;
            }


        /**
         * Failure operation result.
         *
         * @param isOk
         *            the is ok
         * @return the operation result builder
         */
        public OperationResultBuilder withOk(final boolean isOk)
            {
                instanceToBuild.setOk(isOk);
                return this;
            }


        /**
         * With code.
         *
         * @param code
         *            the code
         * @return the operation result builder
         */
        public OperationResultBuilder withCode(final String code)
            {
                instanceToBuild.setReturnCode(StringUtils.trimToEmpty(code));
                return this;
            }


        /**
         * With code.
         *
         * @param code
         *            the code
         * @return the operation result builder
         */
        public OperationResultBuilder withCode(final int code)
            {
                instanceToBuild.setReturnCode(String.valueOf(code));
                return this;
            }


        /**
         * With message.
         *
         * @param message
         *            the message
         * @return the operation result builder
         */
        public OperationResultBuilder withMessage(final String message)
            {
                instanceToBuild.setMessage(StringUtils.trimToEmpty(message));
                return this;
            }


        /**
         * With payload.
         *
         * @param payload
         *            the payload
         * @return the operation result builder
         */
        public OperationResultBuilder withPayload(final String payload)
            {
                final String payloadSanitized = StringUtils.trimToEmpty(payload);
                if (StringUtils.isEmpty(payloadSanitized))
                    {
                        instanceToBuild.setPayload("{}");
                    }
                else
                    {
                        instanceToBuild.setPayload(payload);
                    }
                return this;
            }


        @Override
        public OperationResult build()
            {
                return instanceToBuild;
            }
    }
