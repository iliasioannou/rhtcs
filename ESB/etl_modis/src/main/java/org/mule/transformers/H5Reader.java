package org.mule.transformers;

import org.gdal.gdal.Dataset;
import org.gdal.gdal.gdal;
import org.gdal.gdalconst.gdalconst;

public class H5Reader
{
	
    public String getMetadata()
    {
    	Dataset ncDataset = gdal.Open( "C:\\test.nc", gdalconst.GA_ReadOnly );
        
    	return ncDataset.GetMetadata_List().toString();
        
    }
}
