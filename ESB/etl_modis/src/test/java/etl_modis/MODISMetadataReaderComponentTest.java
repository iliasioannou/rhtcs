package etl_modis;

import static org.junit.Assert.*;

import java.io.IOException;

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
	public final void testOnCall() {
		try {
			assertNull(modis.readMetadata("C:\\Users\\adminpk\\Desktop\\TEMP\\a.nc"));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
