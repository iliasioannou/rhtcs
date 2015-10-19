'''
The input end-point is the method "run".
The input json contains the parameter for processor.
With input json you can do two thing:
1) pass it directly to processor if this can read and understand this json
2) or extract from file the parameters necessary to processor launch and pass it to the latter

The output of the method "run" is:
1) a json that will be passed to mule orchestrator like body of JMS
2) or raise a RuntimeError exception    

'''

import json,  time
import logging
import subprocess
from subprocess import CalledProcessError

def run(jsonArg):
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)
    
    logging.debug("-" * 20)
    logging.debug("RUN LAUNCHER PROCESS")
    logging.debug("Input %s" % jsonArg)
    
    #extract from json the param for java process
    jsonDict = json.loads(jsonArg)
    
    messaggeIndex = jsonDict["messaggeIndex"]
    waitTimeSecond = jsonDict["waitTimeSecond"]
    logging.debug("waitTimeSecond = %s for message %s" % (waitTimeSecond, messaggeIndex))
            
    logging.debug("Processor: started at " + time.ctime())
    logging.debug("Processor: long time elaboration [%d sec]..." % waitTimeSecond)
    
    command = 'java -jar .\ProcessorJavaMockup\RheticusProcessorTest-0.0.1-SNAPSHOT.jar %s' % waitTimeSecond
    #command = ['java', '-jar', '.\ProcessorJavaMockup\RheticusProcessorTest-0.0.1-SNAPSHOT.jar', waitTimeSecond]
    try:
        output = subprocess.check_output(command)
        logging.debug("External processor output " + output)
    except CalledProcessError as e:
        logging.error("Processor in error at " + time.ctime())
        logging.error("Processor error: %s" % e)
        raise
        
    #time.sleep(waitTimeSecond)
    logging.debug("Processor: ended at " + time.ctime())
    #return "{'isOk':'true', 'message':'operation ended successful', 'payload':'{'messageIndex':'%s'}'}" % jsonDict["messaggeIndex"]
    #return "{'SmId':'XXXXXX'}"
    return output
