/*
 *
 */
package it.planetek.rheticus.service;

import it.planetek.rheticus.model.Job;
import it.planetek.rheticus.model.JobHistory;
import it.planetek.rheticus.repository.JobRepositoryImpl;

import java.util.List;

import org.drools.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * The Class JobServiceImpl.
 */
public class JobServiceImpl
        implements JobService
    {
        private static final Logger     log = LoggerFactory
                                                    .getLogger(JobServiceImpl.class);
        private final JobRepositoryImpl repo;


        /*
         * private static final Map<String, JobCommand> jobCommands;
         * static { jobCommands = new HashMap<String, JobCommand>();
         * jobCommands.put("POST", new JobCommandCreate()); jobCommands.put("GET",
         * new JobCommandGet()); };
         */

        /**
         * Instantiates a new job service.
         *
         * @param repo
         *            the repo
         */
        public JobServiceImpl(final JobRepositoryImpl repo)
            {
                super();
                this.repo = repo;
                log.info("Created instance");
                // iniectRepoIntoJobCommands();
            }


        // public Object onCall(final MuleEventContext eventContext) throws
        // Exception {
        // log.debug("Input message:{} {}", System.getProperty("line.separator"),
        // eventContext.getMessage().toString());
        // log.debug("Input payload:{} {}", System.getProperty("line.separator"),
        // eventContext.getMessage().getPayload().toString());
        //
        // final String httpMethod = eventContext.getMessage().getProperty(
        // "http.method", PropertyScope.INBOUND);
        // log.debug("Input http.method: {}", httpMethod);
        //
        // OperationResult opRes = null;
        // final JobCommand jobCommand = jobCommands.get(httpMethod);
        // if (jobCommand == null) {
        // log.error("To request with http.method <{}> doens't exists JobCommand");
        // final OperationResultBuilder builderOpRes = OperationResultBuilder
        // .getBuilder();
        // builderOpRes.failureOperationResult().withCode("-1")
        // .withMessage("Problem in server");
        // opRes = builderOpRes.build();
        // } else {
        // log.info(
        // "To request with http.method <{}> is associated JobCommand: {}",
        // httpMethod, jobCommand.toString());
        // }
        // opRes = jobCommand.execute(eventContext);
        // log.debug("Operation result: {}", opRes.toString());
        //
        // eventContext.getMessage().setPayload(opRes);
        // log.debug("Output payload: {}", eventContext.getMessage().getPayload()
        // .toString());
        //
        // return eventContext.getMessage();
        // }

        // private void iniectRepoIntoJobCommands() {
        // for (final JobCommand jobCommand : jobCommands.values()) {
        // jobCommand.setRepo(repo);
        // }
        //
        // }

        @Override
        public Job getJob(final String id)
            {
                Job job = null;
                if (StringUtils.isEmpty(id) == false)
                    {
                        job = repo.getJob(id);

                    }
                return job;
            }


        @Override
        public Job addJob(final Job job)
            {
                return repo.addJob(job);
            }


        @Override
        public Job updateJob(final Job job)
            {
                return repo.updateJob(job);
            }


        @Override
        public boolean existsJob(final String id)
            {
                return repo.existsJob(id);
            }


        @Override
        public List<Job> getAllJobs()
            {
                return repo.getAllJobs();
            }


        @Override
        public long jobCount()
            {
                return repo.jobCount();
            }


        @Override
        public List<JobHistory> getJobHistory(final String jobId)
            {
                return repo.getHistory(jobId);
            }

    }
