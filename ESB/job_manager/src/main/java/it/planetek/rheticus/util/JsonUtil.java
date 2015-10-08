/*
 *
 */
package it.planetek.rheticus.util;

import java.lang.reflect.Type;
import java.util.List;

import org.joda.time.DateTime;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;


/**
 * The Class JsonUtil.
 */
public class JsonUtil
    {
        private static final String ISO_8601 = "yyyy-MM-dd'T'HH:mm:ss";


        /**
         * To json.
         *
         * @param object
         *            the object
         * @return the string
         */
        public static String toJson(final Object object)
            {
                final Gson gson = new GsonBuilder()
                        .registerTypeAdapter(DateTime.class, new DateTimeDeserializer())
                        .setPrettyPrinting().disableHtmlEscaping()
                        .setDateFormat(ISO_8601).create();
                return gson.toJson(object);
            }


        /**
         * To json.
         *
         * @param <T>
         *            the generic type
         * @param objects
         *            the objects
         * @return the string
         */
        public static <T> String toJson(final List<T> objects)
            {
                final Gson gson = new GsonBuilder()
                        .registerTypeAdapter(DateTime.class, new DateTimeDeserializer())
                        .setPrettyPrinting().disableHtmlEscaping()
                        .setDateFormat(ISO_8601).create();

                final Type listOfTestObject = new TypeToken<List<T>>() {}.getType();
                return gson.toJson(objects, listOfTestObject);
            }

    }
