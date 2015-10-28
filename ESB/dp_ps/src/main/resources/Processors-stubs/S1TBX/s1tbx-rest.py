import time, json
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
from threading import Thread

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 9091


class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
    def do_GET(s):
        """Respond to a GET request."""
        action = s.path.rsplit('/',1)[-1]
        replyString = "NONE"
        if (action == "start"):
           replyString = "http://127.0.0.1:"+str(PORT_NUMBER)+"/status"
        else:
           replyString = "OK"
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()
        s.wfile.write(replyString)
    def do_POST(s):
        """Respond to a POST request."""
        print(s.path)
        reqBody = s.rfile.read(int(s.headers.getheader('content-length')))
        print(reqBody)
        s.send_response(200, "OK")
        s.send_header("Content-type", "application/json")
        s.end_headers()
        s.wfile.write("STARTED")



if __name__ == '__main__':
    server_class = HTTPServer
    httpd = server_class((HOST_NAME, PORT_NUMBER), MyHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)