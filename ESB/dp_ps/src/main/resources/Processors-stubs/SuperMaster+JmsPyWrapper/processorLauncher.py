import json, time
import logging
import processSupermaster

def run(jsonArg):
    logging.basicConfig()
    logging.getLogger().setLevel(logging.DEBUG)

            
    sm = processSupermaster.gimmeSupermaster(jsonArg)
	
    return '{ "superMasterId": "'+sm+'" }'
