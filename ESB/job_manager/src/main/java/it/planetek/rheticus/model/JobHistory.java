/*
 *
 */
package it.planetek.rheticus.model;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;


/**
 * History for Jobs.
 */
public class JobHistory
    {
        private static final String ISO_8601        = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        @Field(type = FieldType.String, store = true)
        // @JsonSerialize(using = CustomJobStatusSerializer.class)
        // @JsonDeserialize(using = CustomJobStatusDeserializer.class)
        private final JobStatus     status          = JobStatus.CREATED;

        @Field(type = FieldType.String)
        private String              message         = "";

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private DateTime            updateTimestamp = new DateTime();


        /**
         * Instantiates a new jobs.
         *
         * @param status
         *            the status
         * @param message
         *            the message
         */
        public JobHistory(final JobStatus status, final String message)
            {
                super();
                // this.status = status;
                this.message = message;
                // updateTimestamp = new DateTime();
            }


        /**
         * Gets the status.
         *
         * @return the status
         */
        public JobStatus getStatus()
            {
                return status;
            }


        /**
         * Gets the update timestamp.
         *
         * @return the update timestamp
         */
        public DateTime getUpdateTimestamp()
            {
                return updateTimestamp;
                // return updateTimestamp.toString(DateTimeFormat.forPattern(ISO_8601));
            }


        /**
         * @param updateTimestamp
         *            the updateTimestamp to set
         */
        protected void setUpdateTimestamp(final DateTime updateTimestamp)
            {
                this.updateTimestamp = updateTimestamp;
            }


        /**
         * @return the message
         */
        public String getMessage()
            {
                return message;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" Status", status.toString())
                        .append(" Update", updateTimestamp.toString(DateTimeFormat.forPattern(ISO_8601)))
                        .append(" message", message)
                        .toString();
            }
    }
