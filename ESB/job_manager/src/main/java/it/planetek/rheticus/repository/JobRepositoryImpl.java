/*
 *
 */
package it.planetek.rheticus.repository;

import it.planetek.rheticus.dao.elasticsearch.JobDaoEs;
import it.planetek.rheticus.model.Job;
import it.planetek.rheticus.util.BaseUtil;

import java.util.ArrayList;
import java.util.List;

import org.drools.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * The Class JobRepositoryImpl.
 */
public class JobRepositoryImpl
        implements JobRepository
    {
        private static final Logger log = LoggerFactory
                                                .getLogger(JobRepositoryImpl.class);

        private final JobDaoEs      dao;


        /**
         * Instantiates a new job service repository.
         *
         * @param dao
         *            the dao
         */
        public JobRepositoryImpl(final JobDaoEs dao)
            {
                super();
                this.dao = dao;
                log.info("Created");
            }


        @Override
        public Job addJob(final Job job)
            {
                return dao.save(job);
            }


        @Override
        public Job updateJob(final Job job)
            {
                return dao.save(job);
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
    }
