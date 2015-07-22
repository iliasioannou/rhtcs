package it.planetek.dfc;

import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class ApolloCatalogQueryResult implements Serializable
{
	private String id;
	private String name;
	private Set<String> keywords;
	private String description;
	
	// Construct an ApolloCatalogQueryResult from a Map<String, Object> object
	@SuppressWarnings("unchecked")
	public ApolloCatalogQueryResult(Map<String, Object> result)
	{
		id = (String)result.get("id");
		name = (String)result.get("name");
		keywords = new HashSet<String>((Collection<String>) result.get("tags"));
		description = (String)result.get("description");
	}
	
	// title as toString()
	public String toString()
	{
		return name;
		
	}
	
	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}
	public String getName()

	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public Set<String> getKeywords()
	{
		return keywords;
	}

	public void setKeywords(Set<String> keywords)
	{
		this.keywords = keywords;
	}

	public String getDescription()
	{
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

}
