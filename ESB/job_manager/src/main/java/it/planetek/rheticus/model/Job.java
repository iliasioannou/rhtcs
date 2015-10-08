/*
 *
 */
package it.planetek.rheticus.model;

import java.util.UUID;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;


/**
 * The Class Jobs.
 *
 * @Document(indexName = "job", type = "ps", shards = 1, replicas = 0,
 *                     refreshInterval = "-1", indexStoreType = "memory")
 */
@Document(indexName = "job", type = "ps")
public class Job
    {
        private static final Logger log              = LoggerFactory.getLogger(Job.class);
        private static final String ISO_8601         = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        @Id
        private String              id               = String.valueOf(UUID.randomUUID());

        @Field(type = FieldType.String, store = true)
        private String              type             = "";

        @Field(type = FieldType.String, store = true)
        private String              step             = "";

        @Field(type = FieldType.String, store = true)
        private JobStatus           status           = JobStatus.CREATED;

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private final DateTime      createdTimestamp = new DateTime();

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private DateTime            updateTimestamp  = createdTimestamp;


        /**
         * Instantiates a new jobs.
         */
        public Job()
            {
                super();
                // log.debug("{}", toString());
            }


        /**
         * @param id
         *            the id to set
         */
        public void setId(final String id)
            {
                this.id = id;
            }


        /**
         * Gets the id.
         *
         * @return the id
         */
        public String getId()
            {
                return id;
            }


        /**
         * Gets the type.
         *
         * @return the type
         */
        public String getType()
            {
                return type;
            }


        /**
         * Gets the step.
         *
         * @return the step
         */
        public String getStep()
            {
                return step;
            }


        /**
         * Sets the type.
         *
         * @param type
         *            the new type
         */
        public void setType(final String type)
            {
                this.type = type;
            }


        /**
         * Sets the step.
         *
         * @param step
         *            the new step
         */
        public void setStep(final String step)
            {
                this.step = step;
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
         * Sets the status.
         *
         * @param status
         *            the new status
         */
        public void setStatus(final JobStatus status)
            {
                this.status = status;
                updateTimestamp = new DateTime();
            }


        /**
         * Gets the created timestamp.
         *
         * @return the created timestamp
         */
        public DateTime getCreatedTimestamp()
            {
                return createdTimestamp;
            }


        /**
         * Gets the update timestamp.
         *
         * @return the update timestamp
         */
        public DateTime getUpdateTimestamp()
            {
                return updateTimestamp;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" Id", id)
                        .append(" Type", type)
                        .append(" Step", step)
                        .append(" Status", status.toString())
                        .append(" Created",
                                getCreatedTimestamp().toString(
                                                               DateTimeFormat.forPattern(ISO_8601)))
                        .append(" Update",
                                getUpdateTimestamp().toString(
                                                              DateTimeFormat.forPattern(ISO_8601)))
                        .toString();
            }
    }
