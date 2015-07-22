package org.activiti.explorer.ui.form;

import org.activiti.engine.form.FormProperty;
import org.activiti.explorer.Messages;
import org.activiti.explorer.form.TextAreaFormType;

import com.vaadin.ui.Field;
import com.vaadin.ui.TextArea;

public class TextAreaFormPropertyRenderer extends AbstractFormPropertyRenderer {

	public TextAreaFormPropertyRenderer()
	{
		super(TextAreaFormType.class);
	}

	@Override
	public Field getPropertyField(FormProperty formProperty)
	{
		 TextArea textArea = new TextArea(getPropertyLabel(formProperty));
		 textArea.setRequired(formProperty.isRequired());
		 textArea.setEnabled(formProperty.isWritable());
		 textArea.setRequiredError(getMessage(Messages.FORM_FIELD_REQUIRED, getPropertyLabel(formProperty)));
		
		 textArea.setRows(10);
		 textArea.setColumns(25);
		 
		 
		 if (formProperty.getValue() != null)
		 {
			 textArea.setValue(formProperty.getValue());
		 }	 
		 return textArea;
	}

}
