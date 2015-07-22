package org.mule.transport.customftp;

import org.apache.commons.net.ftp.FTPClient;
import org.mule.api.MuleEvent;
import org.mule.api.endpoint.OutboundEndpoint;
import org.mule.transport.ftp.FtpConnector;
import org.mule.transport.ftp.FtpMessageDispatcher;

public class CreatePathFtpMessageDispatcher extends FtpMessageDispatcher
{
	public CreatePathFtpMessageDispatcher(OutboundEndpoint endpoint)
	{
		super(endpoint);
	}

	protected void doDispatch(MuleEvent event) throws Exception
	{
		logger.info("Custom FTP MessageDispatcher started.");
		
		String outputPattern = (String) endpoint.getProperty(FtpConnector.PROPERTY_OUTPUT_PATTERN);
		String parsedOutPattern = connector.getMuleContext().getExpressionManager().parse(outputPattern, event);
		
		String basePath = endpoint.getEndpointURI().getPath();
		
		if (basePath.endsWith("/"))
			basePath = basePath.substring(0, basePath.length() - 1);

		if (parsedOutPattern != null && parsedOutPattern.contains("/"))
		{
			if (parsedOutPattern.startsWith("/"))
				parsedOutPattern = parsedOutPattern.substring(1, parsedOutPattern.length());

			String dirs[] = parsedOutPattern.split("/", -1);
			final FTPClient client = connector.getFtp(endpoint.getEndpointURI());
			
			for (int i = 0; i < dirs.length - 1; i++)
			{
				if (!dirs[i].isEmpty())
				{
					basePath = basePath + "/" + dirs[i];
					if (!client.changeWorkingDirectory(basePath))
						client.makeDirectory(basePath);
				}
			}
						
			// Overwrite the PROPERTY_OUTPUT_PATTERN property removing the path part,
			// 		leaving the filename which will be used by super.doDispatch(event) to write the file
			event.getMessage().setOutboundProperty(FtpConnector.PROPERTY_OUTPUT_PATTERN, dirs[dirs.length - 1]);
		}
				
		super.doDispatch(event);	
	}
}
