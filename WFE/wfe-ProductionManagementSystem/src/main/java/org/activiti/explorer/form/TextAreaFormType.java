package org.activiti.explorer.form;
 
import org.activiti.engine.form.AbstractFormType;
 
// -------------------------------------------------------------------------------------------------
/**
 * Minimal implementation of a new custom form type.
 *
 * @author Sven Friedrichs, 2014
 */
// -------------------------------------------------------------------------------------------------
public class TextAreaFormType extends AbstractFormType
{
 
  public static final String TYPE_NAME = "textarea";

  public String getName()
  {
    return TYPE_NAME;
  }
 
  @Override
  public Object convertFormValueToModelValue(String propertyValue)
  {
	  return propertyValue;
  }
 
  @Override
  public String convertModelValueToFormValue(Object modelValue)
  {
	  String textcontent = "";
	  if(modelValue != null)
		  textcontent = modelValue.toString();
	  return textcontent;
  }
}