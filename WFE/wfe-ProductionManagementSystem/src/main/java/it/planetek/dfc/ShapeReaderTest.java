package it.planetek.dfc;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Serializable;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;



import org.geotools.data.Base64;
import org.geotools.data.DefaultTransaction;
import org.geotools.data.collection.ListFeatureCollection;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.shapefile.ShapefileDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.data.store.ContentFeatureCollection;
import org.geotools.data.store.ContentFeatureSource;
import org.geotools.map.FeatureLayer;
import org.geotools.map.Layer;
import org.geotools.map.MapContent;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.geotools.styling.SLD;
import org.geotools.styling.Style;
import org.geotools.swing.JMapFrame;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.geometry.BoundingBox;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.operation.TransformException;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Prompts the user for a shapefile and displays the contents on the screen in a map frame.
 * <p>
 * This is the GeoTools Quickstart application used in documentationa and tutorials. *
 */
public class ShapeReaderTest {

    /**
     * GeoTools Quickstart demo application. Prompts the user for a shapefile and displays its
     * contents on the screen in a map frame
     * @throws FactoryException 
     * @throws TransformException 
     * @throws NoSuchAuthorityCodeException 
     */
    public static void main(String[] args) throws NoSuchAuthorityCodeException, TransformException, FactoryException
    {
    	File uploadedF = new File("E:\\WR_italia_v2\\WR_italia_v2.shp");
		
        ShapefileDataStore dataStore;
		try
		{
			dataStore = new ShapefileDataStore(uploadedF.toURI().toURL());
			ContentFeatureSource featureSource = dataStore.getFeatureSource();
			ContentFeatureCollection featureCollection = featureSource.getFeatures();
			
			//System.out.println("SRS: " + featureCollection.getSchema().getCoordinateReferenceSystem());
			
			SimpleFeatureIterator featuresItearator = featureCollection.features();
			try
			{
			   while( featuresItearator.hasNext() )
			   {
				   SimpleFeature feature = featuresItearator.next();
				   BoundingBox featureBounds = feature.getBounds().toBounds(DefaultGeographicCRS.WGS84);
				   //System.out.println(feature.getID() + ": " + featureBounds);
				   //System.out.println("    BBOX: " + featureBounds.getMinX() +", "+ featureBounds.getMinY() +", "+ featureBounds.getMaxX() +", "+ featureBounds.getMaxY());
				   
				   
				   //storeFeatureToShapefile(feature);
				   
				  // &classes=com.erdas.rsp.babel.model.GenericItem, com.erdas.rsp.babel.model.imagery.ImageReference, com.erdas.rsp.babel.model.vector.VectorReference, com.erdas.rsp.babel.model.pointcloud.PointCloudResource 
				   String urlString = "http://morgana.planetek.it/erdas-apollo/content/catalog/items.json?q="+URLEncoder.encode("intersect:BBOX("+featureBounds.getMinX()+" "+ featureBounds.getMinY() +","+ featureBounds.getMaxX() +" "+ featureBounds.getMaxY()+")", "UTF-8")+"&classes=com.erdas.rsp.babel.model.GenericItem,com.erdas.rsp.babel.model.imagery.ImageReference,com.erdas.rsp.babel.model.vector.VectorReference,com.erdas.rsp.babel.model.pointcloud.PointCloudResource&keywords=ftp&maxresults=100";
				   System.out.println("UrlString: "+urlString);
						   
					URL url = new URL(urlString);
					HttpURLConnection con = (HttpURLConnection) url.openConnection();
			 
					// optional default is GET
					con.setRequestMethod("GET");
					String encoded = Base64.encodeBytes("admin:apollo123".getBytes());
					con.setRequestProperty("Authorization", "Basic "+encoded);
			 
					int responseCode = con.getResponseCode();
					//System.out.println("\nSending 'GET' request to URL : " + url);
					//System.out.println("Response Code : " + responseCode);
			 
					BufferedReader in = new BufferedReader( new InputStreamReader(con.getInputStream()) );
					String inputLine;
					StringBuffer response = new StringBuffer();
			 
					while ((inputLine = in.readLine()) != null)
					{
						response.append(inputLine);
					}
					in.close();
			 
					//print result
					//System.out.println(response.toString());
				   
					ObjectMapper mapper = new ObjectMapper();
					
					HashMap jsonRespMap = mapper.readValue(response.toString(), HashMap.class);
					ArrayList resultsList = ((ArrayList) jsonRespMap.get("results"));
					//ArrayList 
					System.out.println( "\n------------------|||||||||||||||----------------\n" );
					System.out.println( "\n---------------------------------------------\n" );
					for(Object o : resultsList)
					{
						System.out.println( ((HashMap)o).get("id") );
						System.out.println( ((HashMap)o).get("name") );
						System.out.println( ((HashMap)o).get("title") );
						System.out.println( ((HashMap)o).get("tags") );
						System.out.println( (String)((HashMap)o).get("description") );
						System.out.println( "\n---------------------------------------------\n" );
					}
					
			   }
			}
			finally
			{
				 featuresItearator.close();
			}
			
			
			
			
		    
			
			
			
	        
	        // Create a map content and add our shapefile to it
	        MapContent map = new MapContent();
	        map.setTitle(featureSource.getName() + ": " + featureCollection.size() + " features found");
	        
	        Style style = SLD.createSimpleStyle(featureSource.getSchema());
	        Layer layer = new FeatureLayer(featureSource, style);
	        map.addLayer(layer);

	        // Now display the map
	        JMapFrame.showMap(map);
	        
	        
		}
		catch (MalformedURLException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
    }

	private static void storeFeatureToShapefile(SimpleFeature feature) throws IOException
	{
		List<SimpleFeature> features = new ArrayList<SimpleFeature>();
		features.add(feature);
		
		/*
         * Get an output file name and create the new shapefile
         */
        File newFile = new File("E:\\"+feature.getID()+".shp");

        ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();

        Map<String, Serializable> params = new HashMap<String, Serializable>();
        params.put("url", newFile.toURI().toURL());
        params.put("create spatial index", Boolean.TRUE);

        ShapefileDataStore newDataStore = (ShapefileDataStore) dataStoreFactory.createNewDataStore(params);

        /*
         * TYPE is used as a template to describe the file contents
         */
        
        newDataStore.createSchema(feature.getType());
        
        
        
        /*
         * Write the features to the shapefile
         */
        DefaultTransaction transaction = new DefaultTransaction("create");

        String typeName = newDataStore.getTypeNames()[0];
        SimpleFeatureSource featureSource = newDataStore.getFeatureSource(typeName);
        SimpleFeatureType SHAPE_TYPE = featureSource.getSchema();
        /*
         * The Shapefile format has a couple limitations:
         * - "the_geom" is always first, and used for the geometry attribute name
         * - "the_geom" must be of type Point, MultiPoint, MuiltiLineString, MultiPolygon
         * - Attribute names are limited in length 
         * - Not all data types are supported (example Timestamp represented as Date)
         * 
         * Each data store has different limitations so check the resulting SimpleFeatureType.
         */
        System.out.println("SHAPE:"+SHAPE_TYPE);

        if (featureSource instanceof SimpleFeatureStore)
        {
            SimpleFeatureStore featureStore = (SimpleFeatureStore) featureSource;
            /*
             * SimpleFeatureStore has a method to add features from a
             * SimpleFeatureCollection object, so we use the ListFeatureCollection
             * class to wrap our list of features.
             */
            SimpleFeatureCollection collection = new ListFeatureCollection(feature.getType(), features);
            featureStore.setTransaction(transaction);
            try
            {
                featureStore.addFeatures(collection);
                transaction.commit();
            }
            catch (Exception problem) {
                problem.printStackTrace();
                transaction.rollback();
            }
            finally {
                transaction.close();
            }
        }
        else {
            System.out.println(typeName + " does not support read/write access");
        }
		
	}

}