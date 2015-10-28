import time
import sys
import logging
from stompest.config import StompConfig
from stompest.protocol import StompSpec
from stompest.sync import Stomp
from _bsddb import version


logging.basicConfig()
logging.getLogger().setLevel(logging.DEBUG)

CONFIG = StompConfig('tcp://localhost:61613', StompSpec.VERSION_1_1)
QUEUE = '/queue/rheticus.processor.ps'

if __name__ == '__main__':
    print 'Configure stomp client....'
    client = Stomp(CONFIG)
    print '\tClient created'
    
    print 'Connect client to Jms Broker....'
    client.connect(connectTimeout=30, connectedTimeout=60)
    print '\tClient connected to Jms Broker....'
    
    print 'Subscribe client to Queue %s ...' % QUEUE 
    client.subscribe(QUEUE, {StompSpec.ACK_HEADER: StompSpec.ACK_CLIENT_INDIVIDUAL})
    print '\tClient subscribed to Queue'
    
    print 'Run infinite loop for listen incoming message...' 
    while True:
        frame = client.receiveFrame()
        print 'Got %s' % frame.info()
        client.ack(frame)
    client.disconnect()