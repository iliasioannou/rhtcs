package org.mule.transformers;

import java.io.File;
import java.io.IOException;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import it.planetek.dfc.ShapefileImporterService;

public class ShapefileImporterComponent implements Callable
{
	private static final Logger log = LoggerFactory.getLogger(ShapefileImporterComponent.class);

	/**
	 * Extract Shapefile data
	 * 
	 * @param eventContext
	 * @return modisProductList
	 */
	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		ShapefileImporterService importer = eventContext.getMuleContext().getRegistry().lookupObject("importer");
		String shapefileDir = eventContext.getMessage().getProperty("directory", PropertyScope.INVOCATION);
		String shapefileName = eventContext.getMessage().getProperty("originalFilename", PropertyScope.INVOCATION);
		String shapefilePath = new File(shapefileDir, shapefileName).getPath();
		
		importer.importFile("^(DL)([0-9]{8})$",shapefilePath);
		
		return null;
	}

}	