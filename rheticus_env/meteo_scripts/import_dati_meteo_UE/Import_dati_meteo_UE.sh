#!/bin/bash

# Con il seguente script vengono importate le stazioni meteo della UE e le misure storiche degli anni 2012-2015


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
IMPORT_METEO_UE_HOME="${METEO_INSTALL_HOME}/import_dati_meteo_UE"
echo "Meteo home: <${METEO_INSTALL_HOME}>"
echo "Meteo import meteo UE home: <${IMPORT_METEO_UE_HOME}>"

# ------------------------------------------
LOG_FILE=${WORKING_DIRECTORY}/import.log
exec &> >(tee -a "${LOG_FILE}")

# ------------------------------------------
# DB connection configuration
#DB_HOST=kim.planetek.it
DB_HOST=localhost
DB_NAME=RHETICUS
#DB_NAME=RHETICUS_DEV
DB_USERNAME=rheticus
DB_PASSWORD=pkt284restiCUS
echo "Destination database  <"$DB_NAME"> on server <"$DB_HOST"> ("$DB_USERNAME/$DB_PASSWORD")"
echo ""

# Kettle configuration
KETTLE_PAN_HOME=/opt/data-integration/
KETTLE_JOB_HOME=${METEO_INSTALL_HOME}/kettle_jobs
KETTLE_JOB_IMPORT_STATIONS=$KETTLE_JOB_HOME/METEO_Import_stazioni.ktr
KETTLE_JOB_IMPORT_MEASURE=$KETTLE_JOB_HOME/METEO_Import_misure.ktr
echo "Kettle Home: $KETTLE_PAN_HOME"
echo "Kettle job import stations: $KETTLE_JOB_IMPORT_STATIONS"
echo "Kettle job import measure: $KETTLE_JOB_IMPORT_MEASURE"
echo "${SEPARATOR_100// /*}"

# ------------------------------------------
echo -e "Questo import eliminerà le stazioni e le misure già presenti nel DB. Avviare ? (y): \c"
read -n 1 START_IMPORT

regex_check_user_confermation="^[y]$"
if ! [[ $START_IMPORT =~ $regex_check_user_confermation ]]
then
	echo -e "\nImport aborted"exit 1
	exit 1
fi
echo ""
echo ""

# ------------------------------------------
# Unzip file with stations and measure to import
ZIP_FILE_WITH_DATA=dati_meteo_UE
echo "Unzip file <${ZIP_FILE_WITH_DATA}.tar.gz> with stations and measure to import"
tar -zxvf ${ZIP_FILE_WITH_DATA}.tar.gz
echo ""

# ------------------------------------------
# Import stations
CURRENT_WORKING_DIRECTORY=$(pwd)
FILE_EU_STATIONS_TO_IMPORT=${CURRENT_WORKING_DIRECTORY}/${ZIP_FILE_WITH_DATA}/stations_UE.csv
PURGE_TABLE=TRUE

echo "Import stations file <${FILE_EU_STATIONS_TO_IMPORT}>"
START_TIME=$SECONDS

LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_import_stations.log

${KETTLE_PAN_HOME}/pan.sh -file=${KETTLE_JOB_IMPORT_STATIONS} -param:PAR_File_cvs_stazioni_meteo="${FILE_EU_STATIONS_TO_IMPORT}" -param:PAR_Delete_table=${PURGE_TABLE}  -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME}  > ${LOG_FILE_KETTLE}

if ! [ $? -eq 0 ]
then
	echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
fi

ELAPSED_TIME=$(($SECONDS - $START_TIME))
echo "Import meteo station ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"
echo ""

# ------------------------------------------
# Import measure
echo "Import measures"

echo "${SEPARATOR_100// /*}" >> ${LOG_FILE_KETTLE}
echo "Import measures" >> ${LOG_FILE_KETTLE}
echo ""

for FILE_STATIONS_MEASURE in ${ZIP_FILE_WITH_DATA}/*measure*.csv; do
	FILE_STATIONS_MEASURE_TO_IMPORT=${CURRENT_WORKING_DIRECTORY}/${FILE_STATIONS_MEASURE}
	echo -e "\tImport measures from file <${FILE_STATIONS_MEASURE_TO_IMPORT}>"

	echo "${SEPARATOR_100// /-}" >> ${LOG_FILE_KETTLE}
	echo "Import measures from file <${FILE_STATIONS_MEASURE_TO_IMPORT}>" >> ${LOG_FILE_KETTLE}

	START_TIME=$SECONDS

	LOG_FILE_KETTLE=${WORKING_DIRECTORY}/kettle_job_import_measure.log

	${KETTLE_PAN_HOME}/pan.sh -file=${KETTLE_JOB_IMPORT_MEASURE} -level=Basic -param:PAR_File_cvs_misure=${FILE_STATIONS_MEASURE_TO_IMPORT} -param:PAR_DB_host=${DB_HOST} -param:PAR_DB_nameDb=${DB_NAME} -param:PAR_DB_password=${DB_PASSWORD} -param:PAR_DB_username=${DB_USERNAME} >> ${LOG_FILE_KETTLE}

	if ! [ $? -eq 0 ]
	then
		echo "Problem during KETTLE job import. View ${LOG_FILE_KETTLE}"
	fi

	ELAPSED_TIME=$(($SECONDS - $START_TIME))
	echo -e "\t\tImport meteo station ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"
done

ELAPSED_TIME=$SECONDS
echo ""
echo "Import ended in $(($ELAPSED_TIME / 60)) minutes and $(($ELAPSED_TIME % 60)) seconds"

# ------------------------------------------
# Remove unziped directory
echo "Remove unzip folder ${ZIP_FILE_WITH_DATA}"
rm -r ${ZIP_FILE_WITH_DATA}
