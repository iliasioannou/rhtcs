package org.mule.transformers;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.Map;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mule.transformers.MODISMetadataReaderComponent;

public class MODISMetadataReaderComponentTest {

	MODISMetadataReaderComponent modis = null;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {
		modis = new MODISMetadataReaderComponent();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public final void testReadMetadata() {
		try {
			@SuppressWarnings("unchecked")
			Map<String, Object> metadata = (Map<String, Object>) modis.readMetadata("C:\\Users\\adminpk\\Desktop\\TEMP\\MODIS_L2_LAC.nc");

			assertNotNull(metadata);
			assertTrue(metadata.size()>0);

		} catch (IOException e) {
			System.out.println("[testReadMetadata] IOException "+e.getMessage());
		}
	}

}
