/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 07/ott/2015
 ***********************************************/
package it.planetek.rheticus.api;

import it.planetek.rheticus.model.Job;
import it.planetek.rheticus.model.JobBuilder;
import it.planetek.rheticus.model.JobStatus;
import it.planetek.rheticus.model.OperationResult;
import it.planetek.rheticus.model.OperationResultBuilder;
import it.planetek.rheticus.service.JobServiceImpl;
import it.planetek.rheticus.util.JsonUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.UriInfo;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * The Class JobRestImpl.
 */
@Path("/jobs")
public class JobRestImpl
    {

        private static final Logger  log = LoggerFactory
                                                 .getLogger(JobServiceImpl.class);
        private final JobServiceImpl jobService;

        @Context
        private UriInfo              uriInfo;

        @Context
        private Request              request;


        /**
         * Instantiates a new job rest impl.
         *
         * @param jobService
         *            the job service
         */
        public JobRestImpl(final JobServiceImpl jobService)
            {
                super();
                this.jobService = jobService;
                log.debug("Created instance");
            }


        /**
         * Gets the job count.
         *
         * @return the job count
         */
        @GET
        @Produces(MediaType.APPLICATION_JSON)
        @Path("/count")
        public Response getJobCount()
            {
                final long jobCount = jobService.jobCount();
                final StringBuffer payloadJsonOutput = new StringBuffer();
                payloadJsonOutput.append("{")
                        .append("\"count\":")
                        .append("\"").append(jobCount).append("\"")
                        .append("}");
                final String message = String.format("Job count %d", jobCount);
                return factorySuccessResponse(Status.OK, message, payloadJsonOutput.toString());
            }


        /**
         * Gets the job details.
         *
         * @param id
         *            the param
         * @return the job details
         */
        @GET
        @Produces(MediaType.APPLICATION_JSON)
        @Path("/{id}")
        public Response getJobDetails(@PathParam("id") final String id)
            {
                Response response = null;
                final String message;
                final String jobId = StringUtils.trimToEmpty(id);
                log.debug("Input Job id: {}", jobId);

                if (StringUtils.isEmpty(jobId))
                    {
                        message = "Id job is null or empty";
                        response = factoryBadResponse(message);
                        log.error(message);
                    }
                else
                    {
                        final Job job = jobService.getJob(id);
                        if (job != null)
                            {
                                message = String.format("Job id %s exists: %s", id, job.toString());
                                response = factorySuccessResponse(Status.OK, message, JsonUtil.toJson(job));
                                log.debug(message);
                            }
                        else
                            {
                                message = String.format("Job id %s doesn't exists !", id);
                                response = factorySuccessResponse(Status.NOT_FOUND, message, JsonUtil.toJson(job));
                                log.warn(message);
                            }
                    }

                return response;
            }


        /**
         * Gets the jobs.
         *
         * @return the jobs
         */
        @GET
        @Produces(MediaType.APPLICATION_JSON)
        public Response getJobs()
            {
                log.debug("Retrieve all Jobs ...");
                final List<Job> jobs = jobService.getAllJobs();
                log.debug("Jobs retrived num: {}", jobs.size());
                final String message = String.format("Job count %d", jobs.size());
                return factorySuccessResponse(Status.OK, message, JsonUtil.toJson(jobs));
            }


        /**
         * Creates the job.
         *
         * @param paramJob
         *            the param job
         * @return the response
         */
        @POST
        @Produces(MediaType.APPLICATION_JSON)
        public Response createJob(final JobJaxBeanCreate paramJob)
            {
                Response response = null;
                final String message;

                log.debug("Param Job input: {}", paramJob.toString());

                final String typeJob = StringUtils.trimToEmpty(paramJob.type);
                final String stepJob = StringUtils.trimToEmpty(paramJob.step);

                if (StringUtils.isBlank(typeJob) || StringUtils.isBlank(stepJob))
                    {
                        message = "Problem with Input job parameters: Type and/or step job is empty";
                        response = factoryBadResponse(message);
                        log.error(message);
                    }
                else
                    {
                        final JobBuilder builderJob = JobBuilder.getBuilder();
                        builderJob.withType(typeJob);
                        builderJob.withStep(stepJob);

                        final Job job = builderJob.build();
                        jobService.addJob(job);
                        log.debug("Created job: {}", job.toString());

                        message = String.format("Job created with id %s", job.getId());
                        response = factoryCreatedResponse(message, job.getId(), JsonUtil.toJson(job));
                    }
                return response;
            }


        /**
         * Update job.
         *
         * @param id
         *            the id
         * @param status
         *            the status
         * @return the response
         */
        @PUT
        @Produces(MediaType.APPLICATION_JSON)
        @Path("/{id}/{status}")
        public Response updateJob(@PathParam("id") final String id, @PathParam("status") final String status)
            {
                Response response = null;
                String message = "";

                boolean inputAreOk = true;

                final String jobId = StringUtils.trimToEmpty(id);
                log.debug("Input job id: {}", jobId);
                if (StringUtils.isBlank(jobId))
                    {
                        inputAreOk = false;
                        message = "Id job is empty";
                    }

                final String newStatus = StringUtils.trimToEmpty(status);
                log.debug("Input newStatus: {}", newStatus);
                if (JobStatus.contains(newStatus) == false)
                    {
                        inputAreOk = false;
                        message = String.format("Invalid new status job %s", newStatus);
                    }

                if (inputAreOk == false)
                    {
                        response = factoryBadResponse(message);
                        log.error(message);
                    }
                else
                    {
                        final Job job = jobService.getJob(id);
                        if (job != null)
                            {
                                log.debug("Job id {} exists: {}", id, job.toString());

                                job.setStatus(JobStatus.getValue(newStatus));
                                jobService.updateJob(job);

                                message = String.format("Job id %s update with new status: %s", id, newStatus);
                                response = factorySuccessResponse(Status.OK, message, JsonUtil.toJson(job));
                                log.debug(message);
                            }
                        else
                            {
                                message = String.format("Job id %s doesn't exists !", id);
                                response = factoryFailureResponse(Status.NOT_FOUND, message);
                                log.warn(message);
                            }
                    }

                return response;
            }


        private OperationResult factoryOperationResult(final boolean isOk, final String code, final String message, final String payload)
            {
                final String payloadToReturn = StringUtils.trimToEmpty(payload);
                final String messageToReturn = StringUtils.trimToEmpty(message);
                final String codeToReturn = StringUtils.trimToEmpty(code);
                assert (StringUtils.isBlank(payloadToReturn) == false) : "The payload is null or empty";
                assert (StringUtils.isBlank(messageToReturn) == false) : "The message is null or empty";
                assert (StringUtils.isBlank(codeToReturn) == false) : "The code is null or empty";

                final OperationResultBuilder builderOpRes = OperationResultBuilder.getBuilder();
                builderOpRes.withOk(isOk).withCode(codeToReturn).withMessage(messageToReturn).withPayload(payloadToReturn);
                return builderOpRes.build();
            }


        private OperationResult factoryOperationResult(final boolean isOk, final int code, final String message, final String payload)
            {
                return factoryOperationResult(isOk, String.valueOf(code), message, payload);
            }


        private OperationResult factorySuccessOperationResult(final int code, final String message, final String payload)
            {
                final boolean isOk = true;
                return factoryOperationResult(isOk, code, message, payload);
            }


        private OperationResult factoryFailureOperationResult(final int code, final String message, final String payload)
            {
                final boolean isOk = false;
                return factoryOperationResult(isOk, code, message, payload);
            }


        private OperationResult factoryFailureOperationResult(final int code, final String message)
            {
                final boolean isOk = false;
                final String payload = "{}";
                return factoryOperationResult(isOk, code, message, payload);
            }


        private Response factoryResponse(final boolean isOk, final Status status, final String message, final String payload)
            {
                final String payloadToReturn = StringUtils.trimToEmpty(payload);
                final String messageToReturn = StringUtils.trimToEmpty(message);
                assert (StringUtils.isBlank(payloadToReturn) == false) : "The payload is null or empty";
                assert (StringUtils.isBlank(messageToReturn) == false) : "The message is null or empty";
                assert (status != null) : "The status is null";

                final OperationResult opRes = factoryOperationResult(isOk, String.valueOf(status.getStatusCode()), message, payload);
                final Response response = Response.status(status).entity(opRes).build();
                return response;
            }


        private Response factorySuccessResponse(final Status status, final String message, final String payload)
            {
                final boolean isOk = true;
                return factoryResponse(isOk, status, message, payload);
            }


        private Response factoryFailureResponse(final Status status, final String message, final String payload)
            {
                final boolean isOk = false;
                return factoryResponse(isOk, status, message, payload);
            }


        private Response factoryFailureResponse(final Status status, final String message)
            {
                final boolean isOk = false;
                final String payload = "{}";
                return factoryResponse(isOk, status, message, payload);
            }


        private Response factoryResponse(final boolean isOk, final Status status, final String message)
            {
                final String payloadToReturn = "{}";
                return factoryResponse(isOk, status, message, payloadToReturn);
            }


        private Response factoryBadResponse(final String message)
            {
                return factoryFailureResponse(Status.BAD_REQUEST, message);
            }


        private Response factoryCreatedResponse(final String message, final String resoucesKey, final String payload)
            {
                final String resoucesKeyForUriLocation = StringUtils.trimToEmpty(resoucesKey);
                assert (StringUtils.isBlank(resoucesKeyForUriLocation) == false) : "The resoucesKey is null or empty";

                Response response = null;
                final URI createdUri = createUriLocation(resoucesKeyForUriLocation);
                if (createdUri == null)
                    {
                        response = factorySuccessResponse(Status.CREATED, message, payload);
                    }
                else
                    {
                        final OperationResult opRes = factorySuccessOperationResult(Status.CREATED.getStatusCode(), message, payload);
                        response = Response.created(createdUri).entity(opRes).build();
                    }
                return response;
            }


        private URI createUriLocation(final String resourceId)
            {
                final String resourceIdSanitezed = StringUtils.trimToEmpty(resourceId);
                assert (StringUtils.isBlank(resourceIdSanitezed) == false) : "The resourceId is null or empty";

                URI uri = null;
                try
                    {
                        uri = new URI(String.format("%s/%s", uriInfo.getAbsolutePath().toString(), resourceIdSanitezed));
                    }
                catch (final URISyntaxException e)
                    {
                        uri = null;
                    }
                return uri;
            }

    }
