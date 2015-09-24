package it.planetek.rheticus.mule.components.landsat8;


import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.MuleMessage;
import org.mule.api.lifecycle.Callable;
import org.mule.api.lifecycle.Disposable;
import org.mule.api.lifecycle.Initialisable;
import org.mule.api.lifecycle.InitialisationException;
import org.mule.api.transport.PropertyScope;
import org.mule.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Landsat8HTTPSearch implements Initialisable, Callable, Disposable
{

	private static final Logger log = LoggerFactory.getLogger(Landsat8HTTPSearch.class);
	private final String CLASS_NAME = Landsat8HTTPSearch.class.getSimpleName() + ": ";
	private final String AND = "+AND+";
	private final String TO = "+TO+";
	
	
	private Properties properties = null;
	private MuleMessage inputMessage = null;
	
	@Override
	public void initialise() throws InitialisationException {
		log.info("{}Initialize", CLASS_NAME);
	}	
	
	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{	
		log.info("{}Input payload: {}", CLASS_NAME, eventContext.getMessage().getPayload().toString());
		
		init(eventContext);
		
		StringBuffer response = new StringBuffer();
		
		String apiEndpoint = getEndPointCatalogLandsat8();
		log.info("{}landsat8 api catalog endpoint: {}", CLASS_NAME, apiEndpoint);
		
        String queryString = getQueryStringForRequestToCatalogLandsat8();
        log.info("{}landsat8 query string: {}", CLASS_NAME, queryString);
        
        String requestUrl = apiEndpoint + "?" + queryString;
        log.info("{}landsat8 request url: {}", CLASS_NAME, requestUrl);
        
        URL url = new URL(requestUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		try
		{
			connection.setInstanceFollowRedirects(false);		// disable redirect used to open DataHub Error Page
	        connection.setRequestMethod("GET");
	        int responseCode = connection.getResponseCode();
	        log.info("{}Landsat8 catalog original response code: {}", CLASS_NAME, responseCode);
	        
	        if (responseCode == 404){
	        	//le API se non trovano nulla rispondono con 404 invece di restuituire 200 con l'indicazione che non ci sono acquisizioni per il filtro impostato
	        	log.warn("{}Non ci sono nuovi dati landsat8", CLASS_NAME);
	        	response.append(getResponseForApiReturnCode404());
	        	//riconduco la situazione al 200 con zero risultati
	        	responseCode = 200;
	        }
	        else if (responseCode == 302){
	        	//le API se non trovano la pagina rispondono con 302 ed effuttuano un redirect a https://developmentseed.org/
	        	log.error("{}Errore nell'URL della richiesta al catalogo landsat8 ", CLASS_NAME);
	        	//response.append(getResponseForApiReturnCode302());
	        	response.append(getResponseForApiReturnCode404());
	        	//riconduco la situazione al 200 con zero risultati
	        	responseCode = 200;
	        }
	        else{
	        	InputStream content = connection.getInputStream();
				BufferedReader in = new BufferedReader (new InputStreamReader (content));
		        try
		        {
		        	String line;
			        while ((line = in.readLine()) != null)
						response.append(line  + "\n");
				}
				finally
		        {
					in.close();
		        }
	        }
	        eventContext.getMessage().setProperty("http.status", responseCode, PropertyScope.INBOUND);
	        
	        log.info("{}Final Response code: {}", CLASS_NAME, responseCode);
	    }
		finally
        {
			connection.disconnect();
        }
		
		return response.toString();
	}
	
	
	@Override
	public void dispose() {
		log.info("{}Dispose", CLASS_NAME);
		
	}
	
	void init(MuleEventContext eventContext){
		properties = eventContext.getMuleContext().getRegistry().get("etl_lan8Props");
		inputMessage = eventContext.getMessage();
	}

	protected String getLandsat8ApiHttpProtocol(){
		return properties.getProperty("landsat8.protocol");
	}

	protected String getLandsat8ApiHost(){
		return properties.getProperty("landsat8.host");
	}

	protected String getLandsat8ApiPort(){
		return properties.getProperty("landsat8.port");
	}
	
	protected String getLandsat8ApiPath(){
		return properties.getProperty("landsat8.path");
	}

	@SuppressWarnings("unchecked")
	protected HashMap<String, String> getPayload(){
		return (HashMap<String, String>) inputMessage.getPayload();
	}
	
	protected String getEndPointCatalogLandsat8(){
		StringBuffer endPoint = new StringBuffer();
		appendToBufferNoEmptyString(endPoint, getLandsat8ApiHttpProtocol());
		appendToBufferNoEmptyString(endPoint, getLandsat8ApiHost());
		if (StringUtils.isNotBlank(getLandsat8ApiPort())){
			appendToBufferNoEmptyString(endPoint, ":");
			appendToBufferNoEmptyString(endPoint, getLandsat8ApiPort());
		}
		appendToBufferNoEmptyString(endPoint, getLandsat8ApiPath());
		return endPoint.toString();
	}
	
	
	protected String getQueryStringForRequestToCatalogLandsat8(){
		StringBuffer queryString = new StringBuffer();
		appendParameterToQueryString(queryString, getFinalSearchQuery());
		appendParameterToQueryString(queryString, getQueryStringParameterForLimit());
		appendParameterToQueryString(queryString, getQueryStringParameterForSkip());
		
		return queryString.toString();
	}
	
	protected StringBuffer appendParameterToQueryString(StringBuffer queryString, String parameter){
		if ((queryString.length() > 0) && StringUtils.isNotBlank(parameter)){
			appendToBufferNoEmptyString(queryString, "&");
		}
		appendToBufferNoEmptyString(queryString, parameter);
		return queryString;
	}	

	protected StringBuffer appendToBufferNoEmptyString(StringBuffer buffer, String toAppend){
		if (StringUtils.isNotBlank(toAppend)){
			buffer.append(toAppend);
		}
		return buffer;
	}	
	
	
	protected String getQueryStringParameterForLimit(){
		return createQueryStringParameterFromPayload("limit");
	}

	protected String getQueryStringParameterForSkip(){
		return createQueryStringParameterFromPayload("skip");
	}
	
	protected String createQueryStringParameterFromPayload(String paramName){
		StringBuffer queryString = new StringBuffer();
		paramName = StringUtils.trimToEmpty(paramName);
		String paramValue  = getParameterFromPayload(paramName);
		if (StringUtils.isNotBlank(paramName) && StringUtils.isNotBlank(paramValue)){
			queryString.append(paramName).append("=").append(paramValue);
		}
		return queryString.toString();
	}
	
	protected String getParameterFromPayload(String paramName){
		return StringUtils.trimToEmpty(getPayload().get(paramName));
	}
	
	/**
	 * 
	 *  search=acquisitionDate:[YYYY-MM-GG+TO+YYYY-MM-GG]
	 *  +AND+
	 *  sceneCenterLatitude:[GG.DDDDD+TO+GG.DDDDD]
	 *  +AND+
	 *  sceneCenterLongitude:[GG.DDDDD+TO+GG.DDDDD]
	 * 
	 * @return
	 */
	protected String getFinalSearchQuery(){
		return createQueryOnManyField(getAcquisitionDateFilter(), getSceneCenterLatitudeFilter(), getSceneCenterLongitudeFilter());
	}
	
	protected String getAcquisitionDateFilter(){
		return createFromPayloadDateAndRangeFilterOnSingleField("acquisitionDate", "acquisitionDateFrom", "acquisitionDateTo");
	}
	
	protected String getSceneCenterLatitudeFilter(){
		return createFromPayloadDateAndRangeFilterOnSingleField("sceneCenterLatitude", "sceneCenterLatitudeFrom", "sceneCenterLatitudeTo");
	}

	protected String getSceneCenterLongitudeFilter(){
		return createFromPayloadDateAndRangeFilterOnSingleField("sceneCenterLongitude", "sceneCenterLongitudeFrom", "sceneCenterLongitudeTo");
	}
	
	protected String createFromPayloadDateAndRangeFilterOnSingleField(String fieldName, String fromValueInPayload, String toValueInPayload){
		String from = StringUtils.trimToEmpty(getPayload().get(fromValueInPayload));
		String to = StringUtils.trimToEmpty(getPayload().get(toValueInPayload));
		return createQueryOnSingleField(fieldName, createDateAndRangeFilter(from, to));
	}	
	
	/**
	 * reference: https://open.fda.gov/api/reference/
	 * 
	 * @param fromValue
	 * @param toValue
	 * @return
	 */
	protected String createDateAndRangeFilter(String fromValue, String toValue){
		StringBuffer filter = new StringBuffer();
		if (StringUtils.isNotBlank(fromValue) && StringUtils.isNotBlank(toValue)){
			filter.append("[");
			filter.append(fromValue);
			filter.append(TO);
			filter.append(toValue);
			filter.append("]");
		}
		else{
			filter.append("");
			log.warn("{}Input filter for Scene Center latitude are invalid", CLASS_NAME);
		}
		return filter.toString();
	}	
	

	
	/**
	 * reference: https://open.fda.gov/api/reference/
	 * 
	 * @param fieldName
	 * @param searchTerm
	 * @return
	 */
	protected String createQueryOnSingleField(String fieldName, String searchTerm){
		StringBuffer queryOnSingleField = new StringBuffer();
		if (StringUtils.isNotBlank(fieldName) && StringUtils.isNotBlank(searchTerm)){
			queryOnSingleField.append(fieldName);
			queryOnSingleField.append(":");
			queryOnSingleField.append(searchTerm);
		}
		else{
			queryOnSingleField.append("");
			log.warn("{}Input name field or search term are invalid", CLASS_NAME);
		}
		return queryOnSingleField.toString();
	}    

	
	/**
	 * reference: https://open.fda.gov/api/reference/
	 * 
	 * @param queryOnSingleField
	 * @return
	 */
	protected String createQueryOnManyField(String ... queryOnSingleField){
		boolean firstCondition = true;
		StringBuffer search = new StringBuffer();
		for (int i = 0; i < queryOnSingleField.length; i++){
			if (StringUtils.isNotBlank(queryOnSingleField [i])){
				if (firstCondition == false){
					search.append(AND);
				}
				firstCondition = false;
				search.append(queryOnSingleField [i]);
			}
		}
		if (StringUtils.isNotBlank(search.toString())){
			search.insert(0, "search=");
		}
		return search.toString();
	}
	
	
	
	protected String getResponseForApiReturnCode404(){
		String response = 
				"{"
				+ "\"meta\": {"
					+ "\"credit\": \"This API is based on the openFDA's API https://github.com/FDA/openfda/tree/master/api \","
					+ "\"author\": \"Development Seed\","
					+ "\"contributor\": \"Scisco\","
					+ "\"license\": \"http://creativecommons.org/publicdomain/zero/1.0/legalcode\","
					+ "\"last_updated\": \"2015-02-18\","
					+ "\"results\": {"
						+ "\"skip\": 0,"
						+ "\"limit\": " + getParameterFromPayload("limit") + ","
						+ "\"total\": 0"
					+ "}"
				+ "},"
				+ "\"results\": []"
				+ "}";
		
		return response;
	}
	
	protected String getResponseForApiReturnCode302(){
		String response = 
				"{"
				+ "\"error\": {"
					+ "\"code\": \"BAD_URL\","
					+ "\"message\": \"Url errato\""
				+ "}"
				+ "}";
		
		return response;
	}	
}