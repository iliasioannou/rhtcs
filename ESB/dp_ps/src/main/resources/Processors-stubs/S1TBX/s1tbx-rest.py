import time, json
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

from urlparse import parse_qs, urlparse
import random, uuid

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 9091
BASE_REST_PATH = "/api/v1.0/sen1interferometricgeneration"

# TEST Query
#   "http://localhost:9092/api/v1.0/sen1interferometricgeneration"
#   "http://localhost:9092/api/v1.0/sen1interferometricgeneration/123456879"


class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        parsedUrl = urlparse(s.path)
        if(parsedUrl.path.startswith(BASE_REST_PATH)):
            requestId = parsedUrl.path.replace(BASE_REST_PATH, "")
            if(len(requestId) > 1):
                requestStatus = random.choice(["ADDED", "RUNNING", "PARTIALLY_COMPLETED", "COMPLETED", "FAILED"])   
                processingStatus = random.choice(["ADDED","DOWNLOADING","DOWNLOADED","PROCESSING","PROCESSED","FAILED"])
                s.send_response(200)
                s.send_header("Content-type", "application/json")
                s.end_headers()
                s.wfile.write('{ "status": "'+requestStatus+'", "datasetId": "xxxxxxxxx", "supermasterId": "yyyyyyyyyyy", "data": [ { "status": "'+processingStatus+'", "uuid": "173459ac-7b32-4213-9136-74ae9cfe4720"} ] }')
            else:
                s.send_response(500, "ERROR")
                s.end_headers()
                s.wfile.write('Missing requestId')
        else:
            s.send_response(404, "NOT-FOUND")
            s.end_headers()
            s.wfile.write('REST method not exists')
    def do_POST(s):
        """Respond to a POST request."""
        print(s.path)
        parsedUrl = urlparse(s.path)
        if(parsedUrl.path.startswith(BASE_REST_PATH)):
            reqBody = s.rfile.read(int(s.headers.getheader('content-length')))
            print(reqBody)
            s.send_response(200, "OK")
            s.send_header("Content-type", "application/json")
            s.end_headers()
            requestStatus = random.choice(['SUBMITTED', 'FAILED'])
            s.wfile.write('{"requestId": "'+str(uuid.uuid4())+'", "requestStatus": "'+requestStatus+'"}')
        else:
            s.send_response(404, "NOT-FOUND")
            s.end_headers()
            s.wfile.write('REST method not exists')



if __name__ == '__main__':
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "S1TBX Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "S1TBX Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)