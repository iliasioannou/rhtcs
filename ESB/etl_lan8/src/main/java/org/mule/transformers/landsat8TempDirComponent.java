package org.mule.transformers;

import java.io.File;
import java.nio.ByteBuffer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;
import java.util.UUID;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


// http://www.mulesoft.org/documentation/display/current/Java+Component+Reference
public class landsat8TempDirComponent implements Callable
{
	
	private static final Logger log = LoggerFactory.getLogger(landsat8TempDirComponent.class);

	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		Properties landsat8Props = eventContext.getMuleContext().getRegistry().get("landsat8Props");
		String tempDir = landsat8Props.getProperty("download.temp.dir");
		
		String extractionPath = "";
		
		do
		{
			UUID uuid = UUID.randomUUID();
			long l = ByteBuffer.wrap(uuid.toString().getBytes()).getLong();
			extractionPath = tempDir +Long.toString(l, Character.MAX_RADIX);	// zipName.substring(0, zipName.lastIndexOf('.'));
			
		} while ( Files.exists(Paths.get(extractionPath)) );
		
		new File(extractionPath).mkdir();
		
		
		return extractionPath;
	}
}
