/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.api;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;


/**
 * Classe utility per l'update di un job
 */
@XmlRootElement
@SuppressWarnings("javadoc")
public class JobJaxBeanUpdate
    {
        public String id;
        public String status;


        public JobJaxBeanUpdate()
            {} // JAXB needs this


        public JobJaxBeanUpdate(final String id, final String status)
            {
                this.id = id;
                this.status = status;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" id", id)
                        .append(" status", status)
                        .toString();
            }
    }
