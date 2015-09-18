package org.mule.transformers;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExtractModisProductsFromHtml implements Callable
{
	private static final Logger log = LoggerFactory.getLogger(ExtractModisProductsFromHtml.class);
	
	public Object onCall(MuleEventContext eventContext) throws IOException
	{
		log.info("Started java class");
		
		Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");
		
		InputStream modisResultPage = (InputStream) eventContext.getMessage().getPayload();
		
		Document doc = Jsoup.parse(modisResultPage, "UTF-8", "http://"+modisProps.getProperty("modis.search.host"));
		
		Elements links = doc.select(modisProps.getProperty("modis.search.cssselector"));
		
		ArrayList<String> modisProductList = new ArrayList<>();
		
		for( Element link : links )
		{
			modisProductList.add(link.text()+".nc");
		}
		return modisProductList;
    }
}	