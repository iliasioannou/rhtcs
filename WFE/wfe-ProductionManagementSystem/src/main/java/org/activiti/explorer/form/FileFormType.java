package org.activiti.explorer.form;
 
import org.activiti.engine.form.AbstractFormType;
 
// -------------------------------------------------------------------------------------------------
/**
 * Minimal implementation of a new custom form type.
 *
 * @author Sven Friedrichs, 2014
 */
// -------------------------------------------------------------------------------------------------
public class FileFormType extends AbstractFormType
{
 
  public static final String TYPE_NAME = "file";
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see org.activiti.engine.form.FormType#getName()
   */
  // -----------------------------------------------------------------------------------------------
  public String getName()
  {
    return TYPE_NAME;
  }
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see org.activiti.engine.form.AbstractFormType#convertFormValueToModelValue(java.lang.String)
   */
  // -----------------------------------------------------------------------------------------------
  @Override
  public Object convertFormValueToModelValue(String propertyValue)
  {
    return propertyValue;
  }
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see org.activiti.engine.form.AbstractFormType#convertModelValueToFormValue(java.lang.Object)
   */
  // -----------------------------------------------------------------------------------------------
  @Override
  public String convertModelValueToFormValue(Object modelValue)
  {
    return (String)modelValue;
  }
}