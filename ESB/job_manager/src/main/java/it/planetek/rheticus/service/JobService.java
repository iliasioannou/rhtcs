/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.service;

import it.planetek.rheticus.model.Job;

import java.util.List;


/**
 * The Interface JobService.
 */
public interface JobService
    {

        /**
         * Gets the job.
         *
         * @param id
         *            the id
         * @return the job
         */
        public Job getJob(String id);


        /**
         * Creates the job.
         *
         * @param job
         *            the job
         * @return the job
         */
        public Job addJob(Job job);


        /**
         * Update job.
         *
         * @param job
         *            the job
         * @return the job
         */
        public Job updateJob(Job job);


        /**
         * Exists job.
         *
         * @param id
         *            the id
         * @return true, if successful
         */
        public boolean existsJob(String id);


        /**
         * Gets the all jobs.
         *
         * @return the all jobs
         */
        public List<Job> getAllJobs();


        /**
         * Count.
         *
         * @return the int
         */
        public long jobCount();

    }
