#!/bin/bash


SEPARATOR_50=$(printf "%50s")
SEPARATOR_100=$(printf "%100s")
SEPARATOR_150=$(printf "%150s")
SEPARATOR_200=$(printf "%200s")

echo "${SEPARATOR_50// /*}"
echo "RHETICUS Import Meteo installation"
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
# configuro la directory di lavoro temporanea
# ------------------------------------------
WORKING_DIRECTORY_BASE=/tmp/rheticus
WORKING_DIRECTORY=${WORKING_DIRECTORY_BASE}/meteo/install
if [ -d "$WORKING_DIRECTORY" ]
	then # esiste: la svuoto
		rm -rf  $WORKING_DIRECTORY/*
	else # non esiste: la creo
		mkdir -p $WORKING_DIRECTORY
fi

# ------------------------------------------
# Package install
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
PACKAGE_TO_INSTALL=jq
echo "Step 1: ${PACKAGE_TO_INSTALL} package installation"

echo -e "\tChecking installation status for ${PACKAGE_TO_INSTALL} ..."
PACKAGE_STATUS=$(dpkg-query -W --showformat='${Status}\n' ${PACKAGE_TO_INSTALL} 2>&1 | grep "install ok installed")
#echo -e "\tChecking installation status for ${PACKAGE_TO_INSTALL}: ${PACKAGE_STATUS}"
if [ "" == "${PACKAGE_STATUS}" ]; then
	echo -e "\tPackage <${PACKAGE_TO_INSTALL}> doesn't installed on system. Installing it ..."
	apt-get --force-yes --yes install ${PACKAGE_TO_INSTALL} > /dev/null 
	echo -e "\tInstallation finished."
else
	echo -e "\tPackage <${PACKAGE_TO_INSTALL}> already installed on system."
fi


# ------------------------------------------
# Check rheticus user
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
USER_NAME=rheticus
USER_PASSWORD=rheticus
echo "Step 2: Create user ${USER_NAME} with password ${USER_PASSWORD}"
USER_PASSWORD_CRYPTED=$(perl -e 'print crypt($ARGV[0], "password")' ${USER_PASSWORD}) > /dev/null 2>&1

#userdel -r ${USER_NAME} > /dev/null 2>&1
id -u ${USER_NAME} > /dev/null 2>&1
if [ $? -eq 0 ]; then
	echo -e "\tUser is already present into system."
else
	echo -e "\tUser is missing. Create it ...."
	useradd -m -s /bin/bash -p ${USER_PASSWORD_CRYPTED} ${USER_NAME} > /dev/null 2>&1
	if [ $? -eq 0 ]; then
		echo -e "\tUser has been added into system."
	else
		echo -e "\tFailed to add a user!"
		exit 1
	fi

	echo -e "\tAdd user ${USER_NAME} to sudo group. Adding it ...."
	adduser ${USER_NAME} sudo > /dev/null 2>&1
	if [ $? -eq 0 ]; then
		echo -e "\tUser has been added to sudo group."
	else
		echo -e "\tFailed to add a user to sudo group!"
		exit 1
	fi
fi


# ------------------------------------------
# Kettle install
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
KETTLE_NAME_VER="pdi-ce-6.0.1.0-386"
KETTLE_REMOTE_REPO="http://sourceforge.net/projects/pentaho/files/Data%20Integration/6.0/${KETTLE_NAME_VER}.zip/download"
#KETTLE_NAME="brochure_it"
#KETTLE_REMOTE_REPO="http://out.planetek.it/${KETTLE_NAME}.zip"
KETTLE_NAME="data-integration"
KETTLE_INSTALL_HOME="/opt"

echo "Step 3: Download and install Pentaho Data Integration (Kettle)"
echo ""

echo -e "\tDownloading ${KETTLE_NAME_VER} ..."
#wget -q --show-progress  -P ${WORKING_DIRECTORY} "${KETTLE_REMOTE_REPO}"
curl -L "${KETTLE_REMOTE_REPO}"  -o "${WORKING_DIRECTORY}/${KETTLE_NAME_VER}.zip" -#
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during download Pentaho Kettle"
   exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tUnziping ${KETTLE_NAME_VER} ..."
unzip -o ${WORKING_DIRECTORY}/${KETTLE_NAME_VER}.zip -d ${WORKING_DIRECTORY} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during unzip of ${WORKING_DIRECTORY}/${KETTLE_NAME_VER}.zip"
	exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tCreate installation folder ..."
mkdir ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during folder creation  ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER}"
	exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tCopy file to install destination ..."
cp -R ${WORKING_DIRECTORY}/${KETTLE_NAME}/*  ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during copy in ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER}"
	exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tChange owner ..."
chown -R rheticus ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER} > /dev/null 2>&1
chgrp -R rheticus ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during change permission on ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER}"
	exit 1
fi
chown -R rheticus ${WORKING_DIRECTORY_BASE} > /dev/null 2>&1
chgrp -R rheticus ${WORKING_DIRECTORY_BASE} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during change permission on ${WORKING_DIRECTORY_BASE}"
	exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tSet mode bit to runable for kettle script ..."
chmod +x ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER}/*.sh > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during change mode bit"
	exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tCreating symbolic link to Kettle ..."
ln -s  ${KETTLE_INSTALL_HOME}/${KETTLE_NAME_VER} ${KETTLE_INSTALL_HOME}/${KETTLE_NAME}  > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during symbolic link creation"
	exit 1
fi
echo -e "\tDone"

chown rheticus ${KETTLE_INSTALL_HOME}/${KETTLE_NAME} > /dev/null 2>&1
chgrp rheticus ${KETTLE_INSTALL_HOME}/${KETTLE_NAME} > /dev/null 2>&1

# ------------------------------------------
# Install meteo script
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 4: Installing Rheticus import meteo data ..."

METEO_INSTALL_HOME="/opt/rheticus_meteo"
echo ""
echo -e "\tCreating installation folder ..."
if ! [ -d "${METEO_INSTALL_HOME}" ]; then 
        # non esiste: la creo
        mkdir  ${METEO_INSTALL_HOME}  > /dev/null 2>&1
        if [[ "$?" != 0 ]]; then
            echo -e "\tProblem during create meteo install folder"
            exit 1
        fi
fi

echo ""
echo -e "\tCopy meteo import script to installation folder ..."
cp  Import*.sh ${METEO_INSTALL_HOME} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during copy meteo import script"
        exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tCopy kettle ETL to installation folder ..."
cp -r  kettle_jobs  ${METEO_INSTALL_HOME} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during copy kettle trasformation"
        exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tCopy script for import meteo data history by means csv to installation folder ..."
cp -r  import_dati_meteo_UE  ${METEO_INSTALL_HOME} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo -e "\tProblem during copy script for import data history"
        exit 1
fi
echo -e "\tDone"

echo ""
echo -e "\tChange permission ..."
chown -R rheticus ${METEO_INSTALL_HOME} > /dev/null 2>&1
chgrp -R rheticus ${METEO_INSTALL_HOME} > /dev/null 2>&1
chmod +x ${METEO_INSTALL_HOME}/*.sh > /dev/null 2>&1

echo -e "\tDone"

# ------------------------------------------
# Configure CRON
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 5: Configuring CRON Jobs ..."

crontab -u ${USER_NAME} ./cron_config.txt > /dev/null 2>&1
echo -e "\tDone"

# ------------------------------------------
# Delete temp file
# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 6: Removing temp file ..."
rm -r ${WORKING_DIRECTORY} 
echo -e "\tDone"

