package it.planetek.dfc;


import static org.elasticsearch.common.xcontent.XContentFactory.jsonBuilder;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.elasticsearch.common.xcontent.XContentBuilder;
import org.geotools.data.DataStore;
import org.geotools.data.DataStoreFinder;
import org.geotools.data.FeatureSource;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.opengis.feature.Feature;
import org.opengis.feature.Property;



/**
 * {@link Service} with hard-coded input data.
 */
public class ShapefileImporterServiceImpl implements ShapefileImporterService {
	
	private JsonWriter writer;
	
	public void setWriter(JsonWriter writer) {
		this.writer = writer;
	}
	
	public void afterPropertiesSet() throws Exception {
		if (writer== null) throw new Exception();		
	}
	
	public void importFile(String measurePrefixes,String filename) {
		File file = new File(filename);

		try {
			Map connect = new HashMap();
			connect.put("url", file.toURL());

			DataStore dataStore = DataStoreFinder.getDataStore(connect);
			String[] typeNames = dataStore.getTypeNames();
			String typeName = typeNames[0];

			System.out.println("Reading content " + typeNames);

			FeatureSource featureSource = dataStore.getFeatureSource(typeName);
			FeatureCollection collection = featureSource.getFeatures();
			FeatureIterator iterator = collection.features();

			try {
				Pattern prefixes = Pattern.compile(measurePrefixes);
				int counter = 0;
				
				writer.open();
				while (iterator.hasNext()) {
					
					Feature feature = iterator.next();
					for (Property eachProperty : feature.getProperties()) {
						String propertyName = eachProperty.getName().getLocalPart();
						Matcher matcher = prefixes.matcher(propertyName);
						if(matcher.matches()) {
							XContentBuilder  builder = jsonBuilder();
							builder.startObject();
							builder.field("FEATURE_ID",feature.getIdentifier().getID());
							builder.field(matcher.group(1),Double.parseDouble((String)toPrimitiveObject(eachProperty.getValue())));
							builder.field("date",matcher.group(2));
							builder.field("CODE",feature.getProperty("CODE").getValue());
							builder.latlon("POINT",((Double)feature.getProperty("LAT").getValue()),(Double)(feature.getProperty("LON").getValue()));
							builder.field("UTM_E",((Integer)feature.getProperty("UTM_E").getValue()));
							builder.field("UTM_N",((Integer)feature.getProperty("UTM_N").getValue()));
							builder.field("UTM_ZONE",((Integer)feature.getProperty("UTM_ZONE").getValue()));
							builder.field("HEIGHT",((Double)feature.getProperty("HEIGHT").getValue()));
							builder.field("COH",((Double)feature.getProperty("COH").getValue()));
							builder.field("INC_ANG",((Double)feature.getProperty("INC_ANG").getValue()));
							builder.field("INC_ANG",((Double)feature.getProperty("INC_ANG").getValue()));
							builder.field("V_LOS_STD",((Double)feature.getProperty("V_LOS_STD").getValue()));
							builder.endObject();
							writer.write(builder);
						}
					}
				}
			} finally {
				iterator.close();
				dataStore.dispose();
//				writer.close();
			}

		} catch (Throwable e) {
			e.printStackTrace();
		}
	}
	
	private Object toPrimitiveObject(Object anObject) {
		if(anObject.getClass().isPrimitive()) 
			return anObject;
		return anObject.toString();
	}
}
