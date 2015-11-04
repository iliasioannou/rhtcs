package it.planetek.rheticus;

import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.util.Assert;


public class ElasticsearchJsonWriter
        implements JsonWriter, InitializingBean
    {

        // private static final String HOST = "kim.planetek.it";
        /*
         * private static final String HOST = "localhost";
         * private static final int PORT = 9300;
         */

        private String             clientHost;
        private String             clientPort;

        private Client             client;

        private BulkRequestBuilder bulkRequestBuilder;
        private String             indexName;
        private String             indexType;
        private int                bulkSize = 1000;
        private int                counter;


        public void afterPropertiesSet() throws Exception
            {
                Assert.notNull(indexName);
                Assert.notNull(indexType);
                Assert.notNull(clientHost);
                Assert.notNull(clientPort);
                client = new TransportClient().addTransportAddress(new InetSocketTransportAddress(clientHost, Integer.parseInt(clientPort)));
            }


        public void setClientHost(String clientHost)
            {
                this.clientHost = clientHost;
            }


        public void setClientPort(String clientPort)
            {
                this.clientPort = clientPort;
            }


        public void setIndexName(String indexName)
            {
                this.indexName = indexName;
            }


        public void setIndexType(String indexType)
            {
                this.indexType = indexType;
            }


        public void setBulkSize(int bulkSize)
            {
                this.bulkSize = bulkSize;
            }


        public void open()
            {
                bulkRequestBuilder = client.prepareBulk();
                counter = 0;
            }


        public void write(XContentBuilder builder)
            {
                bulkRequestBuilder.add(client.prepareIndex(indexName, indexType).setSource(builder));
                flush();
            }


        public void close()
            {
                counter = 0;
                if (bulkRequestBuilder.numberOfActions() <= 0)
                    return;
                BulkResponse response = bulkRequestBuilder.get();
                if (response.hasFailures())
                    System.out.println(response.buildFailureMessage());

                client.close();
            }


        private void flush()
            {
                if (++counter % bulkSize != 0)
                    return;
                close();
                open();
            }
    }
