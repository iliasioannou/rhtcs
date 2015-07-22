# rpcServer.py
import xmlrpclib, json, os, shutil, socket
import ConfigParser
from SimpleXMLRPCServer import SimpleXMLRPCServer, SimpleXMLRPCRequestHandler

# store clients' IPs and Ports
monitor = {}

# save original working directory
startPath = os.getcwd()

# load server config properties
cp = ConfigParser.ConfigParser()
cp.read("serverConfig.ini")
serverConf = dict(cp.items('server'))
print "Server configuration loaded."

# !!! **** ADD Processors dir to PYTHONPATH **** !!!!      

class customXMLRPCHandler(SimpleXMLRPCRequestHandler):
    def do_POST(self):
        global monitor
        monitor["clientIP"], monitor["clientPort"] = self.client_address
        SimpleXMLRPCRequestHandler.do_POST(self)

# 
def execute(processInstanceID, userName, productID, scriptName, jsonData, transferPath):
    
    # parse json to dictionary
    argsDict = json.loads(jsonData)
    print "SERVER: received request. Payload:"
    print argsDict
    
    # import requested module
    print "SERVER: Importing module named " + scriptName
    module = __import__(productID+'.'+scriptName)
    proc = module.__dict__[scriptName]

    # load an inject config properties
    config = ConfigParser.ConfigParser()
    config.read(module.__path__[0]+"\\config.ini")
    configDict = dict(config.items(scriptName))
    print "SERVER: Loaded config: " + str(configDict)
    proc.__dict__.update( configDict )
    
    print proc
    print dir(proc)

    # prepare and chdir to working dir in Transfer/processInstanceID/ (to allow access to input/output dirs)
    workingDir = transferPath + processInstanceID      
    if not os.path.isdir(workingDir):
        try:
            print "   SERVER: Creating needed folders ..."
            os.mkdir(workingDir)
            os.chmod(workingDir,0o744)
            print "   SERVER: change folders permissions ..."
            os.chdir(workingDir)       # chdir to wd
            print "   SERVER: WorkingDir moved to -" + os.getcwd() +"-"
            os.mkdir("input")
            os.mkdir("output")
            os.chmod("output",0o744)
            print "   SERVER: folders created."
        except OSError as exc:
            print "   SERVER: error creating transfer folders. "+str(exc)
    else:
        print "   SERVER: needed folders already created ..."
        os.chdir(workingDir)       # chdir to wd
        print "   SERVER: WorkingDir moved to -" + os.getcwd() +"-"   
    
    print "SERVER: call run() from imported module"
    print "- MODULE STDOUT -\n"
    outDict = proc.run(argsDict)

    print "\n- END MODULE STDOUT -"

    # move output files to Liferay WebDAV
    outLRDir = serverConf["liferaydrive"]+"\\"+userName+"\\"+productID+"\\"+processInstanceID
    if not os.path.isdir(outLRDir):
        try:
            os.makedirs(outLRDir)
        except OSError as exc:
            print "   SERVER: error creating output LR webdav folder. "+str(exc)
    else:
        print "   SERVER: output LR webdav folder already created ..."

    print "   SERVER: moving output files to Liferay WebDAV."
    outputFiles = os.listdir(workingDir+"\\output")
    for filename in outputFiles:
        fullFname = os.path.join(workingDir+"\\output", filename)
        if (os.path.isfile(fullFname)):
            shutil.move(fullFname, outLRDir)

    # add transfer and output path into returned out
    print "SERVER: Adding mule transferPath (input) into outDict ("+workingDir+")"
    outDict["transferPath"] = workingDir+"\\input"

    print "SERVER: Adding Liferay outputPath (output) into outDict ("+productID+"\\"+processInstanceID+")"
    outDict["outputPath"] = productID+"\\"+processInstanceID
    
    print "SERVER: sending back module run() output"
    print outDict
    
    print "MONITOR:",monitor["clientIP"]

    # Restore original working directory
    os.chdir(startPath)
    
    return json.dumps(outDict)

server = SimpleXMLRPCServer((serverConf["host"], int(serverConf["port"]) ), customXMLRPCHandler)
print "Listening on port "+serverConf["port"]

server.register_instance(monitor)

server.register_function(execute, "execute")
server.serve_forever()
