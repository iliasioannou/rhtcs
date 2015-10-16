import ConfigParser

import logging
import yaml
import logging.config
from email.utils import formatdate



class BaseJmsClient(object):
    LOG_CONFIG_FILE = '.\\logging.conf'
    CONFIG_FILE = '.\\wrapperProcessor.ini'
    HOST = 'tcp://localhost:61613'
    QUEUE_REQUEST = '/queue/a'    
    QUEUE_REPLY = '/queue/b'    
    QUEUE_ERROR = '/queue/c'
    SELECTOR = ''

    def __init__(self):
        logging.config.dictConfig(yaml.load(open(self.LOG_CONFIG_FILE, 'r')))
        
        self.logger = logging.getLogger('logToConsole')
        
        self.logger.debug("read config file %s" % self.CONFIG_FILE)
        configWrapper = ConfigParser.ConfigParser()
        configWrapper.read(self.CONFIG_FILE)
        
        self.HOST = 'tcp://' + configWrapper.get('JMSBroker', 'host') + ':' + configWrapper.get('JMSBroker', 'port')
        self.QUEUE_REQUEST = configWrapper.get('JMSBroker', 'queueRequestName')
        self.QUEUE_REPLY = configWrapper.get('JMSBroker', 'queueReplyName')
        self.QUEUE_ERROR = configWrapper.get('JMSBroker', 'queueErrorName')
        self.SELECTOR = configWrapper.get('JMSBroker', 'selectorMessage')
        
        self.logger.debug("HOST: %s" % self.HOST)        
        self.logger.debug("QUEUE_REQUEST: %s" % self.QUEUE_REQUEST)        
        self.logger.debug("QUEUE_REPLY: %s" % self.QUEUE_REPLY)        
        self.logger.debug("QUEUE_ERROR: %s" % self.QUEUE_ERROR)        
        self.logger.debug("SELECTOR: %s" % self.SELECTOR)        
        
