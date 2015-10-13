/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.repository;

import it.planetek.rheticus.model.Job;
import it.planetek.rheticus.model.JobHistory;

import java.util.List;


/**
 * The Interface JobRepository.
 */
public interface JobRepository
    {

        /**
         * Adds the job.
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
         * Gets the job.
         *
         * @param id
         *            the id
         * @return the job
         */
        public Job getJob(String id);


        /**
         * Gets the all job.
         *
         * @return the all job
         */
        public List<Job> getAllJobs();


        /**
         * Delete job.
         *
         * @param id
         *            the id
         */
        public void deleteJob(String id);


        /**
         * Gets the history.
         *
         * @param jobId
         *            the job id
         * @return the history
         */
        public List<JobHistory> getHistory(String jobId);


        /**
         * Gets the history.
         *
         * @param job
         *            the job
         * @return the history
         */
        public List<JobHistory> getHistory(Job job);
    }
