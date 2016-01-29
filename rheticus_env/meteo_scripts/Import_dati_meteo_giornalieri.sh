#!/bin/bash

# IMP: installare jq (https://stedolan.github.io/jq/) per il parsing delle stazioni restituite dalle API REST in formato JSON
# sudo apt-get install jq
#
# NB: nel sistema RHETICUS devono essere già presenti le stazioni meteo accessibili mediante API REST
#
# Parametri dello script:
# - Giorno di riferimento (yyyy-mm-dd). se non viene specificato viene assunto che il giorno di riferimento è quello di esecuzione

SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")

# ------------------------------------------
# configuro la directory di lavoro temporanea
WORKING_DIRECTORY_BASE=/tmp/rheticus/meteo/measure_realtime
WORKING_DIRECTORY=${WORKING_DIRECTORY_BASE}/import_run_$(date +%Y-%m-%d_%H_%M_%S)
if [ -d "$WORKING_DIRECTORY" ]
	then # esiste: la svuoto
		rm  $WORKING_DIRECTORY/*
	else # non esiste: la creo
		mkdir -p $WORKING_DIRECTORY
fi

# ------------------------------------------
LOG_FILE=${WORKING_DIRECTORY}/import.log
exec &> >(tee -a "${LOG_FILE}")

echo "Working directory <${WORKING_DIRECTORY}>"

METEO_INSTALL_HOME="/opt/rheticus_meteo"
echo "Meteo home: <${METEO_INSTALL_HOME}>"


# ------------------------------------------
# Delete working directory (WD) older than X days
THRESHOLD_DAYS_FOR_DELETE_OLD_WD=+10
echo "Deleting older than ${THRESHOLD_DAYS_FOR_DELETE_OLD_WD} Working Directory ..."
find ${WORKING_DIRECTORY_BASE}/* -type d -ctime ${THRESHOLD_DAYS_FOR_DELETE_OLD_WD} | xargs rm -rf
echo "Deleted older Working Directory"


# ------------------------------------------
# Giorno per il quale effettuare il fetch dei dati meteo
DAY_FETCH=""
if [ $# -eq 0 ]
then
	DAY_FETCH=$(date -d "yesterday" +%Y-%m-%d)
else
	DAY_FETCH=$1
	regex_check_data="^[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$"
	if ! [[ $DAY_FETCH =~ $regex_check_data ]]
		then
			echo "La data inserita <"$DAY_FETCH"> non è valida. Utilizzare il formato YYYY-MM-DD"
			exit 1
	fi
fi
echo "Giorno di riferimento: "$DAY_FETCH
echo ""



# ------------------------------------------

echo "${SEPARATOR_100// /*}"


# DB connection configuration
DB_HOST=kim.planetek.it
DB_NAME=RHETICUS_DEV
DB_USERNAME=postgres
DB_PASSWORD=postgres
echo "Destination database  <"$DB_NAME"> on server <"$DB_HOST"> ("$DB_USERNAME/$DB_PASSWORD")"
echo ""

# Kettle configuration
KETTLE_PAN_HOME=/opt/data-integration/
KETTLE_JOB_HOME=${METEO_INSTALL_HOME}/kettle_jobs
KETTLE_JOB_IMPORT_MEASURE=$KETTLE_JOB_HOME/METEO_Import_misure.ktr 
echo "Kettle Home: $KETTLE_PAN_HOME"
echo "Kettle job import misure: $KETTLE_JOB_IMPORT_MEASURE"

RHETICUS_API_ENDPOINT="http://kim.planetek.it:8081"
#RHETICUS_API_ENDPOINT="http://localhost:8081"
echo "API RHETICUS END-POINT: $RHETICUS_API_ENDPOINT"

echo "${SEPARATOR_100// /*}"


# ------------------------------------------
#scarica la lista delle stazioni meteo presenti in RHETICUS
FILE_STATIONS=$WORKING_DIRECTORY/stations
#COUNTRY_CODE_FETCH=IT
COUNTRY_CODE_FETCH=ALL
echo "Scarico la lista delle stazioni meteo da RHETICUS (${COUNTRY_CODE_FETCH})"
if [ "$COUNTRY_CODE_FETCH" == "ALL" ]
	then
		wget -q  -O $FILE_STATIONS.json  $RHETICUS_API_ENDPOINT/api/v1/meteostations/
	else
		wget -q  -O $FILE_STATIONS.json  $RHETICUS_API_ENDPOINT/api/v1/meteostations?country=${COUNTRY_CODE_FETCH}
	#echo "Return wget:"$?"-"
fi
if [[ "$?" != 0 ]]; then
    echo "Problem during download stations from RHETICUS"
	exit 1
fi

# estraggo dal JSON l'ID ed il COD delle stazioni concatenandoli mediante , (ex: IT-LIBA e LIBA -> IT-LIBA,LIBA)
cat  $FILE_STATIONS.json | jq --raw-output  '.[] | .id + "," + .cod' > $FILE_STATIONS.txt

#echo "ELIMINARE LA LIMITAZIONE AL NUM DI STAZIONI"
#head -n 5  $FILE_STATIONS.txt > $FILE_STATIONS.tmp
#mv $FILE_STATIONS.tmp $FILE_STATIONS.txt

NUM_STATIONS=$(wc -l < $FILE_STATIONS.txt)
echo "Numero di stazioni lette: "$NUM_STATIONS

if [[ "$NUM_STATIONS" == "0" ]]; then
    echo "Empty list stations from RHETICUS. Do nothing and exit"
	exit 1
fi

# ------------------------------------------
# Elimino le misure giornaliere delle stazioni del paese

KETTLE_JOB_PATH=${METEO_INSTALL_HOME}/kettle_jobs
KETTLE_JOB_DELETE_STATION_MEASURE=$KETTLE_JOB_PATH/METEO_delete_misure_giorno.ktr 
LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_delete.log
echo "Kettle job delete misure esistenti: $KETTLE_JOB_DELETE_STATION_MEASURE"
echo ""

echo "Elimino le misure di tutte le stazioni del paese (${COUNTRY_CODE_FETCH}) scelto per il giorno ${DAY_FETCH}"

${KETTLE_PAN_PATH}/pan.sh -file=${KETTLE_JOB_DELETE_STATION_MEASURE} -param:PAR_Giorno=${DAY_FETCH} -param:PAR_Country_Cod=${COUNTRY_CODE_FETCH} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} > ${LOG_FILE_KETTLE}


# ------------------------------------------
# Creo la intestazone del file csv che conterrà le misure delle stazioni

METEO_API_ENDPOINT="http://www.wunderground.com/history/airport"
FILE_STATION_MEASURE=$WORKING_DIRECTORY/stations_measure
FILE_STATION_MEASURE_HEADER=$WORKING_DIRECTORY/stations_measure_header

wget -q -O ${FILE_STATION_MEASURE_HEADER}  $METEO_API_ENDPOINT/LIBA/2010/01/01/MonthlyHistory.html?format=0
if [[ "$?" != 0 ]]; then
    echo "Problem during remote access to" ${METEO_API_ENDPOINT}
	exit 1
fi

#Ora ripulisco il file scaricati da caratteri errati
sed -e "s/<br \/>//g" -i ${FILE_STATION_MEASURE_HEADER}
sed "/^$/d" -i ${FILE_STATION_MEASURE_HEADER} 

# Aggiungo il codice stazione all'inizio della intestazione
grep "CET" ${FILE_STATION_MEASURE_HEADER} >  ${FILE_STATION_MEASURE_HEADER}.tmp
sed -i '1s/^/code_station,/' ${FILE_STATION_MEASURE_HEADER}.tmp
mv ${FILE_STATION_MEASURE_HEADER}.tmp ${FILE_STATION_MEASURE_HEADER}


# ------------------------------------------
echo "Ora importo le misure delle stazioni meteo per il giorno " ${DAY_FETCH}

FILE_STATIONS_MEASURE=${WORKING_DIRECTORY}/stations_measure_${DAY_FETCH}.csv
cat ${FILE_STATION_MEASURE_HEADER} >> ${FILE_STATIONS_MEASURE}

INDEX=0
TOTAL_SECOND=0

echo "Leggo i codici stazione e per ognuna di esse scarico ed importo le misure"
while read station; 
do
	if [ $station ]
	then
		INDEX=$[INDEX + 1]
		
		#splitto la coppia ID e COD di una stazione in un array
		IFS="," read -r -a arrayStation <<< "$station"
		STATION_ID=${arrayStation[0]}
		STATION_CODE=${arrayStation[1]}

		HEADER_LOG="$(printf %05d $INDEX)/$(printf %05d $NUM_STATIONS). Stazione = $STATION_ID. [$(date  +%H:%M:%S)] "

		FILE_STATION_MEASURE_MONTHLY=${WORKING_DIRECTORY}/station_measure_${STATION_ID}.csv
		echo -ne "$HEADER_LOG [$(date +%H:%M:%S)]. Download dati meteo ... \r"
		wget -q -O ${FILE_STATION_MEASURE_MONTHLY}  $METEO_API_ENDPOINT/$STATION_CODE/${DAY_FETCH//-//}/MonthlyHistory.html?format=0
		if [[ "$?" != 0 ]]; then
			echo "Problem during remote access to" ${METEO_API_ENDPOINT}
			exit 1
		fi

		#Ora ripulisco il file scaricati da caratteri errati
		sed -e "s/<br \/>//g" -i ${FILE_STATION_MEASURE_MONTHLY}
		sed "/^$/d" -i ${FILE_STATION_MEASURE_MONTHLY}
		
		# Estraggo dal report mensile il dato di misura del giorno in esame
		FILE_STATION_MEASURE_DEALY=${WORKING_DIRECTORY}/station_measure_${STATION_ID}_${DAY_FETCH}.csv
		grep "${DAY_FETCH//-0/-}" ${FILE_STATION_MEASURE_MONTHLY} > ${FILE_STATION_MEASURE_DEALY}
		
		#aggiungo il codice stazione all'inizio del file delle misure
		sed -i "1s/^/$STATION_ID,/" ${FILE_STATION_MEASURE_DEALY}

		# aggiungo la misura giornaliera della stazionne al file globale
		cat ${FILE_STATION_MEASURE_DEALY} >> ${FILE_STATIONS_MEASURE}

		TOTAL_SECOND=${SECONDS}
		MESSAGE_LOG="[$(date +%H:%M:%S)]. Tempo totale download [$(($TOTAL_SECOND / 60)) min:$(($TOTAL_SECOND % 60)) sec]                       "
		echo -e "$HEADER_LOG $MESSAGE_LOG \r"
	fi
done < ${FILE_STATIONS}.txt

echo "Fine download misure di tutte le stazioni in $(($TOTAL_SECOND / 60)) minutes and $(($TOTAL_SECOND % 60)) seconds"

# ------------------------------------------
# Import dei dati annui della stazione

START_TIME=$SECONDS

LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_import.log

$KETTLE_PAN_HOME/pan.sh -file=${KETTLE_JOB_IMPORT_MEASURE} -level=Basic -param:PAR_File_cvs_misure=${FILE_STATIONS_MEASURE} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} >${LOG_FILE_KETTLE}

if ! [ $? -eq 0 ]
then
  echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
fi

ELAPSED_TIME=$(($SECONDS - $START_TIME))

echo "Import ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"
