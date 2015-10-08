/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rethicus
 * Data...........: 06 ott 2015
 ***********************************************/
package it.planetek.rheticus.model;

/**
 * Interface for Builder.
 *
 * @param <T>
 *            the generic model class type
 * @author <a href="mailto:coletta@planetek.it">coletta</a>.
 */
public interface Builder<T>
    {

        /**
         * Builds the.
         *
         * @return the class
         */
        T build();

    }
