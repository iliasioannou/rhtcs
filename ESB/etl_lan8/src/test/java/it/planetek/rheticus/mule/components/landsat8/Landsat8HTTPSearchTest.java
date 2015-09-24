package it.planetek.rheticus.mule.components.landsat8;

import static org.junit.Assert.*;

import org.junit.Before;
import org.junit.Test;
import org.mule.tck.junit4.AbstractMuleTestCase;

import it.planetek.rheticus.mule.components.landsat8.Landsat8HTTPSearch;

public class Landsat8HTTPSearchTest extends AbstractMuleTestCase {
	
	Landsat8HTTPSearch classUnderTest;
	
	@Before
	public void before(){
		classUnderTest = new Landsat8HTTPSearch();
	}
	
	@Test
	public void testCreateDateAndRangeFilterWithValidValue() {
		String fromValue = "10";
		String toValue = "50";
		
		assertTrue(classUnderTest.createDateAndRangeFilter(fromValue, toValue).equals("[10+TO+50]"));
	}

	@Test
	public void testCreateDateAndRangeFilterWithNoValidFromValue() {
		String fromValue = "";
		String toValue = "50";
		
		assertTrue(classUnderTest.createDateAndRangeFilter(fromValue, toValue).equals(""));
	}

	@Test
	public void testCreateDateAndRangeFilterWithNoValidToValue() {
		String fromValue = "10";
		String toValue = null;
		
		assertTrue(classUnderTest.createDateAndRangeFilter(fromValue, toValue).equals(""));
	}
	
	@Test
	public void testCreateQueryOnSingleFieldWithValidValue() {
		String fieldName = "pippo";
		String searchTerm = "value";
		
		assertTrue(classUnderTest.createQueryOnSingleField(fieldName, searchTerm).equals("pippo:value"));
	}

	@Test
	public void testCreateQueryOnSingleFieldWithNoValidFieldNameValue() {
		String fieldName = null;
		String searchTerm = "value";
		
		assertTrue(classUnderTest.createQueryOnSingleField(fieldName, searchTerm).equals(""));
	}

	

	@Test
	public void testCreateQueryOnSingleFieldWithNoValidSearchTermValue() {
		String fieldName = "pippo";
		String searchTerm = "";
		
		assertTrue(classUnderTest.createQueryOnSingleField(fieldName, searchTerm).equals(""));
	}	
	
	
	@Test
	public void testCreateQueryOnManyFieldWithOneValidQuery(){
		String query_01 = "qui";
		
		assertTrue(classUnderTest.createQueryOnManyField(query_01).equals("search=qui"));
	}

	@Test
	public void testCreateQueryOnManyFieldWithValidQuery(){
		String query_01 = "qui";
		String query_02 = "quo";
		String query_03 = "qua";
		
		assertTrue(classUnderTest.createQueryOnManyField(query_01, query_02, query_03) .equals("search=qui+AND+quo+AND+qua"));
	}
	
	@Test
	public void testCreateQueryOnManyFieldWithNoValidFirstQuery(){
		String query_01 = null;
		String query_02 = "quo";
		String query_03 = "qua";
		
		assertTrue(classUnderTest.createQueryOnManyField(query_01, query_02, query_03) .equals("search=quo+AND+qua"));
	}

	@Test
	public void testCreateQueryOnManyFieldWithNoValidSecondQuery(){
		String query_01 = "qui";
		String query_02 = "";
		String query_03 = "qua";
		
		assertTrue(classUnderTest.createQueryOnManyField(query_01, query_02, query_03) .equals("search=qui+AND+qua"));
	}
	
	@Test
	public void testCreateQueryOnManyFieldWithNoValidThirdQuery(){
		String query_01 = "qui";
		String query_02 = "quo";
		String query_03 = null;
		
		assertTrue(classUnderTest.createQueryOnManyField(query_01, query_02, query_03) .equals("search=qui+AND+quo"));
	}
	
	@Test
	public void testAppendParameterToQueryStringWithValidParameter(){
		String param_01 = "qui";
		String param_02 = "quo";
		String param_03 = "qua";
		
		StringBuffer queryString = new StringBuffer();
		classUnderTest.appendParameterToQueryString(queryString, param_01);
		classUnderTest.appendParameterToQueryString(queryString, param_02);
		classUnderTest.appendParameterToQueryString(queryString, param_03);
		
		assertTrue(queryString.toString().equals("qui&quo&qua"));
	}
	
	@Test
	public void testAppendParameterToQueryStringWithValidFirstParameter(){
		String param_01 = "";
		String param_02 = "quo";
		String param_03 = "qua";
		
		StringBuffer queryString = new StringBuffer();
		classUnderTest.appendParameterToQueryString(queryString, param_01);
		classUnderTest.appendParameterToQueryString(queryString, param_02);
		classUnderTest.appendParameterToQueryString(queryString, param_03);
		
		assertTrue(queryString.toString().equals("quo&qua"));
	}
	
	@Test
	public void testAppendParameterToQueryStringWithValidSecondParameter(){
		String param_01 = "qui";
		String param_02 = null;
		String param_03 = "qua";
		
		StringBuffer queryString = new StringBuffer();
		classUnderTest.appendParameterToQueryString(queryString, param_01);
		classUnderTest.appendParameterToQueryString(queryString, param_02);
		classUnderTest.appendParameterToQueryString(queryString, param_03);
		
		assertTrue(queryString.toString().equals("qui&qua"));
	}	

	@Test
	public void testAppendParameterToQueryStringWithValidThirdParameter(){
		String param_01 = "qui";
		String param_02 = "quo";
		String param_03 = null;
		
		StringBuffer queryString = new StringBuffer();
		classUnderTest.appendParameterToQueryString(queryString, param_01);
		classUnderTest.appendParameterToQueryString(queryString, param_02);
		classUnderTest.appendParameterToQueryString(queryString, param_03);
		
		assertTrue(queryString.toString().equals("qui&quo"));
	}	
	
}
