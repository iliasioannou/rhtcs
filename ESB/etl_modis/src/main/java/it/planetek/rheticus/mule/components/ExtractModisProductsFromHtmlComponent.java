package it.planetek.rheticus.mule.components;

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

public class ExtractModisProductsFromHtmlComponent implements Callable
{
	private static final Logger log = LoggerFactory.getLogger(ExtractModisProductsFromHtmlComponent.class);

	/**
	 * Parsers an HTML document retrieving a list of MODIS products that fulfills the previous search  
	 * 
	 * @param eventContext
	 * @return modisProductList
	 */
	public Object onCall(MuleEventContext eventContext) throws IOException {

		try {
			log.info("[ExtractModisProductsFromHtmlComponent] Start ...");

			Properties modisProps = eventContext.getMuleContext().getRegistry().get("modisProps");

			InputStream modisResultPage = (InputStream) eventContext.getMessage().getPayload();

			Document doc = Jsoup.parse(modisResultPage, "UTF-8", "http://"+modisProps.getProperty("modis.search.host"));

			Elements links = doc.select(modisProps.getProperty("modis.search.cssselector"));

			ArrayList<String> modisProductList = new ArrayList<String>();

			for( Element link : links ) {
				if (!link.text().isEmpty()) {
					String productName = link.text();
					modisProductList.add(productName.toLowerCase().endsWith(".nc") ? productName : productName+".nc");
				}
			}
			return modisProductList;

		} catch (Exception e) {
			log.error("[ExtractModisProductsFromHtmlComponent] EXCEPTION: "+e.getMessage());
		} finally { 
			log.info("[ExtractModisProductsFromHtmlComponent] End ...");
		}
		return null;
	}

}	