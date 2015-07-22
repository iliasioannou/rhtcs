package org.mule.transport.customftp;

import org.mule.api.MuleException;
import org.mule.api.endpoint.OutboundEndpoint;
import org.mule.api.transport.MessageDispatcher;
import org.mule.transport.ftp.FtpMessageDispatcherFactory;

public class CreatePathFtpMessageDispatcherFactory extends FtpMessageDispatcherFactory
{
	/** {@inheritDoc} */
    public MessageDispatcher create(OutboundEndpoint endpoint) throws MuleException
    {
        return new CreatePathFtpMessageDispatcher(endpoint);
    }
}