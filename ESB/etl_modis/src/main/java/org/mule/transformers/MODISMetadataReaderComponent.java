package org.mule.transformers;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ucar.nc2.Attribute;
import ucar.nc2.NetcdfFile;
import ucar.nc2.Variable;

public class MODISMetadataReaderComponent implements Callable
{

	private static final Logger log = LoggerFactory.getLogger(MODISMetadataReaderComponent.class);

	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		log.info("[MODISMetadataReaderComponent] Started...");

		Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");
		//String modisResultPage = eventContext.getMessage().getPayload();

		String filename = (String) eventContext.getMessage().getProperty("prodFilename", PropertyScope.INVOCATION);
		String filepath = new File(modisProps.getProperty("download.temp.dir"),filename).getPath();

		return this.readMetadata(filepath);
	}

	/**
	 * 
	 * @param filepath
	 * @return
	 * @throws IOException
	 */
	public Object readMetadata(String filepath) throws IOException
	{
		//log.info("[readMetadata] filepath= "+filepath);
		System.out.println("[readMetadata] filepath= "+filepath);
		
		NetcdfFile ncfile = null;
		try {
			ncfile = NetcdfFile.open(filepath);

			//log.info("[readMetadata] TITLE="+ncfile.getTitle());
			//log.info("[readMetadata] ID="+ncfile.getId());

			//			Variable v = ncfile.findVariable(outerSeq);
			//			assert v != null;
			//			assert v instanceof Sequence;
			//
			//
			
			System.out.println("[readMetadata] northernmost_latitude");
			
			Variable v = ncfile.getRootGroup().findVariable("northernmost_latitude");
			
			System.out.println("***"+v.toString());
			
//			List<Variable> variables = ncfile.getVariables();
//			for( Variable v : variables )
//			{
//				List<Attribute> attributes = v.getAttributes();
//				for( Attribute a : attributes )
//				{
//					System.out.println("[readMetadata] name="+a.getName());
//				}
//			}

		} catch (IOException ioe) {
			//log.error("[readMetadata] EXCEPTION: "+ioe);
			System.out.println("[readMetadata] EXCEPTION: "+ioe);
		} finally { 
			if (null != ncfile) try {
				ncfile.close();
			} catch (IOException ioe) {
				//log.error("[readMetadata] EXCEPTION: "+ioe);
				System.out.println("[readMetadata] EXCEPTION: "+ioe);
			}
		}
		return null;
	}

}
