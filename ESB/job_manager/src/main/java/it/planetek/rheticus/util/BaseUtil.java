/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.util;

import java.util.ArrayList;
import java.util.Collection;


/**
 * The Class BaseUtil.
 */
public class BaseUtil
    {

        /**
         * Make collection.
         *
         * @param <E>
         *            the element type
         * @param iter
         *            the iter
         * @return the collection
         */
        public static <E> Collection<E> makeCollection(final Iterable<E> iter)
            {
                final Collection<E> list = new ArrayList<E>();
                for (final E item : iter)
                    {
                        list.add(item);
                    }
                return list;
            }

    }
