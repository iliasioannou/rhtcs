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
 * Classe utility per la creazione di un job
 */
@XmlRootElement
@SuppressWarnings("javadoc")
public class JobJaxBeanCreate
    {
        public String type;
        public String step;


        public JobJaxBeanCreate()
            {} // JAXB needs this


        public JobJaxBeanCreate(final String type, final String step)
            {
                this.type = type;
                this.step = step;
            }


        @Override
        public String toString()
            {
                return new ToStringBuilder(this, ToStringStyle.SHORT_PREFIX_STYLE)
                        .append(" Type", type)
                        .append(" Step", step)
                        .toString();
            }
    }
