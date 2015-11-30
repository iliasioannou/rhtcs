#!/bin/bash

# The root dir in which are present the Rheticus softwares
swRoot="/opt/"

cd $swRoot

start () {
	clear
	echo -e "\e[32m*********  Starting Rheticus System Services  ***********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
        apache-activemq-*/bin/activemq start
        echo
        echo -e "\e[44m[ELASTICSEARCH]\e[0m"
        init-rheticus/elasticsearch-as-daemon start
        echo
        echo -e "\e[44m[LOGSTASH]\e[0m"
        init-rheticus/logstash-as-daemon start
        echo
        echo -e "\e[44m[RECASVPN]\e[0m"
        init-rheticus/recasvpn-as-daemon start
        echo
        echo -e "\e[44m[MULE]\e[0m"
        mule-standalone-*/bin/mule start
        echo
        echo -e "\e[44m[TOMCAT7]\e[0m"
        init-rheticus/tomcat7-as-daemon start
        echo
        echo -e "\e[44m[KIBANA]\e[0m"
	init-rheticus/kibana-as-daemon start
	echo -e "\e[32m*********  Starting  Rheticus System Services  ***********\e[0m"
}
 
stop () {
	clear
        echo -e "\e[32m*********  Stopping Rheticus System Services  **********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
        apache-activemq-*/bin/activemq stop
        echo
        echo -e "\e[44m[ELASTICSEARCH]\e[0m"
        init-rheticus/elasticsearch-as-daemon stop
        echo
        echo -e "\e[44m[LOGSTASH]\e[0m"
        init-rheticus/logstash-as-daemon stop
        echo
        echo -e "\e[44m[RECASVPN]\e[0m"
        init-rheticus/recasvpn-as-daemon stop
        echo
        echo -e "\e[44m[MULE]\e[0m"
        mule-standalone-*/bin/mule stop
        echo
        echo -e "\e[44m[TOMCAT7]\e[0m"
        init-rheticus/tomcat7-as-daemon stop
        echo
        echo -e "\e[44m[KIBANA]\e[0m"
        init-rheticus/kibana-as-daemon stop
        echo
        echo -e "\e[32m*********  Stopping Rheticus System Services  **********\e[0m"
}

status () {
	clear
	echo -e "\e[32m*********  Status of Rheticus System Services  **********\e[0m"
	echo -e "\e[44m[ACTIVEMQ]\e[0m"
	apache-activemq-*/bin/activemq status
	echo
	echo -e "\e[44m[ELASTICSEARCH]\e[0m"
	init-rheticus/elasticsearch-as-daemon status
	echo
	echo -e "\e[44m[LOGSTASH]\e[0m"
	init-rheticus/logstash-as-daemon status
	echo
	echo -e "\e[44m[RECASVPN]\e[0m"
	init-rheticus/recasvpn-as-daemon status
	echo
	echo -e "\e[44m[MULE]\e[0m"
        mule-standalone-*/bin/mule status
	echo
	echo -e "\e[44m[TOMCAT7]\e[0m"
	init-rheticus/tomcat7-as-daemon status
	echo
	echo -e "\e[44m[KIBANA]\e[0m"
	init-rheticus/kibana-as-daemon status
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
