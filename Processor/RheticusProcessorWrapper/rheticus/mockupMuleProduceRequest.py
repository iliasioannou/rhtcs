import time
import json
from baseJmsClient import BaseJmsClient

from twisted.internet import defer, reactor

from stompest.async import Stomp
from stompest.async.listener import SubscriptionListener
from stompest.config import StompConfig
from stompest.protocol import StompSpec
from stompest.async.listener import ReceiptListener


class MockupMuleProduceRequest(BaseJmsClient):
    def __init__(self):
        BaseJmsClient.__init__(self)
  
        
    @defer.inlineCallbacks
    def run(self):
        self.logger.debug("=" * 50)
        self.logger.debug("MOCKUP MULE PRODUCER REQUEST")
        self.logger.debug("=" * 50)
        
        
        userInput = raw_input("Enter the number of JMS message to produce:")
        try:
            numOfMessage = int(userInput)
        except ValueError:
            self.logger.warn("user input [%s] isn't number " % userInput)
            numOfMessage = 1
        
        self.logger.debug("Number of message %d" % numOfMessage)
        
        #Connect
        configStomp = StompConfig(self.HOST, StompSpec.VERSION_1_1)
        self.logger.debug("Connect client to Jms Broker....")
        self.jmsBrokerConnection = yield Stomp(configStomp).connect(connectTimeout=30, connectedTimeout=60)
        self.logger.debug('Client connected to Jms Broker')                  
        
        #Send message
        self.jmsBrokerConnection.add(ReceiptListener(1.0))
        #numOfMessage = 1
        self.logger.debug("-" * 50)
        self.logger.debug("Sending %s message to QUEUE_REQUEST %s" % (numOfMessage, self.QUEUE_REQUEST))
        for j in range(numOfMessage):
            bodyMessage = {
                 'messaggeIndex': j,
                 'waitTimeSecond': (j - 1)
            }            
            
            headersMessage = {
                'persistent': 'true',
                'JMSType': 'L0',
                'JMSCorrelationID': 'correlation_%d' % j,
                'JMSReplyTo':  self.QUEUE_REPLY.replace('/queue/', '')  
            }          
            
            self.logger.debug(">" * 10)  
            self.logger.debug("SEND request message %d/%d: %s" % (j, numOfMessage, bodyMessage))  
            yield self.jmsBrokerConnection.send(self.QUEUE_REQUEST, body=json.dumps(bodyMessage), headers=headersMessage, receipt='message-%d' % j)
            waitSecond = j + 1
            self.logger.debug("Waiting %d sec ..." % waitSecond)
            time.sleep(waitSecond)
        
        #Close connection    
        self.logger.debug("-" * 50)
        self.logger.debug("Close connection with broker JMS and exit")
        self.jmsBrokerConnection.disconnect(receipt='bye')
        yield self.jmsBrokerConnection.disconnected # graceful disconnect: waits until all receipts have arrived
        reactor.stop()
        



if __name__ == '__main__':
    MockupMuleProduceRequest().run()
    reactor.run()