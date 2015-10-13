/*
 *
 */
package it.planetek.rheticus.repository;

import it.planetek.rheticus.dao.elasticsearch.JobDaoEs;
import it.planetek.rheticus.dao.elasticsearch.JobHistoryDaoEs;
import it.planetek.rheticus.model.Job;
import it.planetek.rheticus.model.JobHistory;
import it.planetek.rheticus.util.BaseUtil;

import java.util.ArrayList;
import java.util.List;

import org.drools.util.StringUtils;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * The Class JobRepositoryImpl.
 */
public class JobRepositoryImpl
        implements JobRepository
    {
        private static final Logger   log = LoggerFactory
                                                  .getLogger(JobRepositoryImpl.class);

        private final JobDaoEs        dao;
        private final JobHistoryDaoEs daoHistory;


        /**
         * Instantiates a new job service repository.
         *
         * @param dao
         *            the dao
         * @param daoHistory
         *            the dao history
         */
        public JobRepositoryImpl(final JobDaoEs dao, final JobHistoryDaoEs daoHistory)
            {
                super();
                this.dao = dao;
                this.daoHistory = daoHistory;
                log.info("Created");
            }


        @Override
        public Job addJob(final Job job)
            {
                Job jobToReturn = null;
                if (job != null)
                    {
                        jobToReturn = dao.save(job);
                        addJobHistory(job);
                    }
                else
                    {
                        log.error("Input job is null");
                    }
                return jobToReturn;
            }


        @Override
        public Job updateJob(final Job job)
            {
                return addJob(job);
            }


        @Override
        public boolean existsJob(final String id)
            {
                return dao.exists(id);
            }


        @Override
        public Job getJob(final String id)
            {
                Job job = null;
                if (StringUtils.isEmpty(id) == false)
                    {
                        try
                            {
                                job = dao.findOne(id);
                            }
                        catch (final Exception e)
                            {
                                log.error("Error during retriving job for id {}. Error: {}", id, e.getMessage());
                                job = null;
                            }
                    }
                return job;
            }


        @Override
        public List<Job> getAllJobs()
            {
                List<Job> jobs = new ArrayList<Job>();
                try
                    {
                        jobs = (List<Job>) BaseUtil.makeCollection(dao.findAll());
                    }
                catch (final Exception e)
                    {
                        log.error("Error during retriving all jobs. Error: {}", e.getMessage());
                    }
                return jobs;
            }


        /**
         * Job count.
         *
         * @return the long
         */
        public long jobCount()
            {
                return dao.count();
            }


        @Override
        public void deleteJob(final String id)
            {
                log.warn("This Operation isn't implemented");
                // dao.delete(id);
            }


        @Override
        public List<JobHistory> getHistory(final String jobId)
            {
                final QueryBuilder query = QueryBuilders.hasParentQuery(Job.DOC_TYPE_PARENT, QueryBuilders.idsQuery(Job.DOC_TYPE_PARENT).ids(jobId));
                List<JobHistory> jobHistory = new ArrayList<JobHistory>();
                try
                    {
                        jobHistory = (List<JobHistory>) BaseUtil.makeCollection(daoHistory.search(query));
                    }
                catch (final Exception e)
                    {
                        log.error("Error during retriving history for jobId {}. Error: {}", jobId, e.getMessage());
                    }
                return jobHistory;
            }


        @Override
        public List<JobHistory> getHistory(final Job job)
            {
                List<JobHistory> jobHistory = new ArrayList<JobHistory>();
                if (job != null)
                    {
                        jobHistory = getHistory(job.getId());
                    }
                else
                    {
                        log.error("Input Job is null");
                    }

                return jobHistory;
            }


        private void addJobHistory(final Job job)
            {
                if (job != null)
                    {
                        final JobHistory jobHistory = new JobHistory(job);
                        final JobHistory jobHistorySaved = daoHistory.save(jobHistory);
                        log.debug("JobHistory added. Job: {}, JobHistory: {}", job.toString(), jobHistorySaved.toString());
                    }
                else
                    {
                        log.error("Input job is null");
                    }
            }

    }
