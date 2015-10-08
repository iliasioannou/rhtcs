/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 08/ott/2015
 ***********************************************/
package it.planetek.rheticus.model;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import it.planetek.rheticus.model.JobStatus;

import org.junit.Test;


/**
 * The Class JobStatusTest.
 */
public class JobStatusTest
    {

        /**
         * Test get code.
         */
        @Test
        public void testGetCode()
            {
                assertTrue(JobStatus.CREATED.getCode().equals("CREATED"));
            }


        /**
         * Test contains valid string.
         */
        @Test
        public void testContainsValidString()
            {
                assertTrue(JobStatus.contains("CREATED"));
            }


        /**
         * Test contains invalid string.
         */
        @Test
        public void testContainsInvalidString()
            {
                assertFalse(JobStatus.contains("Pippo"));
            }


        /**
         * Test get value for valid string.
         */
        @Test
        public void testGetValueForValidString()
            {
                assertTrue(JobStatus.getValue("CREATED").equals(JobStatus.CREATED));
            }


        /**
         * Test get value for invalid string.
         */
        @Test
        public void testGetValueForInvalidString()
            {
                assertTrue(JobStatus.getValue("Pippo").equals(JobStatus.UNKNOWN));
            }
    }
