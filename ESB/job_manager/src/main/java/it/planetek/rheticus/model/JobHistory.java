/*
 *
 */
package it.planetek.rheticus.model;

import java.util.UUID;

import jline.internal.Log;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Parent;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;


/**
 * History for Jobs.
 */
@Document(indexName = Job.INDEX_NAME, type = Job.DOC_TYPE_CHILD)
public class JobHistory
    {
        private static final String ISO_8601        = "yyyy-MM-dd'T'HH:mm:ss.SSS";

        @Id
        private String              id              = "";

        @Field(type = FieldType.String, store = true)
        @Parent(type = Job.DOC_TYPE_PARENT)
        private String              parentId        = "";

        @Field(type = FieldType.String, store = true)
        private JobStatus           status          = JobStatus.CREATED;

        @Field(type = FieldType.String, store = true)
        private String              message         = "";

        @Field(type = FieldType.Date, store = true, format = DateFormat.date_hour_minute_second_millis)
        @JsonSerialize(using = CustomDateTimeSerializer.class)
        @JsonDeserialize(using = CustomDateTimeDeserializer.class)
        private DateTime            updateTimestamp = new DateTime();


        /**
         * Instantiates a new jobs.
         *
         * @param job
         *            the job
         */
        public JobHistory(final Job job)
            {
                super();
                if (job != null)
                    {
                        parentId = job.getId();
                        id = String.format("%s_%s", parentId, String.valueOf(UUID.randomUUID()));
                        status = job.getStatus();
                        message = StringUtils.trimToEmpty(job.getMessage());
                        updateTimestamp = job.getUpdateTimestamp();
                    }
                else
                    {
                        Log.error("Input job is null");
                    }
            }


        /**
         * Instantiates a new job history.
         */
        protected JobHistory()
            {
                super();
            }


        /**
         * @return the id
         */
        public String getId()
            {
                return id;
            }


        /**
         * @return the parentId
         */
        public String getParentId()
            {
                return parentId;
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
                        .append(" Parent Id", parentId)
                        .append(" Status", status.toString())
                        .append(" Update", updateTimestamp.toString(DateTimeFormat.forPattern(ISO_8601)))
                        .append(" message", message)
                        .toString();
            }
    }
