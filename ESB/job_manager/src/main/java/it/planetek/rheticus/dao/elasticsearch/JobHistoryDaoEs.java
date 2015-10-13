/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 05 ott 2015
 * Autore.........: adminpk
 ***********************************************/
package it.planetek.rheticus.dao.elasticsearch;

import it.planetek.rheticus.model.JobHistory;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


/**
 * The Interface JobHistoryDaoEs.
 */
public interface JobHistoryDaoEs
        extends ElasticsearchRepository<JobHistory, String>
    {

    }
