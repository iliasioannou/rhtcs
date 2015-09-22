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

	/**
	 * Retrieves metadata from a MODIS file saved on the filesystem
	 * 
	 * @param eventContext
	 * @return metadata
	 */
	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		try {
			log.info("[MODISMetadataReaderComponent] Start ...");

			Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");

			String filename = (String) eventContext.getMessage().getProperty("prodFilename", PropertyScope.INVOCATION);

			String filepath = new File(modisProps.getProperty("download.temp.dir"),filename).getPath();

			return this.readMetadata(filepath);

		} catch (Exception e) {
			log.error("[MODISMetadataReaderComponent] EXCEPTION: "+e.getMessage());
		} finally { 
			log.info("[MODISMetadataReaderComponent] End ...");
		}
		return null;

	}

	/**
	 * Parses a NetCDF (HDF5 structure) file from file system and builds the final metadata
	 * 
	 * @param filepath
	 * @return metadata
	 * @throws IOException
	 */
	public Object readMetadata(String filepath) throws IOException
	{
		Map<String, Object> metadata = new HashMap<String, Object>();
		NetcdfFile ncfile = null;
		try {
			log.info("[readMetadata] Start ... filepath= "+filepath);

			//open file
			ncfile = NetcdfFile.open(filepath);
			//check for global attributes existence (i.e. metadata)
			List<Attribute> netcdfAttributeList = ncfile.getGlobalAttributes();
			if (netcdfAttributeList == null) {
				return null;
			}

			//Retrieve metadata
			for( Attribute attribute: netcdfAttributeList ){
				switch (this.getMetadataAttributeValue(attribute).size()) {
				case 0:
					metadata.put(attribute.getFullName(), "");
					break;
				case 1:
					metadata.put(attribute.getFullName(), this.getMetadataAttributeValue(attribute).get(0));
					break;
				default:
					metadata.put(attribute.getFullName(), this.getMetadataAttributeValue(attribute));
					break;
				}
				//log.info("[readMetadata] "+attribute.getFullName()+" : "+metadata.get(attribute.getFullName()));
			}

			//calculate footprint from metadata
			Map<String, Object> location = this.getGeoJsonLocation(ncfile);
			metadata.put("location", location);
			//log.info("[readMetadata] location : "+metadata.get("location"));

		} catch (IOException ioe) {
			log.error("[readMetadata] EXCEPTION: "+ioe.getMessage());
		} finally { 
			if (null != ncfile) try {
				ncfile.close();
			} catch (IOException ioe) {
				log.error("[readMetadata] EXCEPTION: "+ioe);
			}
			this.deleteFile(filepath);

			log.info("[readMetadata] End ... ");
		}

		return metadata;
	}

	/**
	 * Deletes the temporary downloaded MODIS product
	 * 
	 * @param filepath
	 * @return
	 */
	private boolean deleteFile(String filepath){
		boolean b = false;
		try{
			File file = new File(filepath);
			b = file.delete();
			log.info("File \""+filepath+"\"deleted: "+b);
		} catch(Exception e) {
			log.error("[readMetadata] EXCEPTION: "+e.getMessage());
		}
		return b;
	}

	/**
	 * Retrieves attribute value(s) 
	 * 
	 * @param attribute
	 * @return value
	 */
	private ArrayList<String> getMetadataAttributeValue(Attribute attribute){
		ArrayList<String> value = new ArrayList<String>();
		try {
			//System.out.println("attribute name : "+attribute.getFullName());
			Array attributeValues = attribute.getValues();
			for (int i = 0; i < attributeValues.getSize(); i++) {
				//System.out.println("("+i+") attribute value: "+attribute.getValue(i));
				value.add(attribute.getValue(i).toString());
			}
		} catch (Exception e) {
			log.error("[getMetadataAttributeValue] EXCEPTION: "+e.getMessage());
		} finally { 
			//do nothing
		}
		return value;
	}

	/**
	 * Creates a coordinate couple for a giving longitude and latitude
	 * 
	 * @param longitude
	 * @param latitude
	 * @return point
	 */
	private ArrayList<String> setPointCoordinate(String longitude, String latitude) {
		ArrayList<String> point = new ArrayList<String>();
		point.add(longitude);
		point.add(latitude);
		return point;
	}

	/**
	 * Searches for the following metadata attributes:
	 * navigation_data_gringpointlatitude, navigation_data_gringpointlongitude, start_center_longitude, start_center_latitude, end_center_longitude, end_center_latitude
	 * for footprint construction
	 * 
	 * @param ncfile
	 * @return location
	 */
	private Map<String, Object> getGeoJsonLocation(NetcdfFile ncfile){
		Map<String, Object> location = new HashMap<String, Object>();
		try {
			ArrayList<String> navigation_data_gringpointlatitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("navigation_data_gringpointlatitude"));
			ArrayList<String> navigation_data_gringpointlongitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("navigation_data_gringpointlongitude"));
			ArrayList<String> start_center_longitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("start_center_longitude"));
			ArrayList<String> start_center_latitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("start_center_latitude"));
			ArrayList<String> end_center_longitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("end_center_longitude"));
			ArrayList<String> end_center_latitude = this.getMetadataAttributeValue(ncfile.findGlobalAttribute("end_center_latitude"));

			//The type parameter indicates the type of shape that the coordinates represent. 
			location.put("type", "polygon");

			//The list of lon/lat points that describe the polygon
			ArrayList<Object> footprint = new ArrayList<Object>();
			ArrayList<Object> polygon = new ArrayList<Object>();
			polygon.add(this.setPointCoordinate(navigation_data_gringpointlongitude.get(0), navigation_data_gringpointlatitude.get(0)));
			polygon.add(this.setPointCoordinate(start_center_longitude.get(0), start_center_latitude.get(0)));
			polygon.add(this.setPointCoordinate(navigation_data_gringpointlongitude.get(1), navigation_data_gringpointlatitude.get(1)));
			polygon.add(this.setPointCoordinate(navigation_data_gringpointlongitude.get(2), navigation_data_gringpointlatitude.get(2)));
			polygon.add(this.setPointCoordinate(end_center_longitude.get(0), end_center_latitude.get(0)));
			polygon.add(this.setPointCoordinate(navigation_data_gringpointlongitude.get(3), navigation_data_gringpointlatitude.get(3)));
			polygon.add(this.setPointCoordinate(navigation_data_gringpointlongitude.get(0), navigation_data_gringpointlatitude.get(0)));
			footprint.add(polygon);
			location.put("coordinates", footprint);

		} catch (Exception e) {
			log.error("[getGeoJsonLocation] EXCEPTION: "+e.getMessage());
		} finally { 
			//do nothing
		}
		return location;
	}

}
