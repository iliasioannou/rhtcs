import json
import traceback
import time
import logging
from baseJmsClient import BaseJmsClient
import processorLauncher

from twisted.internet import reactor, defer

from stompest.async.listener import SubscriptionListener
from stompest.protocol import StompSpec
from stompest.async import Stomp
from stompest.config import StompConfig
from stompest.async.listener import ReceiptListener


class ConsumerProcessorRequest(BaseJmsClient):
    def __init__(self):
        BaseJmsClient.__init__(self)
        
    @defer.inlineCallbacks
    def run(self):
        configStomp = StompConfig(self.HOST, StompSpec.VERSION_1_1)
        self.logger.debug("Connect client to Jms Broker....")
        self.jmsBrokerConnection = yield Stomp(configStomp).connect(connectTimeout=30, connectedTimeout=60)
        self.jmsBrokerConnection.add(ReceiptListener(1.0))
        self.logger.debug('Client connected to Jms Broker')          
        
        headers = {
            # client-individual mode is necessary for concurrent processing
            # (requires ActiveMQ >= 5.2)
            StompSpec.ACK_HEADER: StompSpec.ACK_CLIENT_INDIVIDUAL,
            # the maximal number of messages the broker will let you work on at the same time
            'activemq.prefetchSize': '100',
            'selector': self.SELECTOR
        }
        self.logger.debug('Subscribe client to Queue: %s ...' % self.QUEUE_REQUEST)
        self.jmsBrokerConnection.subscribe(self.QUEUE_REQUEST, headers, listener=SubscriptionListener(self.consumeMessageRequest, errorDestination=self.QUEUE_REPLY))
        self.logger.debug('Client subscribed to Queue')
        
      

    def consumeMessageRequest(self, client, frame):
        self.logger.debug("-" * 20)
        self.logger.debug("<" * 10)
        self.logger.debug("Received Request message")        
        self.logger.debug('Frame: %s' % frame.info())
        self.logger.debug('Frame headers: %s' % frame.headers)
        
        correlationId = frame.headers['correlation-id']
        self.logger.debug('\tCorrelationId: %s' % correlationId)
        messageId = frame.headers['message-id']
        self.logger.debug('\tMessageId: %s' % messageId)
        replyTo = frame.headers['reply-to']
        self.logger.debug('\tReplyTo: %s' % replyTo)
        
        data = frame.body
        self.logger.debug('Message Body: %s' % data)
        
        processorResult = processorLauncher.run(data)
        self.logger.debug('processorResult %s' % processorResult)
        
        self.logger.debug(">" * 10)
        self.logger.debug("Sending REPLY message to QUEUE_REQUEST %s" % replyTo)
        
        bodyMessage = processorResult
        
        headersMessage = {
            'persistent': 'true',
            'JMSType': 'L0',
            'JMSCorrelationID': correlationId
        }          
        self.jmsBrokerConnection.send(replyTo, body=json.dumps(bodyMessage), headers=headersMessage, receipt='reply-to-message-%s' % messageId)
                    

if __name__ == '__main__':
    ConsumerProcessorRequest().run()
    reactor.run()