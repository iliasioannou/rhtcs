package org.activiti.explorer.form;

import org.activiti.engine.form.AbstractFormType;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;


public class SelectionListFormType<T> extends AbstractFormType {

    private Map<String, T> values = new HashMap<String, T>();
    public static final String TYPE_NAME = "selection-list";

    @Override
    public String getName()
    {
        return TYPE_NAME;
    }

    // Convert Form Value to Process variable
    @Override	
    public Collection<T> convertFormValueToModelValue(String propertyValue)	// key1|key3
    { 
        String[] ids = propertyValue.split("\\|\\|\\|");
        Collection<T> ret = new ArrayList<T>();
        for (String id : ids)
        {
            T element = values.get(id);
            if (element != null)
            {
                ret.add(element);
            }
        }
        return ret;
    }

    // Convert Process variable to Form Value 
    @Override
    @SuppressWarnings("unchecked")
    public String convertModelValueToFormValue(Object modelValue)
    {
        Collection<T> modelValues = (Collection<T>) modelValue;
        values.clear();
        for (T value : modelValues)
            values.put(value.toString(), value);
        return modelValue.toString();
    }

    @Override
    public Object getInformation(String key)
    {
        if ("values".equals(key)) {
            return values;
        } else {
            return null;// TODO
        }
    }
}
