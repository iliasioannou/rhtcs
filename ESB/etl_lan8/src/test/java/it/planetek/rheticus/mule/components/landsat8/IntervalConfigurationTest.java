package it.planetek.rheticus.mule.components.landsat8;

import static org.junit.Assert.*;

import org.joda.time.LocalDate;
import org.junit.Test;
import org.mule.tck.junit4.AbstractMuleTestCase;

public class IntervalConfigurationTest extends  AbstractMuleTestCase{
	
	// Unit Test
	
	@Test
	public void testWithValidFromDateAndToDate() {
		
		String fromS = "2015-01-20";
		String toS = "2015-05-21";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		String from = classUnderTest.getFromAsString();
		String to = classUnderTest.getToAsString();
		
		assertEquals(fromS, from);
		assertEquals(toS, to);
	}	
	
	@Test
	public void testWithValidFromDateAndNumberOfDays() {
		
		String fromS = "2015-05-01";
		String toS = null;
		String numberOfDays = "90";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		String from = classUnderTest.getFromAsString();
		String to = classUnderTest.getToAsString();
		
		String fromExpected = fromS;
		String toExpected = "2015-07-30";
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	
	
	@Test
	public void testWithValidToDateAndNumberOfDays() {
		
		String fromS = null;
		String toS = "2015-02-01";
		String numberOfDays = "90";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		String from = classUnderTest.getFromAsString();
		String to = classUnderTest.getToAsString();
		
		String fromExpected = "2014-11-03";
		String toExpected = toS;
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	
	
	@Test
	public void testWithoutFromAndToDateAndWithNumberOfDays() {
		
		String fromS = null;
		String toS = null;
		String numberOfDays = "90";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		LocalDate toExpected = new LocalDate();
		LocalDate fromExpected = toExpected.minusDays(Integer.valueOf(numberOfDays));
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	
	
	@Test
	public void testWithOnlyValidFromDate() {
		
		String fromS = "2015-02-01";
		String toS = "";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		LocalDate fromExpected = new LocalDate(2015, 2, 1);
		LocalDate toExpected = new LocalDate();
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	

	// Unit Test sui casi limite
	
	@Test
	public void testAllParameterAreNull() {
		
		IntervalConfiguration classUnderTest = new IntervalConfiguration(null, null, null);
		
		LocalDate today = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(today, from);
		assertEquals(today, to);
	}

	@Test
	public void testAllParameterAreEmpty() {
		
		IntervalConfiguration classUnderTest = new IntervalConfiguration("", "", "");
		
		LocalDate today = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(today, from);
		assertEquals(today, to);
	}
	
	@Test
	public void testNoValidDate() {
		
		IntervalConfiguration classUnderTest = new IntervalConfiguration("2015-01-50", "XXXXX", "");
		
		LocalDate today = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(today, from);
		assertEquals(today, to);
	}	
	

	@Test
	public void testWithCorrectFromAndTo() {
		
		String fromS = "2015-01-01";
		String toS = "2015-05-01";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate fromExpected = new LocalDate(2015, 1, 1);
		LocalDate toExpected = new LocalDate(2015, 05, 1);
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	
	
	
	@Test
	public void testWithIntervalVeryLarge() {
		
		String fromS = "1964-12-31";
		String toS = "2015-01-01";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate fromExpected = new LocalDate();
		LocalDate toExpected = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	
	
	@Test
	public void testWithFromDateIntoFuture() {
		
		String fromS = (new LocalDate()).plusDays(1).toString(IntervalConfiguration.getLocalDateFormat());
		String toS = "";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate fromExpected = new LocalDate();
		LocalDate toExpected = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}	

	@Test
	public void testWithToDateIntoFuture() {
		
		String fromS = "";
		String toS = (new LocalDate()).plusDays(1).toString(IntervalConfiguration.getLocalDateFormat());
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate fromExpected = new LocalDate();
		LocalDate toExpected = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}

	@Test
	public void testWithFromAfterToDate() {
		String fromS = "2015-05-20";
		String toS = "2015-05-01";
		String numberOfDays = "";
		IntervalConfiguration classUnderTest = new IntervalConfiguration(fromS, toS, numberOfDays);
		
		LocalDate fromExpected = new LocalDate();
		LocalDate toExpected = new LocalDate();
		
		LocalDate from = classUnderTest.getFrom();
		LocalDate to = classUnderTest.getTo();
		
		assertEquals(fromExpected, from);
		assertEquals(toExpected, to);
	}
	
	
}
