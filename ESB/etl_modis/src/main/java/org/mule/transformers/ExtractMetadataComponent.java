package org.mule.transformers;

import java.io.File;
import java.io.InputStream;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.gdal.gdal.Dataset;
import org.gdal.gdal.gdal;
import org.gdal.gdalconst.gdalconst;

public class ExtractMetadataComponent implements Callable
{
	private static final Logger log = LoggerFactory.getLogger(ExtractMetadataComponent.class);
	
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		log.info("Started java class");
		Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");
		
		String ncFilename = eventContext.getMessage().getProperty("ncFilename", PropertyScope.INVOCATION);
		String tempDir = modisProps.getProperty("download.temp.dir");
		
		log.info("Before gdal Open: "+new File(tempDir, ncFilename).getPath());
		
		Dataset ncDataset = gdal.Open( new File(tempDir, ncFilename).getPath(), gdalconst.GA_ReadOnly );
		
		log.info("Before dataset list");
		
        return ncDataset.GetMetadata_List();
    }
}	