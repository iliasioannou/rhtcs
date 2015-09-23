package it.planetek.rheticus.mule.components.landsat8;


import java.util.HashMap;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.lifecycle.Disposable;
import org.mule.api.lifecycle.Initialisable;
import org.mule.api.lifecycle.InitialisationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Landsat8ConfigureFlow implements Initialisable, Callable, Disposable
{

	private static final Logger log = LoggerFactory.getLogger(Landsat8ConfigureFlow.class);
	private final String CLASS_NAME = Landsat8ConfigureFlow.class.getSimpleName() + ": ";
	
	private Properties properties = null;
	
	@Override
	public void initialise() throws InitialisationException {
		log.info("{}Initialize", CLASS_NAME);
	}	
	
	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{	
		log.info("{}Input payload: {}", CLASS_NAME, eventContext.getMessage().getPayload().toString());
		
		init(eventContext);
		
		IntervalConfiguration intervalConfig = new IntervalConfiguration(getFromDay(), getToDay(), getNumberOfDay());
		
		HashMap<String, String> payload = new HashMap<String, String>();
		payload.put("acquisitionDateFrom", intervalConfig.getFromAsString());
		payload.put("acquisitionDateTo", intervalConfig.getToAsString());
		payload.put("sceneCenterLatitudeFrom", getSceneCenterLatitudeFrom());
		payload.put("sceneCenterLatitudeTo", getSceneCenterLatitudeTo());
		payload.put("sceneCenterLongitudeFrom", getSceneCenterLongitudeFrom());
		payload.put("sceneCenterLongitudeTo", getSceneCenterLongitudeTo());
		payload.put("limit", getLimit());
		
		eventContext.getMessage().setPayload(payload);
		return eventContext.getMessage();
	}
	
	
	@Override
	public void dispose() {
		log.info("{}Dispose", CLASS_NAME);
		
	}
	
	void init(MuleEventContext eventContext){
		properties = eventContext.getMuleContext().getRegistry().get("etl_lan8Props");
	}

	protected String getSceneCenterLatitudeFrom(){
		return properties.getProperty("landsat8.filter.aoi.sceneCenter.Latitude.From");
	}

	protected String getSceneCenterLatitudeTo(){
		return properties.getProperty("landsat8.filter.aoi.sceneCenter.Latitude.To");
	}

	protected String getSceneCenterLongitudeFrom(){
		return properties.getProperty("landsat8.filter.aoi.sceneCenter.Longitude.From");
	}

	protected String getSceneCenterLongitudeTo(){
		return properties.getProperty("landsat8.filter.aoi.sceneCenter.Longitude.To");
	}
	
	protected String getNumberOfDay(){
		return properties.getProperty("landsat8.filter.acquisitionDate.numberOfDays");
	}

	protected String getFromDay(){
		return properties.getProperty("landsat8.filter.acquisitionDate.from");
	}

	protected String getToDay(){
		return properties.getProperty("landsat8.filter.acquisitionDate.to");
	}
	
	protected String getLimit(){
		return properties.getProperty("landsat8.maxNumberOfRecords");
	}
	
}