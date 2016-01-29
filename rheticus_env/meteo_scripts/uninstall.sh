#!/bin/bash


SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")

echo "${SEPARATOR_50// /*}"
echo "RHETICUS Import Meteo Uninstall"
echo "${SEPARATOR_50// /*}"
echo ""

# ------------------------------------------
# Check execution 
# ------------------------------------------
if [[ $EUID -ne 0 ]]; then
	echo "Run this installation script like root user (use sudo)"
	echo ""
	exit 1
fi

# ------------------------------------------
# Delete temp working directory
# ------------------------------------------
WORKING_DIRECTORY=/tmp/rheticus/meteo
echo "Step 1: Removing temp working folder <${WORKING_DIRECTORY}> ..."
if [ -d "$WORKING_DIRECTORY" ]; then # exist: delete it
	rm -rf ${WORKING_DIRECTORY}
fi
echo -e "\tDone"

# ------------------------------------------
# Remove Kettle install
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
KETTLE_NAME_VER="pdi-ce-6.0.1.0-386"
KETTLE_NAME="data-integration"
KETTLE_INSTALL_HOME="/opt"

echo "Step 2: Uninstall Pentaho Data Integration (Kettle) ${KETTLE_NAME}"
echo -e "\tRemoving symbolic link ..."
rm -rf ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER}
echo -e "\tDone"

echo ""
echo -e "\tRemoving Kettle ..."
rm -rf ${KETTLE_INSTALL_HOME}/${KETTLE_NAME}
echo -e "\tDone"

# ------------------------------------------
# Remove meteo script
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 3: Removing Rheticus meteo ..."

METEO_INSTALL_HOME="/opt/rheticus_meteo"
if [ -d "${METEO_INSTALL_HOME}" ]; then # exists: delete it
	rm -rf ${METEO_INSTALL_HOME}
fi
echo -e "\tDone"


# ------------------------------------------
# Remove CRON configuration
# ------------------------------------------
USER_NAME=rheticus
echo "${SEPARATOR_50// /-}"
echo "Step 4: Remove CRON meteo job for user <${USER_NAME}>..."

crontab -u ${USER_NAME} -r > /dev/null 2>&1
echo -e "\tDone"

