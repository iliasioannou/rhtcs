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
if [[ $EUID -ne 0 ]]; then
	echo "Run this installation script like root user (use sudo)"
	echo ""
	exit 1
fi

# ------------------------------------------
# configuro la directory di lavoro temporanea
WORKING_DIRECTORY_BASE=/tmp/rheticus
WORKING_DIRECTORY=${WORKING_DIRECTORY_BASE}/install_meteo
if [ -d "$WORKING_DIRECTORY" ]
	then # esiste: la svuoto
		rm  $WORKING_DIRECTORY/*
	else # non esiste: la creo
		mkdir -p $WORKING_DIRECTORY
fi

download (){
	local url=$1
    echo -n "    "
    #wget -P "${WORKING_DIRECTORY}"  --progress=dot "$url" 2>&1 | grep --line-buffered "%" | sed -u -e "s,\.,,g" | awk '{printf("\b\b\b\b%4s", $2)}'
    wget -P ${WORKING_DIRECTORY}  --progress=dot $url 
	if [[ "$?" != 0 ]]; then
		echo "Problem during download Pentaho Kettle"
		exit 1
	fi
    echo -ne "\b\b\b\b"
    echo " DONE"
}

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
echo "${SEPARATOR_50// /-}"
USER_NAME=rheticus
USER_PASSWORD=rheticus
echo "Step 2: Create user ${USER_NAME} with password ${USER_PASSWORD}"
USER_PASSWORD_CRYPTED=$(perl -e 'print crypt($ARGV[0], "password")' ${USER_PASSWORD})

#userdel -r ${USER_NAME} > /dev/null 2>&1
id -u ${USER_NAME} > /dev/null 2>&1
if [ $? -eq 0 ]; then
	echo -e "\tUser is already present to system."
else
	echo -e "\tUser is missing. Create it ...."
	useradd -s /bin/bash -p ${USER_PASSWORD_CRYPTED} ${USER_NAME}
	if [ $? -eq 0 ]; then
		echo -e "\tUser has been added into system."
	else
		echo -e "\tFailed to add a user!"
		exit 1
	fi
fi


# ------------------------------------------
echo "${SEPARATOR_50// /-}"
KETTLE_NAME="pdi-ce-6.0.1.0-386"
#KETTLE_NAME="brochure_it"
echo "Step 3: Download and install Pentaho’s Data Integration (Kettle) ${KETTLE_NAME}"
KETTLE_REMOTE_REPO="http://sourceforge.net/projects/pentaho/files/Data%20Integration/6.0/${KETTLE_NAME}.zip/download"
#KETTLE_REMOTE_REPO="http://out.planetek.it/${KETTLE_NAME}.zip"

#wget -q --show-progress  -P ${WORKING_DIRECTORY} "${KETTLE_REMOTE_REPO}"
curl -L -O "${KETTLE_REMOTE_REPO}"  -o "${WORKING_DIRECTORY}/${KETTLE_NAME}.zip" -#
if [[ "$?" != 0 ]]; then
    echo "Problem during download Pentaho Kettle"
       exit 1
fi

KETTLE_INSTALL_HOME="/opt"
unzip -o ${WORKING_DIRECTORY}/${KETTLE_NAME}.zip -d ${KETTLE_INSTALL_HOME} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo "Problem during unzip of ${WORKING_DIRECTORY}/${KETTLE_NAME}.zip"
	exit 1
fi

chown -R rheticus ${KETTLE_INSTALL_HOME}/${KETTLE_NAME} > /dev/null 2>&1
if [[ "$?" != 0 ]]; then
    echo "Problem during change permissio on ${KETTLE_INSTALL_HOME}/${KETTLE_NAME}"
	exit 1
fi

chmod +x ${KETTLE_INSTALL_HOME}/${KETTLE_NAME}/*.sh > /dev/null 2>&1

# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 4: Install KETTLE ETL for import meteo data"

METEO_INSTALL_HOME="/opt/rheticus_meteo"
if ! [ -d "${METEO_INSTALL_HOME}" ]; then 
	# non esiste: la creo
	mkdir ${METEO_INSTALL_HOME} > /dev/null 2>&1
fi

cp  ./Import_dati*.sh ${METEO_INSTALL_HOME} > /dev/null 2>&1
cp -r  ./kettle_jobs  ${METEO_INSTALL_HOME} > /dev/null 2>&1

chown -R rheticus ${METEO_INSTALL_HOME} > /dev/null 2>&1
chmod +x ${METEO_INSTALL_HOME}/*.sh > /dev/null 2>&1


# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 5: Configure Cron"

crontab -u ${USER_NAME} ./cron_config.txt > /dev/null 2>&1

# ------------------------------------------
echo "${SEPARATOR_50// /-}"
echo "Step 6: Purge temp file"
rm -r ${WORKING_DIRECTORY} 

