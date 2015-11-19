package it.planetek.rheticus.mule.connectors;

import org.mule.api.endpoint.InboundEndpoint;
import org.mule.transport.ftp.FtpMessageRequester;

public class NonDeletingFtpMessageDispatcher extends FtpMessageRequester
{
	public NonDeletingFtpMessageDispatcher(InboundEndpoint endpoint)
	{
		super(endpoint);
	}

	 
}
