#!/bin/bash

# Import delle misure meteo delle stazioni da un file in formato csv
# Le stazioni devono già essere presenti nel DB
SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")


# ------------------------------------------

echo "${SEPARATOR_100// /*}"

# configuro la directory di lavoro temporanea
WORKING_DIRECTORY_BASE=/tmp/rheticus/meteo/measure_history
WORKING_DIRECTORY=${WORKING_DIRECTORY_BASE}/import_file_run_$(date +%Y-%m-%d_%H_%M_%S)
if [ -d "$WORKING_DIRECTORY" ]
	then # esiste: la svuoto
		rm  $WORKING_DIRECTORY/*
	else # non esiste: la creo
		mkdir -p $WORKING_DIRECTORY
fi
echo "Working directory <${WORKING_DIRECTORY}>"

METEO_INSTALL_HOME="/opt/rheticus_meteo"
echo "Meteo home: <${METEO_INSTALL_HOME}>"

# DB connection configuration
#DB_HOST=kim.planetek.it
DB_HOST=localhost
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
echo "${SEPARATOR_100// /*}"

# ------------------------------------------
# Read from user file to import
echo -e "Insert file (csv) of station's measure to import (with path): \c"
read FILE_STATIONS_MEASURE
if ! [[ -f $FILE_STATIONS_MEASURE ]]
	then
		echo -e "\nFile <${FILE_STATIONS_MEASURE}> doesn't exists.\nImport aborted."
		exit 1
fi
if ! [[ -r $FILE_STATIONS_MEASURE ]]
	then
		echo -e "\nFile <${FILE_STATIONS_MEASURE}> doesn't redeable.\nImport aborted."
		exit 1
fi

echo ""
echo "File delle misure da importare: "${FILE_STATIONS_MEASURE}
echo -e "Avvio l'import delle misure ? (y): \c"
read -n 1 START_IMPORT

regex_check_user_confermation="^[y]$"
if ! [[ $START_IMPORT =~ $regex_check_user_confermation ]]
	then
		echo -e "\nImport aborted"
		exit 1
fi
# copy file to import into working directory
cp ${FILE_STATIONS_MEASURE} ${WORKING_DIRECTORY}


# ------------------------------------------
# Import

START_TIME=$SECONDS

LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job.log

$KETTLE_PAN_HOME/pan.sh -file=${KETTLE_JOB_IMPORT_MEASURE} -level=Basic -param:PAR_File_cvs_misure=${FILE_STATIONS_MEASURE} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} >${LOG_FILE_KETTLE}

if ! [ $? -eq 0 ]
then
  echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
fi

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Import meteo station ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"
