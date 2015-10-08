/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;


/**
 * The Class OperationResult.
 */
public class OperationResult
    {
        private String  returnCode = "";
        private boolean isOk       = true;
        private String  message    = "";
        private String  payload    = "{}";


        /**
         * Instantiates a new operation result.
         *
         * @param isOk
         *            the is ok
         */
        public OperationResult(final boolean isOk)
            {
                super();
                this.isOk = isOk;
            }


        /**
         * Instantiates a new operation result.
         *
         * @param code
         *            the code
         * @param isOk
         *            the is ok
         * @param message
         *            the message
         */
        public OperationResult(final String code, final boolean isOk,
                               final String message)
            {
                this(isOk);
                returnCode = code;
                this.message = message;
            }


        /**
         * Gets the return code.
         *
         * @return the return code
         */
        public String getReturnCode()
            {
                return returnCode;
            }


        /**
         * Sets the return code.
         *
         * @param returnCode
         *            the new return code
         */
        public void setReturnCode(final String returnCode)
            {
                this.returnCode = returnCode;
            }


        /**
         * Checks if is ok.
         *
         * @return true, if is ok
         */
        public boolean isOk()
            {
                return isOk;
            }


        /**
         * Sets the ok.
         *
         * @param isOk
         *            the new ok
         */
        public void setOk(final boolean isOk)
            {
                this.isOk = isOk;
            }


        /**
         * Gets the message.
         *
         * @return the message
         */
        public String getMessage()
            {
                return message;
            }


        /**
         * Sets the message.
         *
         * @param message
         *            the new message
         */
        public void setMessage(final String message)
            {
                this.message = message;
            }


        /**
         * Gets the payload.
         *
         * @return the payload
         */
        public String getPayload()
            {
                return payload;
            }


        /**
         * Sets the payload.
         *
         * @param payload
         *            the new payload
         */
        public void setPayload(final String payload)
            {
                this.payload = payload;
            }


        /**
         * To json.
         *
         * @param object
         *            the object
         * @return the string
         */
        public String toJson(final Object object)
            {
                final Gson gson = new GsonBuilder().setPrettyPrinting()
                        .disableHtmlEscaping().create();
                return gson.toJson(object);
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" isOk", isOk).append(" returnCode", returnCode)
                        .append(" message", message).append(" payload", payload)
                        .toString();
            }

    }
