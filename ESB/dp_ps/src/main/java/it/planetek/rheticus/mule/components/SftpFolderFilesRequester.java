package it.planetek.rheticus.mule.components;


import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.mule.DefaultMessageCollection;
import org.mule.api.MuleContext;
import org.mule.api.MuleEventContext;
import org.mule.api.MuleMessageCollection;
import org.mule.api.endpoint.EndpointBuilder;
import org.mule.api.endpoint.InboundEndpoint;
import org.mule.api.lifecycle.Callable;
import org.mule.routing.MessageFilter;
import org.mule.transport.file.filters.FilenameWildcardFilter;
import org.mule.transport.sftp.SftpClient;
import org.mule.transport.sftp.SftpConnector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SftpFolderFilesRequester implements Callable
{
	
	private static final Logger log = LoggerFactory.getLogger(SftpFolderFilesRequester.class);
	private static final long reqTimeout = 30000L;

	@Override
	public Object onCall(final MuleEventContext eventContext) throws Exception
	{
			final MuleContext muleCtx = eventContext.getMuleContext();
			final Properties psProps = muleCtx.getRegistry().get("psProps");
			
			
			SftpConnector sftpConnector = new SftpConnector(muleCtx);
			sftpConnector.setAutoDelete(false);
			
			String sftpHost = StringUtils.trimToEmpty(psProps.getProperty("ps.sftp.host"));
			String sftpPort = StringUtils.trimToEmpty(psProps.getProperty("ps.sftp.port"));
			String sftpUsr = StringUtils.trimToEmpty(psProps.getProperty("ps.sftp.usr"));
			String sftpPwd = StringUtils.trimToEmpty(psProps.getProperty("ps.sftp.pwd"));
			String sftpBasepath = StringUtils.trimToEmpty(psProps.getProperty("ps.sftp.basepath"));
			
			String outputFolder = eventContext.getMessage().getInvocationProperty("outputFolder");
			
			EndpointBuilder sftpEndpointBuilder = muleCtx.getEndpointFactory().getEndpointBuilder("sftp://"+sftpUsr+":"+sftpPwd+"@"+sftpHost+":"+sftpPort+sftpBasepath+outputFolder);
			FilenameWildcardFilter filenameWildcardFilter = new FilenameWildcardFilter();
			sftpEndpointBuilder.addMessageProcessor(new MessageFilter(filenameWildcardFilter));
			
			InboundEndpoint sftpEndpoint = sftpEndpointBuilder.buildInboundEndpoint();
			
			
			MuleMessageCollection resultCollection = new DefaultMessageCollection(muleCtx);
			
			SftpClient sftpClient = sftpConnector.createSftpClient(sftpEndpoint);
			for(String filename : sftpClient.listFiles())
			{
				log.debug("Requesting file: "+filename);
				filenameWildcardFilter.setPattern(filename);
				resultCollection.addMessage(sftpEndpoint.request(reqTimeout));
			}
			
			return resultCollection;
	}
}
