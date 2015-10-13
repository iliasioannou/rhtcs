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

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.core.Response.StatusType;
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
        public Response getJob(@PathParam("id") final String id)
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
        @Consumes(MediaType.APPLICATION_JSON)
        @Produces(MediaType.APPLICATION_JSON)
        public Response createJob(final JobMessageIntCreate paramJob)
            {
                Response response = null;
                final String message;

                log.debug("Param Job input: {}", paramJob.toString());

                final String typeJob = StringUtils.trimToEmpty(paramJob.type);
                final String stepJob = StringUtils.trimToEmpty(paramJob.step);
                final String externalUrlResourceJob = StringUtils.trimToEmpty(paramJob.externalUrlResource);
                final String callbackUrlJob = StringUtils.trimToEmpty(paramJob.callbackUrl);
                final String payloadForExternalResourceJob = StringUtils.trimToEmpty(paramJob.payloadForExternalResource);
                final long secondTimeoutJob = (paramJob.secondTimeout > 0) ? paramJob.secondTimeout : Long.MAX_VALUE;

                if (StringUtils.isBlank(typeJob) || StringUtils.isBlank(stepJob) || StringUtils.isBlank(externalUrlResourceJob) || StringUtils.isBlank(callbackUrlJob))
                    {
                        message = "Problem with Input job parameters: Type and/or step job is empty";
                        response = factoryBadResponse(message);
                        log.error(message);
                    }
                else
                    {
                        final JobBuilder builderJob = JobBuilder.getBuilder();
                        // builderJob.withType(typeJob)
                        // .withStep(stepJob)
                        builderJob.withCallbackUrl(callbackUrlJob)
                                .withExternalUrlResource(externalUrlResourceJob)
                                .withPayloadForExternalResource(payloadForExternalResourceJob)
                                .withSecondTimeout(secondTimeoutJob);

                        final Job job = builderJob.build();
                        log.debug("Created job: {}", job.toString());
                        Job jobSaved = jobService.addJob(job);
                        log.debug("New job insert into ES index. jobSaved : {}", jobSaved.toString());

                        message = String.format("Job created with id %s", jobSaved.getId());
                        response = factoryCreatedResponse(message, jobSaved.getId(), JsonUtil.toJson(jobSaved));

                        final String callbackUrlJobForExternalProcess = response.getLocation().toASCIIString();
                        log.debug("Callback Url For Esternal Process: {}", callbackUrlJobForExternalProcess);

                        // ------------------------
                        // Call external resource
                        // TODO: mettere in un processo esterno l'invio delle richieste in modo da gestire anche un eventuale errore con retrieve
                        final JobMessageExtOutgoing jobMessageOut = new JobMessageExtOutgoing();
                        jobMessageOut.callbackUrl = callbackUrlJobForExternalProcess;
                        jobMessageOut.payload = payloadForExternalResourceJob;
                        log.debug("Created outgoing job message : {}", jobMessageOut.toString());
                        log.debug("Created outgoing job message json: {}", jobMessageOut.toJson());

                        try
                            {
                                final URI uriExternalProcess = new URI(externalUrlResourceJob);

                                final Client clientForExternalProcess = ClientBuilder.newClient();
                                final WebTarget webTarget = clientForExternalProcess.target(uriExternalProcess);
                                final Entity<String> messageForExternalProcess = Entity.entity(jobMessageOut.toJson(), MediaType.APPLICATION_JSON);

                                final Response responseExternalProcess = webTarget.request().accept(MediaType.APPLICATION_JSON).post(messageForExternalProcess);
                                log.debug("Response from external process: {}", responseExternalProcess.toString());

                                final StatusType responseStatus = responseExternalProcess.getStatusInfo();
                                log.debug("Response from external process status: {}", responseStatus);
                                // this is necessary for close connection
                                final String responseEntity = responseExternalProcess.readEntity(String.class);
                                log.debug("External process response entity: {}", responseEntity);

                                if (responseStatus.getStatusCode() == Status.OK.getStatusCode())
                                    {
                                        job.changeJobStatus(JobStatus.PROGRESS, "Job sent to external process with success response");
                                        log.debug("External process has accepted successfully");
                                    }
                                else
                                    {
                                        job.changeJobStatus(JobStatus.FAILURE, String.format("Job sent to external process with error response !!. Response: %s", responseExternalProcess.toString()));
                                        log.error("There is a problem with External process. Response: {}", responseExternalProcess.toString());
                                    }
                                jobSaved = jobService.updateJob(job);
                                log.debug("job update into ES index. jobSaved : {}", jobSaved.toString());
                            }
                        catch (final URISyntaxException e)
                            {
                                log.error("Problem during creation URI for : {}. Error: {}", externalUrlResourceJob, e.getMessage());
                            }
                        response = factoryCreatedResponse(message, jobSaved.getId(), JsonUtil.toJson(jobSaved));
                    }

                return response;
            }


        /**
         * Simple Update job status.
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

                                job.changeJobStatus(JobStatus.getValue(newStatus));
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


        /**
         * Update job status with payload.
         *
         * @param id
         *            the id
         * @param paramJob
         *            the param job
         * @return the response
         */
        @PUT
        @Consumes(MediaType.APPLICATION_JSON)
        @Produces(MediaType.APPLICATION_JSON)
        @Path("/{id}")
        public Response updateJob(@PathParam("id") final String id, final JobMessageExtIncoming paramJob)
            {
                Response response = null;
                String message = "";

                boolean inputAreOk = true;

                final String jobId = StringUtils.trimToEmpty(id);
                log.debug("Input Job id: {}", jobId);
                log.debug("Param Job input: {}", paramJob.toString());

                final JobStatus newStatusJob = (paramJob.isOk) ? JobStatus.SUCCESS : JobStatus.FAILURE;
                String payloadJob = StringUtils.trimToEmpty(paramJob.payload);

                log.debug("Input job id: {}", jobId);
                if (StringUtils.isBlank(jobId))
                    {
                        inputAreOk = false;
                        message = "Id job is empty";
                    }

                log.debug("Input payload: {}", payloadJob);
                if (StringUtils.isBlank(payloadJob))
                    {
                        payloadJob = "{}";
                        log.warn("PayloadJob is empty or null");
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

                                job.changeJobStatus(newStatusJob, paramJob.message);
                                jobService.updateJob(job);

                                message = String.format("Job id %s update with new status: %s", id, newStatusJob);
                                response = factorySuccessResponse(Status.OK, message, JsonUtil.toJson(job));
                                log.debug(message);

                                final String callbackOrchestrator = job.getCallbackUrl();
                                log.debug("Calling orchestrator to {}", callbackOrchestrator);
                                try
                                    {

                                        final JobMessageIntUpdate jobMessageIntUpdate = new JobMessageIntUpdate();
                                        jobMessageIntUpdate.status = newStatusJob;
                                        jobMessageIntUpdate.message = paramJob.message;
                                        jobMessageIntUpdate.payload = paramJob.payload;

                                        log.debug("Created job update message : {}", jobMessageIntUpdate.toString());

                                        final URI uriExternalProcess = new URI(callbackOrchestrator);

                                        final Client clientForOrchestrator = ClientBuilder.newClient();
                                        final WebTarget webTarget = clientForOrchestrator.target(uriExternalProcess);
                                        final Entity<String> messageForOrchestrator = Entity.entity(jobMessageIntUpdate.toJson(), MediaType.APPLICATION_JSON);

                                        final Response responseOrchestrator = webTarget.request().accept(MediaType.APPLICATION_JSON).post(messageForOrchestrator);
                                        log.debug("Response from orchestrator: {}", responseOrchestrator.toString());
                                        final StatusType responseStatus = responseOrchestrator.getStatusInfo();
                                        log.debug("Response from Orchestrator status: {}", responseStatus);
                                        // this is necessary for close connection
                                        final String responseEntity = responseOrchestrator.readEntity(String.class);
                                        log.debug("Orchestrator response entity: {}", responseEntity);
                                    }
                                catch (final URISyntaxException e)
                                    {
                                        log.error("Problem during creation URI for : {}. Error: {}", callbackOrchestrator, e.getMessage());
                                    }

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
