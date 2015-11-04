package it.planetek.rheticus;

import org.elasticsearch.common.xcontent.XContentBuilder;


public interface JsonWriter
    {
        public void open();


        public void write(XContentBuilder builder);


        public void close();
    }
