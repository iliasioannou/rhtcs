package org.activiti.explorer.ui.form;

import java.util.Collection;
import java.util.Map;

import org.activiti.engine.form.FormProperty;

import com.vaadin.data.Item;
import com.vaadin.ui.Field;
import com.vaadin.ui.TwinColSelect;

import org.activiti.explorer.form.SelectionListFormType;
import org.activiti.explorer.Messages;
import org.activiti.explorer.ui.form.AbstractFormPropertyRenderer;

public class SelectionListFormPropertyRenderer<T> extends AbstractFormPropertyRenderer
{
	public SelectionListFormPropertyRenderer()
	{
		super(SelectionListFormType.class);
	}

	@Override
	public Field getPropertyField(FormProperty formProperty)
	{
		TwinColSelect select = new TwinColSelect(getPropertyLabel(formProperty));
		select.setRequired(formProperty.isRequired());
		select.setEnabled(formProperty.isWritable());
		select.setRequiredError(getMessage(Messages.FORM_FIELD_REQUIRED, getPropertyLabel(formProperty)));

		// Set the column captions (optional)
		select.setLeftColumnCaption("Available Data");
		select.setRightColumnCaption("Selected Data");
		select.setColumns(18);
		
		for (Object item : ((Map) formProperty.getType().getInformation("values")).values())
		{
			select.addItem(item.toString());
		}
		
		// Set the number of visible items
		select.setRows(15);
		
		return select;
	}
	
	@Override
    public String getFieldValue(FormProperty formProperty, Field field)
	{
        @SuppressWarnings("unchecked")
        Collection<String> ids = (Collection<String>) field.getValue();
        String ret = "";

        for (String id : ids) {
            ret += id + "|||";
        }
		return ret;
	}
       
}