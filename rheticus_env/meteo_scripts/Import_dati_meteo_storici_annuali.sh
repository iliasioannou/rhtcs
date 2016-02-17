#!/bin/bash

# IMP: installare jq (https://stedolan.github.io/jq/) per il parsing delle stazioni restituite dalle API REST in formato JSON
# sudo apt-get install jq
#
# NB: nel sistema RHETICUS devono essere già presenti le stazioni meteo accessibili mediante API REST
#
# Parametri dello script:
# - Anno di riferimento (yyyy). se non viene specificato viene assunto quello del giorno di esecuzione
# - Codice del paese delle stazioni per le quali importare le misure. Il codice è una alfanumerico di 2 char ISO 3166-1 (ftp://ftp.fu-berlin.de/doc/iso/iso3166-countrycodes.txt). Default è IT e "  " per considerare tutte le stazioni

SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")

# ------------------------------------------
# configuro la directory di lavoro temporanea
WORKING_DIRECTORY_BASE=/tmp/rheticus/meteo/measure_history
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

echo "${SEPARATOR_100// /*}"


# DB connection configuration
#DB_HOST=kim.planetek.it
DB_HOST=localhost
#DB_NAME=RHETICUS_DEV
DB_NAME=RHETICUS
DB_USERNAME=postgres
DB_PASSWORD=PKT284postgRHES
echo "Destination database  <"$DB_NAME"> on server <"$DB_HOST"> ("$DB_USERNAME/$DB_PASSWORD")"
echo ""

# Kettle configuration
KETTLE_PAN_HOME=/opt/data-integration/
KETTLE_JOB_HOME=${METEO_INSTALL_HOME}/kettle_jobs
KETTLE_JOB_IMPORT_MEASURE=$KETTLE_JOB_HOME/METEO_Import_misure.ktr 
echo "Kettle Home: $KETTLE_PAN_HOME"
echo "Kettle job import misure: $KETTLE_JOB_IMPORT_MEASURE"

#RHETICUS_API_ENDPOINT="http://kim.planetek.it:8081"
RHETICUS_API_ENDPOINT="http://localhost:8081"
echo "API RHETICUS END-POINT: $RHETICUS_API_ENDPOINT"

echo "${SEPARATOR_100// /*}"


# ------------------------------------------
# Ask to user year to import
echo -e "Insert year to import (YYYY): \c"
read YEAR_FETCH
regex_check_data="^[0-9]{4}$"
if ! [[ $YEAR_FETCH =~ $regex_check_data ]]
	then
		echo "L'anno inseritoa <"$YEAR_FETCH"> non è valido. Utilizzare il formato YYYY"
		exit 1
fi
echo "Year to import: "$YEAR_FETCH
echo ""

CURRENT_YEAR=$(date +%Y)
if [ "${CURRENT_YEAR}" -lt "${YEAR_FETCH}" ]; then
	echo "L'anno di import è nel futuro. Import aborted"
	exit 1
fi

# ------------------------------------------
# Ask to user country code for filter meteo stations
echo -e "Insert country code (XX). Default is IT. For all stations insert ALL: \c"
read COUNTRY_CODE_FETCH
regex_check_country_code="^.{2,3}$"
if ! [[ $COUNTRY_CODE_FETCH =~ $regex_check_country_code ]]
	then
		COUNTRY_CODE_FETCH=IT
fi
echo "Country code: "$COUNTRY_CODE_FETCH
echo ""


# ------------------------------------------
echo -e "Avvio l'import delle misure ? (y): \c"
read -n 1 START_IMPORT

regex_check_user_confermation="^[y]$"
if ! [[ $START_IMPORT =~ $regex_check_user_confermation ]]
	then
		echo -e "\nImport aborted"
		exit 1
fi
echo ""

# ------------------------------------------
#scarica la lista delle stazioni meteo presenti in RHETICUS
FILE_STATIONS=$WORKING_DIRECTORY/stations

echo "Scarico la lista delle stazioni meteo da RHETICUS."
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
# Elimino le misure annuali delle stazioni del paese

KETTLE_JOB_PATH=${METEO_INSTALL_HOME}/kettle_jobs
KETTLE_JOB_DELETE_STATION_MEASURE=${KETTLE_JOB_PATH}/METEO_delete_misure_anno.ktr 
LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_delete.log
echo "Kettle job delete misure esistenti: $KETTLE_JOB_DELETE_STATION_MEASURE"
echo ""

echo "Elimino le misure di tutte le stazioni del paese scelto per l'anno" $YEAR_FETCH  
${KETTLE_PAN_HOME}/pan.sh -file=${KETTLE_JOB_DELETE_STATION_MEASURE} -param:PAR_Anno=${YEAR_FETCH} -param:PAR_Country_Cod=${COUNTRY_CODE_FETCH} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} > ${LOG_FILE_KETTLE}


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
echo "Ora importo le misure delle stazioni meteo per l'anno " $YEAR_FETCH

