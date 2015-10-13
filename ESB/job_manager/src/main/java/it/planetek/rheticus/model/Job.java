/*
 *
 */
package it.planetek.rheticus.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang.StringUtils;
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
 * <p>
 * The history is update only when change the status
 *
 * @Document(indexName = "job", type = "ps", shards = 1, replicas = 0,
 *                     refreshInterval = "-1", indexStoreType = "memory")
 */
@Document(indexName = "job", type = "current")
public class Job
    {
        private static final Logger    log                        = LoggerFactory.getLogger(Job.class);
        private static final String    ISO_8601                   = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        @Id
        private String                 id                         = String.valueOf(UUID.randomUUID());

        // @Field(type = FieldType.String, store = true)
        // private String type = "";
        //
        // @Field(type = FieldType.String, store = true)
        // private String step = "";

        @Field(type = FieldType.String, store = true)
        private String                 externalUrlResource        = "";

        @Field(type = FieldType.String, store = true)
        private String                 callbackUrl                = "";

        @Field(type = FieldType.String, store = true)
        private String                 payloadForExternalResource = "";

        @Field(type = FieldType.Long, store = true)
        private long                   secondTimeout              = 0;

        @Field(type = FieldType.String, store = true)
        private JobStatus              status                     = JobStatus.CREATED;

        @Field(type = FieldType.String, store = true)
        private String                 message                    = "Created";

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private final DateTime         createdTimestamp           = new DateTime();

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private DateTime               updateTimestamp            = createdTimestamp;

        @Field(type = FieldType.Nested, includeInParent = true)
        // // @Field(type = FieldType.Nested, store = true)
        // // @JsonDeserialize(as = ArrayList.class, contentAs = JobHistory.class)
        private final List<JobHistory> history                    = new ArrayList<JobHistory>();


        /**
         * Instantiates a new jobs.
         */
        public Job()
            {
                super();
                history.add(new JobHistory(status, message));
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


        //
        // /**
        // * Gets the type.
        // *
        // * @return the type
        // */
        // public String getType()
        // {
        // return type;
        // }
        //
        //
        // /**
        // * Gets the step.
        // *
        // * @return the step
        // */
        // public String getStep()
        // {
        // return step;
        // }
        //
        //
        // /**
        // * Sets the type.
        // *
        // * @param type
        // * the new type
        // */
        // public void setType(final String type)
        // {
        // this.type = type;
        // }
        //
        //
        // /**
        // * Sets the step.
        // *
        // * @param step
        // * the new step
        // */
        // public void setStep(final String step)
        // {
        // this.step = step;
        // }

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
         * Change job status.
         * <p>
         * Change job status, update timestamp and register change into history
         *
         * @param status
         *            the status
         * @param message
         *            the message
         */
        public void changeJobStatus(final JobStatus status, final String message)
            {
                if (StringUtils.isBlank(message))
                    {
                        this.message = String.format("Transition from %s -> %s", this.status, status);
                    }
                else
                    {
                        this.message = message;
                    }
                log.debug("Change status job from {} -> {}", this.status, status);
                log.debug("Job before update: {}", toString());
                log.debug("History before update: {}", history);

                this.status = status;
                updateTimestamp = new DateTime();
                history.add(new JobHistory(this.status, this.message));
                log.debug("Job after update: {}", toString());
                log.debug("History after update: {}", history);
            }


        /**
         * Change job status.
         *
         * @param status
         *            the status
         */
        public void changeJobStatus(final JobStatus status)
            {
                changeJobStatus(status, "");
            }


        /**
         * Sets the status.
         *
         * @param status
         *            the new status
         */
        protected void setStatus(final JobStatus status)
            {
                this.status = status;
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


        /**
         * @param updateTimestamp
         *            the updateTimestamp to set
         */
        public void setUpdateTimestamp(final DateTime updateTimestamp)
            {
                this.updateTimestamp = updateTimestamp;
            }


        /**
         * @return the externalUrlResource
         */
        public String getExternalUrlResource()
            {
                return externalUrlResource;
            }


        /**
         * @return the callbackUrl
         */
        public String getCallbackUrl()
            {
                return callbackUrl;
            }


        /**
         * @param callbackUrl
         *            the callbackUrl to set
         */
        public void setCallbackUrl(final String callbackUrl)
            {
                this.callbackUrl = callbackUrl;
            }


        /**
         * @param externalUrlResource
         *            the externalUrlResource to set
         */
        public void setExternalUrlResource(final String externalUrlResource)
            {
                this.externalUrlResource = externalUrlResource;
            }


        /**
         * @return the secondTimeout
         */
        public long getSecondTimeout()
            {
                return secondTimeout;
            }


        /**
         * @param secondTimeout
         *            the secondTimeout to set
         */
        public void setSecondTimeout(final long secondTimeout)
            {
                this.secondTimeout = secondTimeout;
            }


        /**
         * @return the payloadForExternalResource
         */
        public String getPayloadForExternalResource()
            {
                return payloadForExternalResource;
            }


        /**
         * @param payloadForExternalResource
         *            the payloadForExternalResource to set
         */
        public void setPayloadForExternalResource(final String payloadForExternalResource)
            {
                this.payloadForExternalResource = payloadForExternalResource;
            }


        /**
         * @return the message
         */
        public String getMessage()
            {
                return message;
            }


        /**
         * @param message
         *            the message to set
         */
        public void setMessage(final String message)
            {
                this.message = message;
            }


        /**
         * Gets (a copy) the history.
         *
         * @return the history
         */
        public List<JobHistory> getHistory()
            {
                return new ArrayList<JobHistory>(history);
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" Id", id)
                        // .append(" Type", type)
                        // .append(" Step", step)
                        .append(" Status", status.toString())
                        .append(" TimeOut [sec]", secondTimeout)
                        .append(" Created",
                                getCreatedTimestamp().toString(
                                                               DateTimeFormat.forPattern(ISO_8601)))
                        .append(" Update",
                                getUpdateTimestamp().toString(
                                                              DateTimeFormat.forPattern(ISO_8601)))
                        .append(" num history:", history.size())
                        .append(" history:", history.toString())
                        .toString();
            }

    }
