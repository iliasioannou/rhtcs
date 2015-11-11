import time, json
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

from urlparse import parse_qs, urlparse
import random, uuid

import processSupermaster

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 9091
BASE_REST_PATH = "/api/v1.0/supermaster"

# TEST Query
#   "http://localhost:9091/api/v1.0/supermaster"


class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        s.send_response(404, "NOT-FOUND")
        s.end_headers()
        s.wfile.write('Not supported')
    def do_POST(s):
        """Respond to a POST request."""
        print(s.path)
        parsedUrl = urlparse(s.path)
        if(parsedUrl.path.startswith(BASE_REST_PATH)):
            jsonBody = s.rfile.read(int(s.headers.getheader('content-length')))
            print(jsonBody)
            try:
                dataList = json.loads(jsonBody)
                sm = processSupermaster.gimmeSupermaster(dataList)
                s.send_response(200, "OK")
                s.send_header("Content-type", "application/json")
                responseString = '{ "superMasterId": "'+sm+'" }'
            except Exception as e:
                s.send_response(500, "ERROR")
                responseString = e
        else:
            s.send_response(404, "NOT-FOUND")
            responseString = 'REST method not exists'
        s.end_headers()
        s.wfile.write(responseString)
        

if __name__ == '__main__':
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "SUPERMASTER Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "SUPERMASTER Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)