package org.mule.transformers;


import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class landsat8HTTPSearch implements Callable
{

	private static final Logger log = LoggerFactory.getLogger(landsat8HTTPSearch.class);
	
	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{	
		
		Properties landsat8Props = eventContext.getMuleContext().getRegistry().get("landsat8Props");
		
		StringBuffer response = new StringBuffer();
		String searchEndpoint = "https://"+landsat8Props.getProperty("landsat8.host")+":"+landsat8Props.getProperty("landsat8.port")+landsat8Props.getProperty("landsat8.path");
        String querystr = eventContext.getMessage().getProperty("querystr", PropertyScope.INVOCATION);
        
        //String querystr = "footprint:\"Intersects(POLYGON((-4.53 29.85, 26.75 29.85, 26.75 46.80,-4.53 46.80,-4.53 29.85)))\" AND beginPosition:[2014-01-01T00:00:00.000Z TO 2014-12-31T00:00:00.000Z] AND endPosition:[2014-01-01T00:00:00.000Z TO 2014-12-31T00:00:00.000Z] AND format=json";
        //String querystr = "*&format=json";
        
        log.info("Sending request to: "+searchEndpoint + querystr);
        
        URL url = new URL ( searchEndpoint + querystr );
		//String basicauth = sentinelProps.getProperty("landsat8.usr")+":"+sentinelProps.getProperty("landsat8.pwd");
        //String encoding = new String( Base64.encodeBase64(basicauth.getBytes()) );
        
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			
		try
		{
			connection.setInstanceFollowRedirects(false);		// disable redirect used to open DataHub Error Page
	        connection.setRequestMethod("GET");
	        //connection.setRequestProperty  ("Authorization", "Basic " + encoding);
	        int responseCode = connection.getResponseCode();
	        
	        eventContext.getMessage().setProperty("http.status", responseCode, PropertyScope.INBOUND);
	        
	        log.info("Response code: "+responseCode);
	        
	        InputStream content = (responseCode < 400) ? connection.getInputStream() : connection.getErrorStream();
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
				// connection.disconnect() will be executed thanks to exception propagation
	        }
	    }
		finally
        {
			connection.disconnect();
        }
		
		return response.toString();
	}

}