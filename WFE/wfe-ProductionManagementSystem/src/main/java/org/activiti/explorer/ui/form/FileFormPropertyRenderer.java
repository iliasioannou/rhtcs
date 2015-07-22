package org.activiti.explorer.ui.form;
 
import org.activiti.engine.form.FormProperty;
import org.activiti.explorer.Messages;
import org.activiti.explorer.form.FileFormType;
 
import com.vaadin.ui.Field;
 
// -------------------------------------------------------------------------------------------------
/**
 * Minimal implementation of a custom form type renderer.
 *
 * @author Sven Friedrichs, 2014
 */
// -------------------------------------------------------------------------------------------------
public class FileFormPropertyRenderer extends AbstractFormPropertyRenderer
{
 
  private static final long serialVersionUID = 1L;
 
  // -----------------------------------------------------------------------------------------------
  /**
   * Constructor.
   */
  // -----------------------------------------------------------------------------------------------
  public FileFormPropertyRenderer()
  {
    super(FileFormType.class);
  }
 
  // -----------------------------------------------------------------------------------------------
  /*
   * (non-Javadoc)
   * @see
   * org.activiti.explorer.ui.form.AbstractFormPropertyRenderer#getPropertyField(org.activiti.engine
   * .form.FormProperty)
   */
  // -----------------------------------------------------------------------------------------------
  @Override
  public Field getPropertyField(FormProperty formProperty)
  {
    SelectFileField selectFileField = new SelectFileField(getPropertyLabel(formProperty));
    selectFileField.setRequired(formProperty.isRequired());
    selectFileField.setRequiredError(getMessage(Messages.FORM_FIELD_REQUIRED,
        getPropertyLabel(formProperty)));
    selectFileField.setEnabled(formProperty.isWritable());
 
    if (formProperty.getValue() != null)
    {
      selectFileField.setValue(formProperty.getValue());
    }
 
    return selectFileField;
  }
 
}