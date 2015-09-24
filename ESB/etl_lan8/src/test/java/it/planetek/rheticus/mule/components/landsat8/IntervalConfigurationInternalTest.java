package it.planetek.rheticus.mule.components.landsat8;

import static org.junit.Assert.*;

import org.joda.time.LocalDate;
import org.junit.Test;
import org.mule.tck.junit4.AbstractMuleTestCase;

public class IntervalConfigurationInternalTest extends  AbstractMuleTestCase{

	@Test
	public void testFormatDate() {
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		LocalDate date = new LocalDate(2015, 1, 20);
		assertEquals("2015-01-20", classUnderTest.formatDate(date));
	}	

	@Test
	public void testFormatDateWithNull() {
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		LocalDate dateToFormat = null;
		String expectedFormat  = (new LocalDate()).toString(IntervalConfiguration.getLocalDateFormat());
		assertEquals(expectedFormat, classUnderTest.formatDate(dateToFormat));
	}		
	
	
	@Test
	public void testParseToLocalDateWithNullString(){
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		
		String stringToparse = null; 
		LocalDate dateExpected = new LocalDate();
		assertEquals(dateExpected, classUnderTest.parseToLocalDate(stringToparse));
	}

	@Test
	public void testParseToLocalDateWithEmptyString(){
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		
		String stringToparse = ""; 
		LocalDate dateExpected = new LocalDate();
		assertEquals(dateExpected, classUnderTest.parseToLocalDate(stringToparse));
	}

	@Test
	public void testParseToLocalDateWithNoValidString(){
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		
		String stringToparse = "2015-01-32"; 
		LocalDate dateExpected = new LocalDate();
		assertEquals(dateExpected, classUnderTest.parseToLocalDate(stringToparse));
	}
	
	@Test
	public void testParseToLocalDateWithValidString(){
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		
		String stringToparse = "2015-01-25"; 
		LocalDate dateExpected = new LocalDate(2015, 1, 25);
		assertEquals(dateExpected, classUnderTest.parseToLocalDate(stringToparse));
	}	


}
