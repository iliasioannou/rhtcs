/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 16/ott/2015
 ***********************************************/
package it.planetek.rheticus;

import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Mackup di un processore
 */
public class Processor
    {
        protected static final Logger LOG = LoggerFactory.getLogger(Processor.class);


        /**
         * Come parametro di input è previsto un int il cui valore rappresenta il tempo di attesa in secondi dopo cui deve ritornare il processore con l'accortezza che se il valore è <0 viene
         * sollevata una eccezione.
         *
         * @param args
         *            the arguments
         */
        public static void main(final String[] args)
            {
                LOG.debug("--------------------------------");
                LOG.debug("Processor Mockup started");
                int attesaInSecondi = -1;
                if (args.length > 0)
                    {
                        try
                            {
                                attesaInSecondi = Integer.parseInt(args[0]);
                                LOG.debug("Input argument = {}", attesaInSecondi);
                            }
                        catch (final NumberFormatException e)
                            {
                                LOG.error("Input argument {}  must be an integer.", args[0]);
                                LOG.debug("Processor Mockup ended with failure");
                                System.out.println(String.format("ERROR: Input argument %s  must be an integer.", args[0]));
                                System.exit(1);
                            }
                    }
                else
                    {
                        LOG.error("Input parameter is null");
                        System.out.println("ERROR: Input parameter is null");
                        throw new IllegalArgumentException("Input parameter is null");
                    }
                try
                    {
                        LOG.debug("Start sleep for {} sec", attesaInSecondi);
                        Thread.sleep(attesaInSecondi * 1000);
                        LOG.debug("Wake up after {} sec", attesaInSecondi);
                    }
                catch (final IllegalArgumentException | InterruptedException e)
                    {
                        LOG.error("Error: {}", e.getMessage());
                        LOG.debug("Processor Mockup ended with failure");
                        System.out.println("ERROR: unknow");
                        System.exit(1);
                    }
                LOG.debug("Processor Mockup ended");

                final StringBuffer toReturn = new StringBuffer();
                toReturn.append("{")
                        .append("'SuperMasterId':")
                        .append("'").append(String.valueOf(UUID.randomUUID())).append("'")
                        .append("}");
                LOG.debug("Output for caller: {}", toReturn.toString());
                System.out.print(toReturn.toString());
                System.exit(0);
            }
    }
