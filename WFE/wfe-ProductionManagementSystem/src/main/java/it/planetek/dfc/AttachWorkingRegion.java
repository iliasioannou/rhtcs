package it.planetek.dfc;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;
import org.apache.commons.io.IOUtils;
import org.geotools.data.Base64;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.store.ContentFeatureCollection;
import org.geotools.data.store.ContentFeatureSource;
import org.geotools.referencing.crs.DefaultGeographicCRS;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.geometry.BoundingBox;
import com.fasterxml.jackson.databind.ObjectMapper;

public class AttachWorkingRegion implements JavaDelegate
{
	private static String apolloCatalogUrl = "http://morgana.planetek.it/erdas-apollo/content/catalog/any.json?q=";
	private static String apolloUsr = "admin";
	private static String apolloPwd = "apollo123";
	
	@Override
	public void execute(DelegateExecution execution) throws Exception
	{
		// Open current WR shapefile path
		String wrShapePath = (String) execution.getVariable("wrShape");
		
		// Extract DBF attributes ("Nome" and "Area") and BoundingBox of the WR Shape
		String wrName;
		Double wrArea;
		Double[] wrBounds;
		File wrShapeF = new File(wrShapePath);
		ShapefileDataStore dataStore = new ShapefileDataStore(wrShapeF.toURI().toURL());
		ContentFeatureSource featureSource = dataStore.getFeatureSource();
		ContentFeatureCollection featureCollection = featureSource.getFeatures();
		
		SimpleFeatureIterator featuresItearator = featureCollection.features();
		try
		{
		   SimpleFeature feature = featuresItearator.next();
	
		   wrName = (String)feature.getAttribute("Nome");
		   wrArea = (Double)feature.getAttribute("Area");
		   
		   // get BBOX in wgs84 crs
		   BoundingBox featureBounds = feature.getBounds().toBounds(DefaultGeographicCRS.WGS84);
		   wrBounds = new Double[]{featureBounds.getMinX(), featureBounds.getMinY(), featureBounds.getMaxX(), featureBounds.getMaxY()};
		}
		finally
		{
			 featuresItearator.close();
			 dataStore.dispose();
		}
		
		// QUery apollo catalog on the WR extent
		Collection<ApolloCatalogQueryResult> wrDataList = queryApolloCatalog(wrBounds);
		
		// Set WR Name and Area as execution variables
		execution.setVariable("wrName", wrName);
		execution.setVariable("wrArea", wrArea);
		execution.setVariable("wrBounds", wrBounds);
		execution.setVariable("wrDataList", wrDataList);
		
		// Attach the current WR Shape to the process instance
		FileInputStream fis = new FileInputStream( zipShapefile(wrShapePath) );
		TaskService taskService = execution.getEngineServices().getTaskService();
		taskService.createAttachment("zip", null, execution.getProcessInstanceId(), wrName+".zip", "Zipped shapefile of "+wrName+".\nArea: "+wrArea+" km2", fis);
	}
	
	
	@SuppressWarnings("unchecked")
	protected List<ApolloCatalogQueryResult> queryApolloCatalog(Double[] bbox) throws IOException
	{
		String urlString = apolloCatalogUrl + URLEncoder.encode("intersect:BBOX("+bbox[0]+" "+ bbox[1] +","+ bbox[2] +" "+ bbox[3]+")", "UTF-8")+"&classes=com.erdas.rsp.babel.model.GenericItem,com.erdas.rsp.babel.model.imagery.ImageReference,com.erdas.rsp.babel.model.vector.VectorReference,com.erdas.rsp.babel.model.pointcloud.PointCloudResource&keywords=ftp&maxresults=100";
		URL url = new URL(urlString);
		HttpURLConnection con = (HttpURLConnection) url.openConnection();
		
		con.setRequestMethod("GET");
		String encoded = Base64.encodeBytes((apolloUsr+":"+apolloPwd).getBytes());
		con.setRequestProperty("Authorization", "Basic "+encoded);
 
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
 
		BufferedReader in = new BufferedReader( new InputStreamReader(con.getInputStream()) );
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null)
		{
			response.append(inputLine);
		}
		in.close();
		
		// Parse Apollo json response
		ObjectMapper mapper = new ObjectMapper();
		Map<String,Object> jsonRespMap = mapper.readValue(response.toString(), Map.class);
		
		List<ApolloCatalogQueryResult> wrDataList = new ArrayList<>();
		for(Object o : ((ArrayList<Object>) jsonRespMap.get("results")))
		{
			wrDataList.add( new ApolloCatalogQueryResult((Map<String, Object>) o) );
		}
		
		// return viewable query result list
		return wrDataList;
	}
	
	protected String zipShapefile(String shapePath) throws IOException, FileNotFoundException
	{
		File shape = new File(shapePath);
		String shapeDir = shape.getParent();
		String shapeName = shape.getName().substring(0, shape.getName().lastIndexOf('.'));
		
		String zipPath = shapeDir + File.separator + shapeName + ".zip";
		
		final String[] shapeExts = {".shp", ".dbf", ".prj", ".shx"};
		
		ZipOutputStream zipFile = new ZipOutputStream(new FileOutputStream( zipPath ));
		try
		{	
		    for(String ext : shapeExts)
			{
				File file = new File(shapeDir + File.separator + shapeName + ext);
		    	
			    ZipEntry entry = new ZipEntry(shapeName + ext);
			    zipFile.putNextEntry(entry);
	
		        FileInputStream in = new FileInputStream(file);
		        IOUtils.copy(in, zipFile);
		        IOUtils.closeQuietly(in);
		        
		        file.delete();
			}
		}
		finally
		{
			IOUtils.closeQuietly(zipFile);
		}
		return zipPath;
	}
	
}
