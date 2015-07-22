#!/usr/bin/python
import time

#####################################
#
# INPUT
#	inputSar:	
#	inputExtent:	
#	inputSensitivity:	
#	inputDem:	
#	inputLanduse:
#	inputLUType: 
#	inputLUField: 
#	inputLUValues: 
#	inputResType: 
#
# OUTPUT
#	outputImage:	
#
#####################################

# DEBUG
#print message
#print payload
#print args["user"]
#print args["activitiExecID"]
# END DEBUG

# Processing HERE

print "  Python Processing ...\nReceived Data:"
print args["inputSar"]
print args["inputExtent"]
print args["inputSensitivity"]
print args["inputDem"]
print args["inputLanduse"]
print args["inputLUType"]
print args["inputLUField"]
print args["inputLUValues"]
print args["inputResType"]
print "  some secs elaboration ..."
time.sleep(5) # delays for 5 seconds

# END Processing 


# OUTPUT(s)

result = '{'
result += ' "outputImage": "' + args["inputSar"] + ' Elaborated"'
result += '}'