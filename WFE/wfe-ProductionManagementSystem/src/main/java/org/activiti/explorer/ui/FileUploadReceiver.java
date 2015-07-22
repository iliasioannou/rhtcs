package org.activiti.explorer.ui;
 
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;
 

import org.activiti.engine.ActivitiException;
import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.explorer.ui.form.SelectFileField;
 



import com.vaadin.data.Property.ConversionException;
import com.vaadin.data.Property.ReadOnlyException;
import com.vaadin.ui.Upload.FinishedEvent;
import com.vaadin.ui.Upload.FinishedListener;
import com.vaadin.ui.Upload.Receiver;
 
// -------------------------------------------------------------------------------------------------
/**
 * The receiver is used to process the upload data. In this case, the data is saved as a file on
 * hard disk but there are a lot more possibilities to use the outputstream of the upload. Second
 * functionality is to refresh the label of the form field with the filename of the upload.
 *
 * @author Sven Friedrichs, 2014
 */
// -------------------------------------------------------------------------------------------------
public class FileUploadReceiver implements Receiver, FinishedListener
{
 
  private static final long   serialVersionUID = 1L;
 
  // Upload directory.
  private static final String UPLOAD_DIR       = "C:/Activiti-uploads";
 
  // Filename of the upload.
  protected String            fileName;
 
  // Form field.
  protected SelectFileField   field;
  
 
  // -----------------------------------------------------------------------------------------------
  /**
   * Constructor.
   */
  // -----------------------------------------------------------------------------------------------
  public FileUploadReceiver(SelectFileField field)
  {
    this.field = field;
  }
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see com.vaadin.ui.Upload.Receiver#receiveUpload(java.lang.String, java.lang.String)
   */
  // -----------------------------------------------------------------------------------------------
  public OutputStream receiveUpload(String filename, String mimeType)
  {
    fileName = filename;
    
    // Create upload dir if not exists
    File uploadDir = new File(UPLOAD_DIR);
    
    if (!(uploadDir.exists()) || !(uploadDir.isDirectory()))
    {
    	if(!uploadDir.mkdirs())
    		throw new ActivitiException("Could not create remote upload folder.");	
    }
    
    File file = null;
    FileOutputStream fos = null;
    try
    {
      // Open the file for writing.
      file = new File(uploadDir, fileName);
      fos = new FileOutputStream(file);
    }
    catch (FileNotFoundException e)
    {
      throw new ActivitiIllegalArgumentException("Could not write to file " + UPLOAD_DIR
          + File.separator + fileName);
    }
 
    return fos;
  }
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see com.vaadin.ui.Upload.FinishedListener#uploadFinished(com.vaadin.ui.Upload.FinishedEvent)
   */
  // -----------------------------------------------------------------------------------------------
  public void uploadFinished(FinishedEvent event)
  {
	field.setValue( UPLOAD_DIR + File.separator + fileName);
    try
     {
		field.setLabel(fileName);
	}
    catch (ReadOnlyException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} catch (ConversionException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
	} 
  }
 
}