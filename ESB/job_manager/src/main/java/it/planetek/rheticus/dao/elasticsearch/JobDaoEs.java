/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 05 ott 2015
 * Autore.........: adminpk
 ***********************************************/
package it.planetek.rheticus.dao.elasticsearch;

import it.planetek.rheticus.model.Job;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * The Interface JobDaoEs.
 */
public interface JobDaoEs
        extends ElasticsearchRepository<Job, String>
    {

    }
