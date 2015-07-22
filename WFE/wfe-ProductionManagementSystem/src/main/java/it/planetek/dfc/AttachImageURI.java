package it.planetek.dfc;

import java.util.Iterator;
import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.JavaDelegate;

public class AttachImageURI implements JavaDelegate
{ 
	@Override
	public void execute(DelegateExecution execution) throws Exception
	{
		ApolloCatalogQueryResult catalogItem =  (ApolloCatalogQueryResult) execution.getVariable("selectedData");
		
		execution.setVariable("selectedDataName", catalogItem.toString());
		
		TaskService taskService = execution.getEngineServices().getTaskService();
		
		// Find th FTP url among the item keywords
		Iterator<String> kwIterator = catalogItem.getKeywords().iterator();
		Boolean ftpUrlfound = false;
		while(!ftpUrlfound && kwIterator.hasNext())
		{
			String keyword = kwIterator.next();
			if(ftpUrlfound = keyword.toLowerCase().startsWith("ftp:"))
				// Attach the FTP url to the process instance
				taskService.createAttachment("ftp", null, execution.getProcessInstanceId(), catalogItem.getName(), catalogItem.getDescription(), keyword);
		}
	}
}
