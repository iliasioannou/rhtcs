package org.mule.transformers;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import ucar.ma2.Array;
import ucar.nc2.Attribute;
import ucar.nc2.NetcdfFile;

public class MODISMetadataReaderComponent implements Callable
{

	private static final Logger log = LoggerFactory.getLogger(MODISMetadataReaderComponent.class);
	
	private static final Map<String, String> metadata = new HashMap<String, String>();

	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		log.info("[MODISMetadataReaderComponent] Started...");

		Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");

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
		log.info("[readMetadata] filepath= "+filepath);

		NetcdfFile ncfile = null;
		try {
			ncfile = NetcdfFile.open(filepath);

			List<Attribute> netcdfAttributeList = ncfile.getGlobalAttributes();
			if (netcdfAttributeList == null) {
				return null;
			}

			
			
			for( Attribute attribute: netcdfAttributeList ){
				//System.out.println("[readMetadata] attribute name : "+attribute.getFullName());
				//System.out.println("[readMetadata] attribute type : "+attribute.getDataType());
				//System.out.println("[readMetadata] attribute Length : "+attribute.getLength());
				switch (attribute.getDataType()) {
				case FLOAT:
				case INT:
				case DOUBLE:
				case SHORT:
				case LONG:
					Array attributeValues = attribute.getValues();
					ArrayList<String> s = new ArrayList<String>();
					for (int i = 0; i < attributeValues.getSize(); i++) {
						System.out.println("[readMetadata] value: "+attribute.getValue(i));
						s.add(i, attribute.getValue(i).toString());
					}
					metadata.put(attribute.getFullName(), s.toString());
					break;

				case CHAR:
				case STRING:
					//System.out.println("[readMetadata] value: "+attribute.getStringValue());
					metadata.put(attribute.getFullName(), attribute.getStringValue());
					break;

				default:
					//System.out.println("[readMetadata] attribute type : "+attribute.getDataType());
					//System.out.println("[readMetadata] value: ...");
					break;
				}
				
				System.out.println("[readMetadata] "+attribute.getFullName()+" : "+metadata.get(attribute.getFullName()));

			}

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
