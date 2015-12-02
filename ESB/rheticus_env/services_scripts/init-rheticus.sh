#!/bin/bash

# The dir containing the as-service wrappers to start SW as daemon
wrappersdir="/opt/init-rheticus/as-daemon-wrappers/"

cd "$wrappersdir"

start () {
	clear
	echo -e "\e[32m*********  Starting Rheticus System Services  ***********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
        ./activemq-as-daemon start
        echo
        echo -e "\e[44m[ELASTICSEARCH]\e[0m"
        ./elasticsearch-as-daemon start
        echo
        echo -e "\e[44m[LOGSTASH]\e[0m"
        ./logstash-as-daemon start
        echo
        echo -e "\e[44m[RECASVPN]\e[0m"
        ./recasvpn-as-daemon start
        echo
        echo -e "\e[44m[MULE]\e[0m"
        ./mule-as-daemon start
        echo
        echo -e "\e[44m[TOMCAT7]\e[0m"
        ./tomcat7-as-daemon start
        echo
        echo -e "\e[44m[KIBANA]\e[0m"
	./kibana-as-daemon start
	echo
	echo -e "\e[44m[REST-API]\e[0m"
	./restapi-as-daemon start
	echo
	echo -e "\e[32m*********  Starting  Rheticus System Services  ***********\e[0m"
}
 
stop () {
	clear
        echo -e "\e[32m*********  Stopping Rheticus System Services  **********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
        ./activemq-as-daemon stop
        echo
        echo -e "\e[44m[ELASTICSEARCH]\e[0m"
        ./elasticsearch-as-daemon stop
        echo
        echo -e "\e[44m[LOGSTASH]\e[0m"
        ./logstash-as-daemon stop
        echo
        echo -e "\e[44m[RECASVPN]\e[0m"
        ./recasvpn-as-daemon stop
        echo
        echo -e "\e[44m[MULE]\e[0m"
        ./mule-as-daemon stop
        echo
        echo -e "\e[44m[TOMCAT7]\e[0m"
        ./tomcat7-as-daemon stop
        echo
        echo -e "\e[44m[KIBANA]\e[0m"
	./kibana-as-daemon stop
        echo
	echo -e "\e[44m[REST-API]\e[0m"
        ./restapi-as-daemon stop
        echo
        echo -e "\e[32m*********  Stopping Rheticus System Services  **********\e[0m"
}

status () {
	clear
	pwd
	echo -e "\e[32m*********  Status of Rheticus System Services  **********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
	./activemq-as-daemon status
	echo
	echo -e "\e[44m[ELASTICSEARCH]\e[0m"
	./elasticsearch-as-daemon status
	echo
	echo -e "\e[44m[LOGSTASH]\e[0m"
	./logstash-as-daemon status
	echo
	echo -e "\e[44m[RECASVPN]\e[0m"
	./recasvpn-as-daemon status
	echo
	echo -e "\e[44m[MULE]\e[0m"
        ./mule-as-daemon status
	echo
	echo -e "\e[44m[TOMCAT7]\e[0m"
	./tomcat7-as-daemon status
	echo
	echo -e "\e[44m[KIBANA]\e[0m"
	./kibana-as-daemon status
	echo
	echo -e "\e[44m[REST-API]\e[0m"
        ./restapi-as-daemon start
        echo
	echo -e "\e[32m*********  Status of Rheticus System Services  **********\e[0m"
}


case $1 in
        start)
                start
                ;;
        stop)
                stop
                ;;
        reload)
                stop
                start
                ;;
        restart)
                stop
                start
                ;;
        status)
                status
                ;;
        *)
                echo "Usage: $0 {start|stop|restart|reload|status}"
                exit 1
                ;;
esac
