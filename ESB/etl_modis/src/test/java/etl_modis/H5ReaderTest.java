package etl_modis;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.mule.transformers.H5Reader;

public class H5ReaderTest {
	
	H5Reader h5r;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception
	{
		h5r = new H5Reader();
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void test()
	{
		assertNull(h5r.getMetadata());
	}

}
