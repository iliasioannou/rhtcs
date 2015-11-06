import time, json
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

from urlparse import parse_qs, urlparse
import random

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 9092
BASE_REST_PATH = "/INFN.Grid.RestFrontEnd/services/QueryJob/"

# TEST Query
#   "http://localhost:8080/INFN.Grid.RestFrontEnd/services/QueryJob/InsertJob?USERNAME=username&PASSWORD=password&NAME=PSinSar&arguments=args?????????"
#   "http://localhost:8080/INFN.Grid.RestFrontEnd/services/QueryJob/SelectJob?USERNAME=username&PASSWORD=password&IdJob=123"


class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        parsedUrl = urlparse(s.path)
        parsedQueryString = parse_qs(parsedUrl.query, keep_blank_values=True)
        restMethod = parsedUrl.path.replace(BASE_REST_PATH,"")
        replyXml = "<error>Non funtsiona!</error>"
        
        if(restMethod == "InsertJob"):
            procName = parsedQueryString["NAME"][0]
            jobId = random.randint(100,999)
            print "Requested new "+procName+" job, started with id: "+str(jobId)
            replyXml = "<Job> <Name>"+procName+"</Name> <Flag>123</Flag> <JobsID> <JobId>"+str(jobId)+"</JobId > </JobsID > </Job>"
        else:
            if(restMethod == "SelectJob"):
                jobId = parsedQueryString["IdJob"][0]
                jobStatus = random.choice(['done', 'progress', 'started', 'error', 'queued'])
                print "Requested status of job with ID="+jobId+", sending status: "+jobStatus
                replyXml = "<Jobs> <Job> <Id>"+jobId+"</Id> <Arguments>Arg4</Arguments> <Comment>local</Comment> <CPUs>1</CPUs> <Flag>123</Flag> <LastCheck>2012-02-1410:54:58.0</LastCheck> <Name>PSinSar</Name> <Output>Output-test</Output> <Provenance/>  <Status>"+jobStatus+"</Status> </Job> </Jobs>"
        
        s.send_response(200)
        s.send_header("Content-type", "text/xml")
        s.end_headers()
        s.wfile.write(replyXml)
    def do_POST(s):
        """Respond to a POST request."""
        print(s.path)
        reqBody = s.rfile.read(int(s.headers.getheader('content-length')))
        print(reqBody)
        s.send_response(200, "OK")
        s.send_header("Content-type", "application/json")
        s.end_headers()
        s.wfile.write('{ "requestId": "'+json.loads(reqBody)["requestId"]+'", "result": "OK" }')



if __name__ == '__main__':
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "PSINSAR Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "PSINSAR Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)