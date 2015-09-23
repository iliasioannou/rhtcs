package it.planetek.rheticus.mule.components.landsat8;


import java.util.HashMap;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.lifecycle.Disposable;
import org.mule.api.lifecycle.Initialisable;
import org.mule.api.lifecycle.InitialisationException;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Landsat8UpdatePayloadForPagination implements Initialisable, Callable, Disposable
{

	private static final Logger log = LoggerFactory.getLogger(Landsat8UpdatePayloadForPagination.class);
	private final String CLASS_NAME = Landsat8UpdatePayloadForPagination.class.getSimpleName() + ": ";
	
	@Override
	public void initialise() throws InitialisationException {
		log.info("{}Initialize", CLASS_NAME);
	}	
	
	@SuppressWarnings("unchecked")
	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{	
		log.info("{}Input payload: {}", CLASS_NAME, eventContext.getMessage().getPayload().toString());
		HashMap<String, String> payload = (HashMap<String, String>) eventContext.getMessage().getPayload();
		
		Integer newSkipValue = eventContext.getMessage().getProperty("skip", PropertyScope.INVOCATION);
		log.info("{}newSkipValue: {}", CLASS_NAME, newSkipValue);
		
		payload.put("skip", newSkipValue.toString());
		
		eventContext.getMessage().setPayload(payload);
		log.info("{}Output payload: {}", CLASS_NAME, eventContext.getMessage().getPayload().toString());
		
		return eventContext.getMessage();
	}
	
	
	@Override
	public void dispose() {
		log.info("{}Dispose", CLASS_NAME);
		
	}

}