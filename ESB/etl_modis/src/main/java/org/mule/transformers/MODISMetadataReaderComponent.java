package org.mule.transformers;

import java.io.IOException;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ucar.nc2.NetcdfFile;

public class MODISMetadataReaderComponent implements Callable
{

	private static final Logger log = LoggerFactory.getLogger(MODISMetadataReaderComponent.class);

	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		log.info("[MODISMetadataReaderComponent] Started...");

		//Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");
		//String modisResultPage = eventContext.getMessage().getPayload();

		String filename = (String) eventContext.getMessage().getProperty("prodFilename", PropertyScope.INVOCATION);
		NetcdfFile ncfile = null;
		try {
			ncfile = NetcdfFile.open(filename);
			
			log.info("[MODISMetadataReaderComponent] TITLE="+ncfile.getTitle());
			log.info("[MODISMetadataReaderComponent] ID="+ncfile.getId());


		} catch (IOException ioe) {
			//
		} finally { 
			if (null != ncfile) try {
				ncfile.close();
			} catch (IOException ioe) {
				//
			}
		}
		return null;
	}
}
