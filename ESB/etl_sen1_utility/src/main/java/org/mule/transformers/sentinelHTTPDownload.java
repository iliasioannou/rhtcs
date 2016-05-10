package org.mule.transformers;


import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.registry.MuleRegistry;
import org.mule.api.transport.PropertyScope;
import org.mule.transport.DefaultReplyToHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.codec.binary.Base64;

public class sentinelHTTPDownload implements Callable
{

	private static final Logger log = LoggerFactory.getLogger(sentinelHTTPDownload.class);

	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{	

		Properties sentinelProps = eventContext.getMuleContext().getRegistry().get("sentinelProps");

		StringBuffer response = new StringBuffer();
		String sorlEndpoint = "https://"+sentinelProps.getProperty("sentinel.host")+":"+sentinelProps.getProperty("sentinel.port")+sentinelProps.getProperty("sentinel.path.odata");
		String querystr = eventContext.getMessage().getProperty("queryDownload", PropertyScope.INVOCATION);



		log.info("Get Manifest from: "+sorlEndpoint + querystr);

		URL url = new URL ( sorlEndpoint + querystr );
		String basicAuth = sentinelProps.getProperty("sentinel.usr")+":"+sentinelProps.getProperty("sentinel.pwd");
		String encodedBasicAuth = new String( Base64.encodeBase64(basicAuth.getBytes()) );

		HttpURLConnection connection = (HttpURLConnection) url.openConnection();


		try
		{
			connection.setInstanceFollowRedirects(false);		// disable redirect used to open DataHub Error Page
			connection.setRequestMethod("GET");
			connection.setRequestProperty  ("Authorization", "Basic " + encodedBasicAuth);
			connection.setConnectTimeout(30000);
			connection.setReadTimeout(30000);
			int responseCode = connection.getResponseCode();

			eventContext.getMessage().setProperty("http.status", responseCode, PropertyScope.INBOUND);

			log.info("Response code: "+responseCode);
			if (responseCode==200)
			{
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
					// connection.disconnect() will be executed thanks to exception propagation
				}}
			else{
				throw new org.apache.commons.httpclient.HttpException("Sentinel DataHub returned an HTTP error code: "+responseCode);
			}
		}
		finally
		{
			connection.disconnect();
		}

		return response.toString();
	}

}