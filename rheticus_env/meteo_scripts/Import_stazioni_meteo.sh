#!/bin/bash

# Import delle stazioni meteo da
# http://weather.rap.ucar.edu/surface/stations.txt

SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")

# ------------------------------------------
# configuro la directory di lavoro temporanea
WORKING_DIRECTORY=/tmp/meteo/stations/import_run_$(date +%Y-%m-%d_%H_%M_%S)
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

# ------------------------------------------

# DB connection configuration
#DB_HOST=kim.planetek.it
DB_HOST=localhost
DB_NAME=RHETICUS_DEV
DB_USERNAME=postgres
DB_PASSWORD=postgres
echo "Destination database  <"$DB_NAME"> on server <"$DB_HOST"> ("$DB_USERNAME/$DB_PASSWORD")"
echo ""

# Kettle configuration
KETTLE_PAN_HOME=/opt/data-integration_ce-6.0.1.0/
KETTLE_JOB_HOME=/home/coletta/pkt284/dati_meteo/kettle_jobs
KETTLE_JOB_IMPORT_STATIONS=${KETTLE_JOB_HOME}/METEO_Import_stazioni.ktr 
echo "Kettle Home: $KETTLE_PAN_HOME"
echo "Kettle job import stazioni: $KETTLE_JOB_IMPORT_STATIONS"


echo "${SEPARATOR_100// /*}"


# ------------------------------------------
# Ask to user if the delete the stations previously imported
echo -e "Delete existing stations into database (y/f, default=f): \c"
read PURGE_TABLE
regex_check_user_confermation="^[y]$"
if [[ $PURGE_TABLE =~ $regex_check_user_confermation ]]
	then
		PURGE_TABLE=TRUE
	else
		PURGE_TABLE=FALSE
fi

echo ""
echo "Eliminare le stazioni già presenti nel sistema ? : "${PURGE_TABLE}
echo -e "Avvio l'import delle stazioni ? (y): \c"
read -n 1 START_IMPORT

regex_check_user_confermation="^[y]$"
if ! [[ $START_IMPORT =~ $regex_check_user_confermation ]]
	then
		echo -e "\nImport aborted"
		exit 1
fi


# ------------------------------------------
# Download stations file

FILE_STATIONS_TO_IMPORT=$WORKING_DIRECTORY/stations.txt
FILE_EU_STATIONS_TO_IMPORT=$WORKING_DIRECTORY/stations_EU
echo ""
echo "Scarico la lista delle stazioni meteo di tutto il mondo in $FILE_STATIONS_TO_IMPORT"
wget -q -O ${FILE_STATIONS_TO_IMPORT}  http://weather.rap.ucar.edu/surface/stations.txt
if ! [ $? -eq 0 ]
then
	echo "Problem during download stations"
	exit 1
fi
cp $FILE_STATIONS_TO_IMPORT $FILE_STATIONS_TO_IMPORT.bkp


# ------------------------------------------
# Filter stations by means first char of ICAO code

# Il codice ICAO (di 4 caratteri alfanumerico) delle stazioni meteo europee inizia con E (EU nord) o con L (EU sud)
echo "Dalla lista globale delle stazioni estraggo quelle europee"
PATTERN_ICAO="^.{20}(E|L).{3}"
grep -E "${PATTERN_ICAO}"  ${FILE_STATIONS_TO_IMPORT}  > ${FILE_EU_STATIONS_TO_IMPORT}.txt

# ------------------------------------------
#Il file generato non è in formato CSV, lo converto in tale formato in modo da importarlo con ETL kettle
echo "Genero il file csv delle stazioni"
cut -c 4-19,21-24,40-45,48-54,57-59,82-83  --output-delimiter=$','  "${FILE_EU_STATIONS_TO_IMPORT}.txt" > "${FILE_EU_STATIONS_TO_IMPORT}.csv"


# ------------------------------------------
# Import
START_TIME=$SECONDS

LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job.log
echo "Eseguo ETL Kettle di import delle stazioni"

${KETTLE_PAN_HOME}/pan.sh -file=${KETTLE_JOB_IMPORT_STATIONS} -param:PAR_File_cvs_stazioni_meteo="${FILE_EU_STATIONS_TO_IMPORT}.csv" -param:PAR_Delete_table=${PURGE_TABLE}  -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME}  > ${LOG_FILE_KETTLE}

if ! [ $? -eq 0 ]
then
  echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
fi

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Import station ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"

