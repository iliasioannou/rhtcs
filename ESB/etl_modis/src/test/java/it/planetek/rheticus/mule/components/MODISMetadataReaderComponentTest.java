package it.planetek.rheticus.mule.components;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class MODISMetadataReaderComponentTest {

	private MODISMetadataReaderComponent modis = null;
	private File srcFile = new File("src/test/resources/product/MODIS_L2_LAC.nc");
	private File destFile = new File("src/test/resources/MODIS_L2_LAC.nc");


	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		modis = new MODISMetadataReaderComponent();

		FileUtils.copyFile(srcFile, destFile);
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public final void testReadMetadata() {
		try {
			System.out.println("[testReadMetadata] Start ...\n");
			
			@SuppressWarnings("unchecked")
			Map<String, Object> metadata = (Map<String, Object>) modis.readMetadata(destFile.getPath());

			assertNotNull(metadata);
			System.out.println("Metadata is VALID!\n");	

			assertTrue(metadata.size()>0);
			System.out.println("Metadata size: "+metadata.size()+"\n");

			for (Map.Entry<String, Object> entry : metadata.entrySet()) {
				System.out.println("KEY  : \""+entry.getKey()+"\"");
				System.out.println("VALUE: \""+entry.getValue().toString()+"\"\n");
			}

		} catch (IOException e) {
			System.out.println("[testReadMetadata] IOException "+e.getMessage());
		} finally {
			System.out.println("[testReadMetadata] End ...");
		}
	}

}
