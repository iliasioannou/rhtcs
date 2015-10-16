import time
import json
import logging
from baseJmsClient import BaseJmsClient

from twisted.internet import defer, reactor

from stompest.async import Stomp
from stompest.async.listener import SubscriptionListener
from stompest.config import StompConfig
from stompest.protocol import StompSpec
from stompest.async.listener import ReceiptListener

 

class MockupMuleConsumeReply(BaseJmsClient):
    def __init__(self):
        BaseJmsClient.__init__(self)
        

    @defer.inlineCallbacks
    def run(self):
        #Connect
        configStomp = StompConfig(self.HOST, StompSpec.VERSION_1_1)
        self.logger.debug("Connect client to Jms Broker....")
        self.jmsBrokerConnection = yield Stomp(configStomp).connect(connectTimeout=30, connectedTimeout=60)
        self.logger.debug('Client connected to Jms Broker')   
        
        #Subscribe consumer
        headers = {
            # client-individual mode is necessary for concurrent processing
            # (requires ActiveMQ >= 5.2)
            StompSpec.ACK_HEADER: StompSpec.ACK_CLIENT_INDIVIDUAL,
            # the maximal number of messages the broker will let you work on at the same time
            'activemq.prefetchSize': '100',
            'selector': self.SELECTOR
        }
        self.jmsBrokerConnection.subscribe(self.QUEUE_REPLY, headers, listener=SubscriptionListener(self.consumeMessageReply, errorDestination=self.QUEUE_ERROR))
        self.logger.debug("Subscribed consumer to REPLY QUEUE %s" % self.QUEUE_REPLY)          
        
                
    def consumeMessageReply(self, client, frame):
        """
        NOTE: you can return a Deferred here
        """
        self.logger.debug("<" * 10)
        self.logger.debug("Received Reply message to Request")        
        self.logger.debug('Frame: %s' % frame.info())
        self.logger.debug('Frame headers: %s' % frame.headers)
        
        correlationId = frame.headers['correlation-id']
        self.logger.debug('\tCorrelationId: %s' % correlationId)
        messageId = frame.headers['message-id']
        self.logger.debug('\tMessageId: %s' % messageId)
        
        try:
            messageFailed = frame.headers['message-failed']
        except KeyError:
            messageFailed = None
        
        if (messageFailed is None):
            self.logger.debug('\tProcessor OK')
            data = frame.body
            self.logger.debug('\tProcessor result: %s' % data)
        else:
            self.logger.debug('\tProcessor ERROR: %s' % messageFailed)
    
        
        
        

            
    def closeConnectionToBroker(self):
        self.jmsBrokerConnection.disconnect(receipt='bye')
        yield self.jmsBrokerConnection.disconnected # graceful disconnect: waits until all receipts have arrived
        reactor.stop()
        


if __name__ == '__main__':
    MockupMuleConsumeReply().run()
    reactor.run()