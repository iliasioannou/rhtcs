package org.mule.transformers;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Properties;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.apache.commons.io.IOUtils;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


// http://www.mulesoft.org/documentation/display/current/Java+Component+Reference
public class landsat8DownloadComponent implements Callable
{
	
	private static final Logger log = LoggerFactory.getLogger(landsat8DownloadComponent.class);

	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		String fileName = eventContext.getMessage().getProperty("fileName", PropertyScope.INVOCATION);
		String tempDirPath = eventContext.getMessage().getProperty("tempDirPath", PropertyScope.INVOCATION);
		
		File dlFile = new File(tempDirPath,  fileName);
		OutputStream dlFileOut = new FileOutputStream(dlFile);
		log.info("Saving "+fileName+"...");
        IOUtils.copy(new BufferedInputStream( (InputStream)eventContext.getMessage().getPayload()), dlFileOut);
        IOUtils.closeQuietly(dlFileOut);
		
        return dlFile.getPath();
	}
}
