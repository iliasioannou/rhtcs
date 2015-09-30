package org.mule.transformers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.planetek.dfc.ShapefileImporterService;

public class ShapefileImporterComponent implements Callable
{
	protected static final Logger log = LoggerFactory.getLogger(ShapefileImporterComponent.class);
	
	static private String[] shapeExts;

	/**
	 * Extract Shapefile data
	 * 
	 * @param eventContext
	 * @return modisProductList
	 */
	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		String shapefileDir = eventContext.getMessage().getProperty("directory", PropertyScope.INBOUND);
		String shapefileName = eventContext.getMessage().getProperty("originalFilename", PropertyScope.INBOUND);
		String shapefileOutdir = eventContext.getMessage().getProperty("moveToDirectory", PropertyScope.INVOCATION);
		
		String shapefileNameNoExt = shapefileName.substring(0, shapefileName.lastIndexOf("."));
		shapeExts = new String[] {".shp",".shx", ".prj"};
		
		// move files
		for(String ext : shapeExts)
		{
			Files.move( Paths.get(shapefileDir, shapefileNameNoExt+ext), Paths.get(shapefileOutdir, shapefileNameNoExt+ext), StandardCopyOption.REPLACE_EXISTING);
		}
		
		ShapefileImporterService importer = eventContext.getMuleContext().getRegistry().lookupObject("importer");
		
		
		log.info("name: "+shapefileName);
		log.info("dir: "+shapefileDir);
		String shapefilePath = Paths.get(shapefileOutdir, shapefileNameNoExt+".shp").toString();
		log.info("shapefilePath: "+shapefilePath);
		importer.importFile("^(DL)([0-9]{8})$",shapefilePath);
		
		/*
		log.info("Deleting shape...");
		
		for(String ext : shapeExts)
		{
			Files.delete(Paths.get(shapefileOutdir, shapefileNameNoExt+ext));
		}
		log.info("Deleted");
		*/
		return null;
	}

}	