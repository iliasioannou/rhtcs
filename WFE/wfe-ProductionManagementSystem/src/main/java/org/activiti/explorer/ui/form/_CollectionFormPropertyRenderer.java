package org.activiti.explorer.ui.form;

import org.activiti.engine.form.FormProperty;

import com.vaadin.ui.Field;

import org.activiti.explorer.form.SelectionListFormType;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.activiti.explorer.Messages;
import org.activiti.explorer.ui.form.AbstractFormPropertyRenderer;

import com.vaadin.event.ItemClickEvent;
import com.vaadin.ui.AbstractSelect.MultiSelectMode;
import com.vaadin.ui.Table;

public class _CollectionFormPropertyRenderer<T> extends AbstractFormPropertyRenderer {

    private Table table;
    private Map<String, T> values;

    public _CollectionFormPropertyRenderer() {
        super(SelectionListFormType.class);
    }

    @Override
    @SuppressWarnings("unchecked")
    public Field getPropertyField(FormProperty formProperty) {

        table = new Table();
        table.setCaption(getPropertyLabel(formProperty));
        table.setRequired(formProperty.isRequired());
        table.setRequiredError(getMessage(Messages.FORM_FIELD_REQUIRED,
                getPropertyLabel(formProperty)));
        table.setEnabled(formProperty.isReadable());
        table.setSelectable(formProperty.isWritable());
        table.setMultiSelect(true);
        table.setMultiSelectMode(MultiSelectMode.SIMPLE);

        table.addListener(new ItemClickEvent.ItemClickListener() {

            private static final long serialVersionUID = -6477528416002075564L;

            @Override
            public void itemClick(ItemClickEvent event) {
                //table.setCaption("CLICCCKATO!!!");
            }

        });

        values = (Map<String, T>) formProperty.getType().getInformation(
                "values");
        Class<T> genericClass = (Class<T>) values.values().iterator().next()
                .getClass();
        Method[] methods = genericClass.getMethods();
        java.lang.reflect.Field[] fields = genericClass.getDeclaredFields();
        for (java.lang.reflect.Field field : fields)
            if (hasMethod(methods, field))
                table.addContainerProperty(field.getName(), String.class, null);

        if (values != null) {
            for (Map.Entry<String, T> enumEntry : values.entrySet()) {

                String id = enumEntry.getKey();
                T value = enumEntry.getValue();
                table.addItem(getValues(fields, methods, value), id);

                if (enumEntry.getValue() != null)
                {
                    table.setItemCaption(enumEntry.getKey(), (String) enumEntry.getValue());
                }
            }
        }
        return table;
    }

    @Override
    public String getFieldValue(FormProperty formProperty, Field field) {

        assert field == table;

        @SuppressWarnings("unchecked")
        Collection<String> ids = (Collection<String>) field.getValue();
        String ret = "";

        for (String id : ids) {
            ret += id + "|";
        }
        return ret;
    }

    private boolean hasMethod(Method[] methods, java.lang.reflect.Field field) {
        for (Method method : methods) {
            String methodName = method.getName();
            if (methodName.startsWith("get")
                    && methodName.substring(3)
                            .equalsIgnoreCase(field.getName()))
                return true;
        }
        return false;
    }

    private Object[] getValues(java.lang.reflect.Field[] fields,
            Method[] methods, T type) {
        List<Object> result = new ArrayList<Object>();
        try {
            for (java.lang.reflect.Field field : fields)
                for (Method method : methods) {
                    String methodName = method.getName();
                    if (methodName.startsWith("get")
                            && methodName.substring(3).equalsIgnoreCase(
                                    field.getName()))
                        result.add(method.invoke(type));
                }
        } catch (UnsupportedOperationException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return result.toArray();
    }
}