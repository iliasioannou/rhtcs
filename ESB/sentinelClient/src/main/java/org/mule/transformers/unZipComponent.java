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
public class unZipComponent implements Callable
{
	
	private static final Logger log = LoggerFactory.getLogger(unZipComponent.class);

	@Override
	public Object onCall(MuleEventContext eventContext) throws Exception
	{
		Properties sentinelProps = eventContext.getMuleContext().getRegistry().get("sentinelProps");
		ArrayList<String> extractedFilePaths = new ArrayList<String>();
		
		String zipName = eventContext.getMessage().getProperty("zipName", PropertyScope.INVOCATION);
		String tempDir = sentinelProps.getProperty("download.temp.dir");
		
		String extractionPath = "";
		
		do
		{
			UUID uuid = UUID.randomUUID();
			long l = ByteBuffer.wrap(uuid.toString().getBytes()).getLong();
			extractionPath = tempDir +Long.toString(l, Character.MAX_RADIX);	// zipName.substring(0, zipName.lastIndexOf('.'));
			
		} while ( Files.exists(Paths.get(extractionPath)) );
		
		new File(extractionPath).mkdir();
		
		
		/************ TOPPA1 ***********/
		File safeArchive = new File(extractionPath,  zipName);
		OutputStream safeOut = new FileOutputStream(safeArchive);
		log.info("Saving "+zipName+"...");
        IOUtils.copy(new BufferedInputStream( (InputStream)eventContext.getMessage().getPayload()), safeOut);
        IOUtils.closeQuietly(safeOut);
        extractedFilePaths.add(safeArchive.getPath());
		
        
        ZipInputStream zipInput = new ZipInputStream(new BufferedInputStream( new FileInputStream( new File(safeArchive.getPath()) ) ));
		/*****************************/
		
		// ZipInputStream zipInput = new ZipInputStream(new BufferedInputStream( (InputStream)eventContext.getMessage().getPayload()) );
		ZipEntry zipEntry = null;
		
		while ((zipEntry = zipInput.getNextEntry()) != null)
		{
			String zipEntryName = new File(zipEntry.getName()).getName();
			if(	
					/******** TOPPA2 *******/
					zipEntryName.equalsIgnoreCase("quick-look.png") ||  zipEntryName.toLowerCase().endsWith(".pdf") ||
					/***********************/
					zipEntryName.toLowerCase().startsWith(zipName.substring(0, 3).toLowerCase()) && (zipEntryName.toLowerCase().endsWith(".xml") || zipEntryName.toLowerCase().endsWith(".tiff")) )
			{
				File entryDestination = new File(extractionPath,  zipEntryName);
				extractedFilePaths.add(entryDestination.getPath());
		        log.info("Extracting "+zipEntry.getName()+"...");
		        if (!zipEntry.isDirectory())
		        {
	                OutputStream out = new FileOutputStream(entryDestination);            
	                IOUtils.copy(zipInput, out);
		            IOUtils.closeQuietly(out);
		        }
			}
		}
        
		IOUtils.closeQuietly(zipInput);
		log.info("Extraction completed in "+extractionPath);
		
		return extractedFilePaths;
	}
}
