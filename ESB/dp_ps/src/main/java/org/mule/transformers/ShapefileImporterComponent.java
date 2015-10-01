package org.mule.transformers;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.planetek.dfc.ShapefileImporterService;

public class ShapefileImporterComponent implements Callable
{
	protected static final Logger log = LoggerFactory.getLogger(ShapefileImporterComponent.class);
	
	/**
	 *  private Class implementing FilenameFilter for files with same name but different extension (shapefile.*)
	 *
	 */
	private class ShapeFilenameFilter implements FilenameFilter
	{
		private String filenameWithNoExt;
		
		public ShapeFilenameFilter(String filenameWithNoExt)
		{
			this.filenameWithNoExt = filenameWithNoExt;
		}
		
		@Override
		public boolean accept(File dir, String name)
		{
			return name.startsWith(this.filenameWithNoExt);
		}
	};
	
	
	/**
	 * Extract Shapefile PS data and save to ElasticSearch
	 * 
	 * @param eventContext
	 * @return shapefileNameNoExt
	 */
	public String onCall(MuleEventContext eventContext)
	{
		// Get dp_ps properties
		Properties psProps = eventContext.getMuleContext().getRegistry().get("psProps");
		
		// Get detected shape filename
		String shapefileName = eventContext.getMessage().getProperty("originalFilename", PropertyScope.INBOUND);
		String shapefileNameNoExt = shapefileName.substring(0, shapefileName.lastIndexOf("."));
		
		String shapefileTransferDir = psProps.getProperty("ps.transfer.dir");
		String shapefileMoveToDir =  psProps.getProperty("ps.moveto.dir");
		
		log.info("New shapefile detected: "+shapefileNameNoExt+" in "+shapefileTransferDir);
		
		// Get filelist of files with the same name as the ".dbf" file, but different extension (.shx, .shp, .prj, ...)
		File[] shapefileFiles = new File(shapefileTransferDir).listFiles(new ShapeFilenameFilter(shapefileNameNoExt));

		// Move newly arrived shape file(S) to elaboration dir
		if (!Files.exists(Paths.get(shapefileMoveToDir)))
		{
			try
			{
				// TODO: check if Files.createTempDirectory(dir, prefix, attrs) could be used to create a temp elaboration dir
				Files.createDirectories(Paths.get(shapefileMoveToDir));
			}
			catch (IOException e)
			{
				log.error("Cannot create elaboration dir: "+shapefileMoveToDir);
			}
		}
		for(File file: shapefileFiles)
		{
			try
			{
				Files.move( Paths.get(file.getPath()), Paths.get(shapefileMoveToDir, file.getName()), StandardCopyOption.REPLACE_EXISTING);
			}
			catch (IOException e)
			{
				log.error("Failed to move "+file.getName()+" to elaboration dir "+shapefileMoveToDir);
			}
		}
		log.info("Moved "+shapefileNameNoExt+".* to elaboration dir "+shapefileMoveToDir);
		
		
		// Load Shapefile ps data into ElasticSearch
		ShapefileImporterService importer = eventContext.getMuleContext().getRegistry().lookupObject("importer");
		// TODO: check if the regex is correctly escaped in the property file
		//importer.importFile("^(DL)([0-9]{8})$", Paths.get(shapefileMoveToDir, shapefileNameNoExt+".shp").toString());
		importer.importFile( psProps.getProperty("ps.measures.prefix"), Paths.get(shapefileMoveToDir, shapefileNameNoExt+".shp").toString());
		
		/*
		 * TODO: is importFile() async? If so, how can we delete shp files, *ONLY* when importFile has finished?
		 * 
		log.info("Deleting shape...");
		
		for(String ext : shapeExts)
		{
			Files.delete(Paths.get(shapefileOutdir, shapefileNameNoExt+ext));
		}
		log.info("Deleted");
		*/
		return shapefileNameNoExt;
	}

}	