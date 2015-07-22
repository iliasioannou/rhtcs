package it.planetek.dfc;


import java.io.File;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;
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
import org.opengis.feature.simple.SimpleFeature;

public class ExtractWorkingRegions implements JavaDelegate
{
	@Override
	public void execute(DelegateExecution execution) throws Exception
	{
		// Open the uploaded WA (Working Area) shapefile
		File uploadedF = new File((String) execution.getVariable("waShape"));
		
		ShapefileDataStore dataStore;
		dataStore = new ShapefileDataStore(uploadedF.toURI().toURL());
		ContentFeatureSource featureSource = dataStore.getFeatureSource();
		ContentFeatureCollection featureCollection = featureSource.getFeatures();
		
		
		ArrayList<String> wrShpPathList = new ArrayList<>();
		SimpleFeatureIterator featuresItearator = featureCollection.features();
		try
		{
		   while( featuresItearator.hasNext() )
		   {
			   SimpleFeature feature = featuresItearator.next();
			   System.out.println(feature.getID() + ": " + feature.getBounds());
			   
			   String wrShpPath = uploadedF.getParent() + File.separator + feature.getID() + ".shp";
			   
			   // Save the WR shapefile to file
			   storeFeatureToShapefile(feature, wrShpPath);
			   wrShpPathList.add(wrShpPath);
		   }
		}
		finally
		{
			 featuresItearator.close();
			 dataStore.dispose();				// memory leak!
		}
		
		execution.setVariable("wrList", wrShpPathList);
	}
	
	
	private void storeFeatureToShapefile(SimpleFeature feature, String shapefilePath) throws Exception
	{
		File newFile = new File(shapefilePath);
		
		// Create feature collection to store into the shapefile
		List<SimpleFeature> features = new ArrayList<SimpleFeature>();
		features.add(feature);
		SimpleFeatureCollection collection = new ListFeatureCollection(feature.getType(), features);
        
		 ShapefileDataStoreFactory dataStoreFactory = new ShapefileDataStoreFactory();

        Map<String, Serializable> params = new HashMap<String, Serializable>();
        params.put("url", newFile.toURI().toURL());
        params.put("create spatial index", Boolean.TRUE);

        ShapefileDataStore newDataStore = (ShapefileDataStore) dataStoreFactory.createNewDataStore(params);

        newDataStore.createSchema(feature.getType());
        
        
        
        /*
         * Write the features to the shapefile
         */
        DefaultTransaction transaction = new DefaultTransaction("create");

        String typeName = newDataStore.getTypeNames()[0];
        SimpleFeatureSource featureSource = newDataStore.getFeatureSource(typeName);
        /*
         * The Shapefile format has a couple limitations:
         * - "the_geom" is always first, and used for the geometry attribute name
         * - "the_geom" must be of type Point, MultiPoint, MuiltiLineString, MultiPolygon
         * - Attribute names are limited in length 
         * - Not all data types are supported (example Timestamp represented as Date)
         * 
         * Each data store has different limitations so check the resulting SimpleFeatureType.
         */
        if (featureSource instanceof SimpleFeatureStore)
        {
            SimpleFeatureStore featureStore = (SimpleFeatureStore) featureSource;
            /*
             * SimpleFeatureStore has a method to add features from a
             * SimpleFeatureCollection object, so we use the ListFeatureCollection
             * class to wrap our list of features.
             */
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
        else
        {
            throw new Exception( typeName + " does not support read/write access");
        }
		
	}
 
}