MAX_MONTH=12
CURRENT_YEAR=$(date +%Y)
if [ "${CURRENT_YEAR}" -eq "${YEAR_FETCH}" ]; then
	MAX_MONTH=$(date +%m)
	echo "L'anno di import è il corrente, verranno richiesti i report mensili fino al mese ${MAX_MONTH}"
fi

		
FILE_STATIONS_MEASURE=${WORKING_DIRECTORY}/stations_measure_${YEAR_FETCH}.csv
cat ${FILE_STATION_MEASURE_HEADER} >> ${FILE_STATIONS_MEASURE}

INDEX=0
TOTAL_SECOND=0
SECONDS=0

echo "Leggo i codici stazione e per ognuna di esse scarico ed importo le misure"
while read station; 
do
	if [ $station ]
	then
		INDEX=$[INDEX + 1]
		#SECONDS=0
		
		# splitto la coppia ID e COD di una stazione in un array
		IFS="," read -r -a arrayStation <<< "$station"
		STATION_ID=${arrayStation[0]}
		STATION_CODE=${arrayStation[1]}

		HEADER_LOG="$(printf %05d $INDEX)/$(printf %05d $NUM_STATIONS). Stazione = $STATION_ID. [$(date  +%H:%M:%S)] "

		# Ciclo sui mesi, scarico i dati meteo di una stazione e creo un unico file di import con i dati di un anno
		#for MONTH in {01..12}
		for (( IndexMonth=1; IndexMonth<=${MAX_MONTH}; IndexMonth++ ))
		do
			MONTH=$(printf "%02d" ${IndexMonth})
			FILE_STATION_MEASURE_MONTHLY=${WORKING_DIRECTORY}/${STATION_ID}_${YEAR_FETCH}_${MONTH}.csv
			#echo -ne "$HEADER_LOG [$(date +%H:%M:%S)]. Download dati meteo del mese  $MONTH ... \r"
			wget -q -O ${FILE_STATION_MEASURE_MONTHLY}  $METEO_API_ENDPOINT/$STATION_CODE/$YEAR_FETCH/$MONTH/01/MonthlyHistory.html?format=0
			if [[ "$?" != 0 ]]; then
				echo "Problem during remote access to" ${METEO_API_ENDPOINT}
				exit 1
			fi
			
			#Ora ripulisco il file scaricato da caratteri errati
			sed -e "s/<br \/>//g" -i ${FILE_STATION_MEASURE_MONTHLY}
			sed "/^$/d" -i ${FILE_STATION_MEASURE_MONTHLY}
			
			# elimino dal file delle misure la prima riga di intestazione
			# NB: without "tail ... && mv .. " tail command result into empty file
			# view http://stackoverflow.com/questions/339483/how-can-i-remove-the-first-line-of-a-text-file-using-bash-sed-script 
			tail -n +2 $FILE_STATION_MEASURE_MONTHLY > $FILE_STATION_MEASURE_MONTHLY.tmp
			mv $FILE_STATION_MEASURE_MONTHLY.tmp $FILE_STATION_MEASURE_MONTHLY
			
			#aggiungo il codice stazione all'inizio del file delle misure
			sed -i "s/^/$STATION_ID,/" ${FILE_STATION_MEASURE_MONTHLY}
			# aggiungo le misure del mese della stazione al file globale
			#cat ${FILE_STATION_MEASURE_MONTHLY} >> ${FILE_STATION_MEASURE_YEARLY}
			cat ${FILE_STATION_MEASURE_MONTHLY} >> ${FILE_STATIONS_MEASURE}
		
			duration=$SECONDS
			TOTAL_SECOND=$[TOTAL_SECOND + duration]
			MESSAGE_LOG="[$(date +%H:%M:%S)]. Dati del mese $MONTH scaricati in [$(($duration / 60)) min:$(($duration % 60)) sec]        "
			echo -ne "$HEADER_LOG $MESSAGE_LOG \r"
		done


		duration=$SECONDS
		TOTAL_SECOND=$[TOTAL_SECOND + duration]
		MESSAGE_LOG="[$(date +%H:%M:%S)]. Dati scaricati in [$(($duration / 60)) min:$(($duration % 60)) sec]                  "
		echo -ne "$HEADER_LOG $MESSAGE_LOG \r"
	fi
done < $FILE_STATIONS.txt 

duration=$SECONDS
echo "Fine download misure di tutte le stazioni in $(($duration / 60)) minutes and $(($duration % 60)) seconds                           "

# ------------------------------------------
# Import dei dati annui della stazione

START_TIME=$SECONDS

LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_import.log

${KETTLE_PAN_HOME}/pan.sh -file=${KETTLE_JOB_IMPORT_MEASURE} -level=Basic -param:PAR_File_cvs_misure=${FILE_STATIONS_MEASURE} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} >${LOG_FILE_KETTLE}

if ! [ $? -eq 0 ]
then
  echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
fi

ELAPSED_TIME=$(($SECONDS - $START_TIME))

echo "Import ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"
echo "Into working directory <${WORKING_DIRECTORY}> you ca find the complte file of measure <${FILE_STATIONS_MEASURE}>"


