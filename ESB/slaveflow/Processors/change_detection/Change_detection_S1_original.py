import os, sys
import fnmatch
import shutil
import subprocess
import logging
from osgeo import gdal, gdal_array, ogr, osr
from imagine import modeler

logging.basicConfig(level=logging.DEBUG,format='[%(levelname)s] %(message)s',)

#############################GENERAL COSTANT INPUTS###############################################
COMANDO_S1TBX='C:\\Programmi\\S1TBX\\gpt.bat '  #path al bat per il command line di S1TBX
COMANDO_NEST='F:\\SENTINEL-1\\SCRIPT_TEST\\gpt2.bat ' #path al bat per il command line di NEST
GDAL_TRANSLATE='"c:\Program Files (x86)\GDAL\gdal_translate.exe" -of GTiff ' #path al comando gdal_translate
GDAL_OGR2OGR='"c:\Program Files (x86)\GDAL\ogr2ogr.exe" -f "ESRI Shapefile" ' 
NEST=1  #Utilizza NEST invece che S1TBX
MAIN_CARTELLA_DEBURST='F:\\SENTINEL-1\\SCRIPT_TEST\\DEBURST\\'
MAIN_CARTELLA_SUBSET='F:\\SENTINEL-1\\SCRIPT_TEST\\SUBSET\\'
MAIN_CARTELLA_COHERENCE='F:\\SENTINEL-1\\SCRIPT_TEST\\COHERENCE\\'
MAIN_CARTELLA_COHERENCE_TIFF='F:\\SENTINEL-1\\SCRIPT_TEST\\COHERENCE_TIFF\\'
MAIN_CARTELLA_OUTPUT='F:\\SENTINEL-1\\SCRIPT_TEST\\OUTPUT\\'
TEMPDIR='F:\\SENTINEL-1\\SCRIPT_TEST\\TEMP\\'
###################################################################################################

if not os.path.exists(MAIN_CARTELLA_DEBURST):
	os.mkdir(MAIN_CARTELLA_DEBURST)
if not os.path.exists(MAIN_CARTELLA_SUBSET):
	os.mkdir(MAIN_CARTELLA_SUBSET)
if not os.path.exists(MAIN_CARTELLA_COHERENCE):
	os.mkdir(MAIN_CARTELLA_COHERENCE)
if not os.path.exists(MAIN_CARTELLA_COHERENCE_TIFF):
	os.mkdir(MAIN_CARTELLA_COHERENCE_TIFF)	
if not os.path.exists(MAIN_CARTELLA_OUTPUT):
	os.mkdir(MAIN_CARTELLA_OUTPUT)
if not os.path.exists(TEMPDIR):
	os.mkdir(TEMPDIR)

def locate(pattern, root=os.curdir):
    matches = []
 
    for path, dirs, files in os.walk(os.path.abspath(root)):
        for filename in fnmatch.filter(files, pattern):
            matches.append(os.path.join(path, filename))
 
    return matches

def deburst_S1TBX(INPUTIMM,OUTIMM,modelfile):

	#Effettua il deburst di una immagine S1 
	#INPUTIMM: immagine S1 da elaborare puo' essere sia zip che safe
	#OUTIMM: 

	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUTIMM+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="TOPSAR-Deburst"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+OUTIMM+'</file>\n')
	scriopen.write('      <formatName>BEAM-DIMAP</formatName>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="TOPSAR-Deburst">\n')
	scriopen.write('    <operator>TOPSAR-Deburst</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <selectedPolarisations>VH,VV</selectedPolarisations>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="Read">\n')
	scriopen.write('      <displayPosition x="37.0" y="134.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="Write">\n')
	scriopen.write('      <displayPosition x="455.0" y="135.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="TOPSAR-Deburst">\n')
	scriopen.write('      <displayPosition x="201.0" y="130.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	comando2=COMANDO_S1TBX+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()


	
def subset_NEST(INPUTDEBURST,OUTSUB,BBOX,modelfile):

	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="1-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUTDEBURST+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="2-Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="3-Subset"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <formatName>BEAM-DIMAP</formatName>\n')
	scriopen.write('      <file>'+OUTSUB+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="3-Subset">\n')
	scriopen.write('    <operator>Subset</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="1-Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>i_VH</band>\n')
	scriopen.write('        <band>q_VH</band>\n')
	scriopen.write('        <band>Intensity_VH</band>\n')
	scriopen.write('        <band>i_VV</band>\n')
	scriopen.write('        <band>q_VV</band>\n')
	scriopen.write('        <band>Intensity_VV</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <regionX>0</regionX>\n')
	scriopen.write('      <regionY>0</regionY>\n')
	# scriopen.write('      <width>69030</width>\n')
	# scriopen.write('      <height>13723</height>\n')
	scriopen.write('      <subSamplingX>1</subSamplingX>\n')
	scriopen.write('      <subSamplingY>1</subSamplingY>\n')
	scriopen.write('      <geoRegion>POLYGON (('+str(BBOX[0])+' '+str(BBOX[3])+', '+str(BBOX[1])+' '+str(BBOX[3])+', '+str(BBOX[1])+' '+str(BBOX[2])+', '+str(BBOX[0])+' '+str(BBOX[2])+', '+str(BBOX[0])+' '+str(BBOX[3])+'))</geoRegion>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="1-Read">\n')
	scriopen.write('      <displayPosition y="134.0" x="37.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="2-Write">\n')
	scriopen.write('      <displayPosition y="135.0" x="455.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="3-Subset">\n')
	scriopen.write('      <displayPosition y="148.0" x="239.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	
	comando2=COMANDO_NEST+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()
	

def CreateStack_NEST(INPUT1,INPUT2,OUTCOH,POL,modelfile):

	#INPUT1= master
	#INPUT2= slave
	#OUTCOH= nome file output di coerenza
	#POL= polarizzazione puo' essere VV o VH
	
	if POL !='VV' and POL !='VH':
		logging.info('Polarization '+POL+' is not correct (VV or VH)')
		return
	
	nome1=os.path.basename(INPUT1)
	nome2=os.path.basename(INPUT2)
	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="1-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT1+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="2-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT2+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="3-CreateInSARStack">\n')
	scriopen.write('    <operator>CreateInSARStack</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="1-Read"/>\n')
	scriopen.write('      <sourceProduct refid="2-Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <masterBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('      </masterBands>\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <initialOffsetMethod>ORBIT</initialOffsetMethod>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="4-Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="3-CreateInSARStack"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <formatName>BEAM-DIMAP</formatName>\n')
	scriopen.write('      <file>'+OUTCOH+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="1-Read">\n')
	scriopen.write('      <displayPosition y="80.0" x="54.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="2-Read">\n')
	scriopen.write('      <displayPosition y="179.0" x="55.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="3-CreateInSARStack">\n')
	scriopen.write('      <displayPosition y="135.0" x="233.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="4-Write">\n')
	scriopen.write('      <displayPosition y="135.0" x="455.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	
	comando2=COMANDO_NEST+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()

def CreateStack_and_coherence_NEST(INPUT1,INPUT2,OUTCOH,POL,modelfile):
	#INPUT1= master
	#INPUT2= slave
	#OUTCOH= nome file output di coerenza
	#POL= polarizzazione puo' essere VV o VH
	
	if POL !='VV' and POL !='VH':
		logging.info('Polarization '+POL+' is not correct (VV or VH)')
		return
	
	nome1=os.path.basename(INPUT1)
	nome2=os.path.basename(INPUT2)
	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="1-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT1+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="3-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT2+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="4-CreateInSARStack">\n')
	scriopen.write('    <operator>CreateInSARStack</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="1-Read"/>\n')
	scriopen.write('      <sourceProduct refid="3-Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <masterBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('      </masterBands>\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <initialOffsetMethod>ORBIT</initialOffsetMethod>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="5-Coherence">\n')
	scriopen.write('    <operator>Coherence</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="4-CreateInSARStack"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <winAz>3</winAz>\n')
	scriopen.write('      <winRg>15</winRg>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="9-Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="5-Coherence"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <formatName>BEAM-DIMAP</formatName>\n')
	scriopen.write('      <file>'+OUTCOH+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="1-Read">\n')
	scriopen.write('      <displayPosition y="88.0" x="32.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="3-Read">\n')
	scriopen.write('      <displayPosition y="162.0" x="23.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="4-CreateInSARStack">\n')
	scriopen.write('      <displayPosition y="131.0" x="116.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="5-Coherence">\n')
	scriopen.write('      <displayPosition y="130.0" x="256.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="9-Write">\n')
	scriopen.write('      <displayPosition y="133.0" x="369.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	comando2=COMANDO_NEST+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()

def Reprojection_Coherence_NEST(INPUT_COH,INPUT_COH_REP,OUTPUT_TIFF,modelfile):
	#print INPUT_COH[:-4]+'.data\\'
	A=locate('*.img',INPUT_COH[:-4]+'.data\\')
	for file in os.listdir(INPUT_COH[:-4]+'.data\\'):
		if file.endswith(".img"):
			A=file
	
	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="1-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT_COH+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="2-Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="5-Reprojection"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <formatName>BEAM-DIMAP</formatName>\n')
	scriopen.write('      <file>'+INPUT_COH_REP+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="3-SRGR">\n')
	scriopen.write('    <operator>SRGR</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="1-Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>'+A[:-4]+'</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <warpPolynomialOrder>4</warpPolynomialOrder>\n')
	scriopen.write('      <interpolationMethod>Linear interpolation</interpolationMethod>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="4-Speckle-Filter">\n')
	scriopen.write('    <operator>Speckle-Filter</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="3-SRGR"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <sourceBands/>\n')
	scriopen.write('      <filter>Refined Lee</filter>\n')
	scriopen.write('      <filterSizeX>3</filterSizeX>\n')
	scriopen.write('      <filterSizeY>3</filterSizeY>\n')
	scriopen.write('      <dampingFactor>2</dampingFactor>\n')
	scriopen.write('      <edgeThreshold>5000.0</edgeThreshold>\n')
	scriopen.write('      <estimateENL>true</estimateENL>\n')
	scriopen.write('      <enl>1.0</enl>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="5-Reprojection">\n')
	scriopen.write('    <operator>Reprojection</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="4-Speckle-Filter"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <wktFile/>\n')
	scriopen.write('      <crs>GEOGCS[&quot;WGS84(DD)&quot;, &#xd;\n')
	scriopen.write('  DATUM[&quot;WGS84&quot;, &#xd;\n')
	scriopen.write('    SPHEROID[&quot;WGS84&quot;, 6378137.0, 298.257223563]], &#xd;\n')
	scriopen.write('  PRIMEM[&quot;Greenwich&quot;, 0.0], &#xd;\n')
	scriopen.write('  UNIT[&quot;degree&quot;, 0.017453292519943295], &#xd;\n')
	scriopen.write('  AXIS[&quot;Geodetic longitude&quot;, EAST], &#xd;\n')
	scriopen.write('  AXIS[&quot;Geodetic latitude&quot;, NORTH]]</crs>\n')
	scriopen.write('      <resampling>Nearest</resampling>\n')
	scriopen.write('      <referencePixelX/>\n')
	scriopen.write('      <referencePixelY/>\n')
	scriopen.write('      <easting/>\n')
	scriopen.write('      <northing/>\n')
	scriopen.write('      <orientation>0.0</orientation>\n')
	scriopen.write('      <pixelSizeX/>\n')
	scriopen.write('      <pixelSizeY/>\n')
	scriopen.write('      <width/>\n')
	scriopen.write('      <height/>\n')
	scriopen.write('      <tileSizeX/>\n')
	scriopen.write('      <tileSizeY/>\n')
	scriopen.write('      <orthorectify>false</orthorectify>\n')
	scriopen.write('      <elevationModelName/>\n')
	scriopen.write('      <noDataValue>NaN</noDataValue>\n')
	scriopen.write('      <includeTiePointGrids>true</includeTiePointGrids>\n')
	scriopen.write('      <addDeltaBands>false</addDeltaBands>\n')
	scriopen.write('      <sourceBands/>\n')
	scriopen.write('      <preserveResolution>true</preserveResolution>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="1-Read">\n')
	scriopen.write('      <displayPosition y="134.0" x="37.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="2-Write">\n')
	scriopen.write('      <displayPosition y="135.0" x="455.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="3-SRGR">\n')
	scriopen.write('      <displayPosition y="134.0" x="139.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="4-Speckle-Filter">\n')
	scriopen.write('      <displayPosition y="132.0" x="240.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="5-Reprojection">\n')
	scriopen.write('      <displayPosition y="131.0" x="350.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	comando2=COMANDO_NEST+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()
	
	logging.info('Converting in geotiff...')
	comando2=GDAL_TRANSLATE+INPUT_COH_REP[:-4]+'.data\\'+A+' '+OUTPUT_TIFF
	p=subprocess.Popen(comando2)
	p.communicate()

def Sub2Coherence_NEST(INPUT1,INPUT2,OUTCOH,POL,modelfile):
	#INPUT1= master
	#INPUT2= slave
	#OUTCOH= nome file output di coerenza
	#POL= polarizzazione puo' essere VV o VH
	
	if POL !='VV' and POL !='VH':
		logging.info('Polarization '+POL+' is not correct (VV or VH)')
		return
	
	nome1=os.path.basename(INPUT1)
	nome2=os.path.basename(INPUT2)
	scriopen=open(modelfile,'w')
	scriopen.write('<graph id="Graph">\n')
	scriopen.write('  <version>1.0</version>\n')
	scriopen.write('  <node id="1-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT1+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="2-Write">\n')
	scriopen.write('    <operator>Write</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="8-Reprojection"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <formatName>ENVI</formatName>\n')
	scriopen.write('      <file>'+OUTCOH+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="3-Read">\n')
	scriopen.write('    <operator>Read</operator>\n')
	scriopen.write('    <sources/>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <file>'+INPUT2+'</file>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="4-CreateInSARStack">\n')
	scriopen.write('    <operator>CreateInSARStack</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="1-Read"/>\n')
	scriopen.write('      <sourceProduct refid="3-Read"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <masterBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome1[:-4]+'</band>\n')
	scriopen.write('      </masterBands>\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>i_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('        <band>q_'+POL+'::'+nome2[:-4]+'</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <initialOffsetMethod>ORBIT</initialOffsetMethod>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="5-Coherence">\n')
	scriopen.write('    <operator>Coherence</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="4-CreateInSARStack"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <winAz>3</winAz>\n')
	scriopen.write('      <winRg>15</winRg>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="6-SRGR">\n')
	scriopen.write('    <operator>SRGR</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="5-Coherence"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>coh_20Oct2014_13Nov2014</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <warpPolynomialOrder>4</warpPolynomialOrder>\n')
	scriopen.write('      <interpolationMethod>Linear interpolation</interpolationMethod>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="7-Speckle-Filter">\n')
	scriopen.write('    <operator>Speckle-Filter</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="6-SRGR"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <sourceBands>\n')
	scriopen.write('        <band>coh_20Oct2014_13Nov2014</band>\n')
	scriopen.write('      </sourceBands>\n')
	scriopen.write('      <filter>Refined Lee</filter>\n')
	scriopen.write('      <filterSizeX>3</filterSizeX>\n')
	scriopen.write('      <filterSizeY>3</filterSizeY>\n')
	scriopen.write('      <dampingFactor>2</dampingFactor>\n')
	scriopen.write('      <edgeThreshold>5000.0</edgeThreshold>\n')
	scriopen.write('      <estimateENL>true</estimateENL>\n')
	scriopen.write('      <enl>1.0</enl>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <node id="8-Reprojection">\n')
	scriopen.write('    <operator>Reprojection</operator>\n')
	scriopen.write('    <sources>\n')
	scriopen.write('      <sourceProduct refid="7-Speckle-Filter"/>\n')
	scriopen.write('    </sources>\n')
	scriopen.write('    <parameters class="com.bc.ceres.binding.dom.XppDomElement">\n')
	scriopen.write('      <wktFile/>\n')
	scriopen.write('      <crs>GEOGCS[&quot;WGS84(DD)&quot;, &#xd;\n')
	scriopen.write('  DATUM[&quot;WGS84&quot;, &#xd;\n')
	scriopen.write('    SPHEROID[&quot;WGS84&quot;, 6378137.0, 298.257223563]], &#xd;\n')
	scriopen.write('  PRIMEM[&quot;Greenwich&quot;, 0.0], &#xd;\n')
	scriopen.write('  UNIT[&quot;degree&quot;, 0.017453292519943295], &#xd;\n')
	scriopen.write('  AXIS[&quot;Geodetic longitude&quot;, EAST], &#xd;\n')
	scriopen.write('  AXIS[&quot;Geodetic latitude&quot;, NORTH]]</crs>\n')
	scriopen.write('      <resampling>Nearest</resampling>\n')
	scriopen.write('      <referencePixelX/>\n')
	scriopen.write('      <referencePixelY/>\n')
	scriopen.write('      <easting/>\n')
	scriopen.write('      <northing/>\n')
	scriopen.write('      <orientation>0.0</orientation>\n')
	scriopen.write('      <pixelSizeX/>\n')
	scriopen.write('      <pixelSizeY/>\n')
	scriopen.write('      <width/>\n')
	scriopen.write('      <height/>\n')
	scriopen.write('      <tileSizeX/>\n')
	scriopen.write('      <tileSizeY/>\n')
	scriopen.write('      <orthorectify>false</orthorectify>\n')
	scriopen.write('      <elevationModelName/>\n')
	scriopen.write('      <noDataValue>NaN</noDataValue>\n')
	scriopen.write('      <includeTiePointGrids>true</includeTiePointGrids>\n')
	scriopen.write('      <addDeltaBands>false</addDeltaBands>\n')
	scriopen.write('      <sourceBands/>\n')
	scriopen.write('      <preserveResolution>true</preserveResolution>\n')
	scriopen.write('    </parameters>\n')
	scriopen.write('  </node>\n')
	scriopen.write('  <applicationData id="Presentation">\n')
	scriopen.write('    <Description/>\n')
	scriopen.write('    <node id="1-Read">\n')
	scriopen.write('      <displayPosition y="88.0" x="32.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="2-Write">\n')
	scriopen.write('      <displayPosition y="136.0" x="713.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="3-Read">\n')
	scriopen.write('      <displayPosition y="162.0" x="23.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="4-CreateInSARStack">\n')
	scriopen.write('      <displayPosition y="131.0" x="116.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="5-Coherence">\n')
	scriopen.write('      <displayPosition y="130.0" x="256.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="6-SRGR">\n')
	scriopen.write('      <displayPosition y="132.0" x="357.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="7-Speckle-Filter">\n')
	scriopen.write('      <displayPosition y="133.0" x="458.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('    <node id="8-Reprojection">\n')
	scriopen.write('      <displayPosition y="134.0" x="582.0"/>\n')
	scriopen.write('    </node>\n')
	scriopen.write('  </applicationData>\n')
	scriopen.write('</graph>\n')
	scriopen.close()
	comando2=COMANDO_NEST+modelfile
	p=subprocess.Popen(comando2)
	p.communicate()

def polygonize(IMM,SHP,FORMATO):
	format = FORMATO#'GML'
	options = []
	quiet_flag = 0
	src_filename = IMM
	src_band_n = 1

	dst_filename = SHP
	dst_layername = None
	dst_fieldname = None
	dst_field = -1
	
	options.append('8CONNECTED=8')
	
	mask = 'default'

	gdal.AllRegister()

	if src_filename is None or dst_filename is None:
		sys.exit(1)

	if dst_layername is None:
		dst_layername = 'out'
		
	# =============================================================================
	# 	Verify we have next gen bindings with the polygonize method.
	# =============================================================================
	try:
		gdal.Polygonize
	except:
		print('')
		print('gdal.Polygonize() not available.  You are likely using "old gen"')
		print('bindings or an older version of the next gen bindings.')
		print('')
		sys.exit(1)

	# =============================================================================
	#	Open source file
	# =============================================================================

	src_ds = gdal.Open( src_filename )
		
	if src_ds is None:
		print('Unable to open %s' % src_filename)
		sys.exit(1)

	srcband = src_ds.GetRasterBand(src_band_n)

	if mask is 'default':
		maskband = srcband.GetMaskBand()
	elif mask is 'none':
		maskband = None
	else:
		mask_ds = gdal.Open( mask )
		maskband = mask_ds.GetRasterBand(1)

	# =============================================================================
	#       Try opening the destination file as an existing file.
	# =============================================================================

	try:
		gdal.PushErrorHandler( 'CPLQuietErrorHandler' )
		dst_ds = ogr.Open( dst_filename, update=1 )
		gdal.PopErrorHandler()
	except:
		dst_ds = None

	# =============================================================================
	# 	Create output file.
	# =============================================================================
	if dst_ds is None:
		drv = ogr.GetDriverByName(format)
		if not quiet_flag:
			print('Creating output %s of format %s.' % (dst_filename, format))
		dst_ds = drv.CreateDataSource( dst_filename )

	# =============================================================================
	#       Find or create destination layer.
	# =============================================================================
	try:
		dst_layer = dst_ds.GetLayerByName(dst_layername)
	except:
		dst_layer = None

	if dst_layer is None:

		srs = None
		if src_ds.GetProjectionRef() != '':
			srs = osr.SpatialReference()
			srs.ImportFromWkt( src_ds.GetProjectionRef() )
			
		dst_layer = dst_ds.CreateLayer(dst_layername, srs = srs )

		if dst_fieldname is None:
			dst_fieldname = 'DN'
			
		fd = ogr.FieldDefn( dst_fieldname, ogr.OFTInteger )
		dst_layer.CreateField( fd )
		dst_field = 0
	else:
		if dst_fieldname is not None:
			dst_field = dst_layer.GetLayerDefn().GetFieldIndex(dst_fieldname)
			if dst_field < 0:
				print("Warning: cannot find field '%s' in layer '%s'" % (dst_fieldname, dst_layername))

	# =============================================================================
	#	Invoke algorithm.
	# =============================================================================

	if quiet_flag:
		prog_func = None
	else:
		prog_func = gdal.TermProgress
		
	result = gdal.Polygonize( srcband, maskband, dst_layer, dst_field, options,
							  callback = prog_func )
		
	srcband = None
	src_ds = None
	dst_ds = None
	mask_ds = None				

def calculate_area(INPUTSHAPE):	
	ds = ogr.Open( INPUTSHAPE, update = 1 )
	if ds is None:
		print "Open failed./n"
		sys.exit( 1 )
	
	nome=os.path.basename(INPUTSHAPE)
	lyr = ds.GetLayerByName( nome[:-4] )
	lyr.ResetReading()

	field_defn = ogr.FieldDefn( "Area", ogr.OFTReal )
	lyr.CreateField(field_defn)

	for i in lyr:
		# feat = lyr.GetFeature(i) 
		geom = i.GetGeometryRef()
		area = geom.GetArea()
		#print 'Area =', area
		lyr.SetFeature(i)
		i.SetField( "Area", area )
		lyr.SetFeature(i)
	ds = None

def Calculate_centroid(INPUTSHP,OUTPUTSHP):
# Get the input Layer
	inShapefile = INPUTSHP
	inDriver = ogr.GetDriverByName("ESRI Shapefile")
	inDataSource = inDriver.Open(inShapefile, 0)
	inLayer = inDataSource.GetLayer()

	# Create the output Layer
	outShapefile = OUTPUTSHP
	outDriver = ogr.GetDriverByName("ESRI Shapefile")

	# Remove output shapefile if it already exists
	if os.path.exists(outShapefile):
		outDriver.DeleteDataSource(outShapefile)

	# Create the output shapefile
	outDataSource = outDriver.CreateDataSource(outShapefile)
	outLayer = outDataSource.CreateLayer("states_centroids", geom_type=ogr.wkbPoint)

	# Add input Layer Fields to the output Layer
	inLayerDefn = inLayer.GetLayerDefn()
	for i in range(0, inLayerDefn.GetFieldCount()):
		fieldDefn = inLayerDefn.GetFieldDefn(i)
		outLayer.CreateField(fieldDefn)

	# Get the output Layer's Feature Definition
	outLayerDefn = outLayer.GetLayerDefn()

	# Add features to the ouput Layer
	for i in range(0, inLayer.GetFeatureCount()):
		# Get the input Feature
		inFeature = inLayer.GetFeature(i)
		# Create output Feature
		outFeature = ogr.Feature(outLayerDefn)
		# Add field values from input Layer
		for i in range(0, outLayerDefn.GetFieldCount()):
			outFeature.SetField(outLayerDefn.GetFieldDefn(i).GetNameRef(), inFeature.GetField(i))
		# Set geometry as centroid
		geom = inFeature.GetGeometryRef()
		centroid = geom.Centroid()
		outFeature.SetGeometry(centroid)
		# Add new feature to output Layer
		outLayer.CreateFeature(outFeature)

	# Close DataSources
	inDataSource.Destroy()
	outDataSource.Destroy()
	

def Found_changes_ERDAS(IMM_INPUT1,IMM_INPUT2,IMM_INPUT3,OUTPUTCHG):
	# Create the owner model
	m = modeler.Model()

	rasterInput = m.RasterInput( Filename=IMM_INPUT1, MapBoundary="<boundary>", AttributesOnRasterOut="true" )
	gt = m.Gt( Input1=rasterInput.RasterOut, Input2="Integer (1)" )
	lt = m.Lt( Input1=rasterInput.RasterOut, Input2="Integer (0)" )
	logicalor = m.LogicalOr( Input1=gt.Binary, Input2=lt.Binary )
	either_or = m.EitherOr( Test=logicalor.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=rasterInput.RasterOut )
	multiply = m.Multiply( Input1=either_or.Output, Input2="Integer (10000)" )
	round = m.Round( Input=multiply.Output )
	integer = m.Integer( Input=round.Output )
	gt4 = m.Gt( Input1=integer.Output, Input2="Integer (10000)" )
	either_or4 = m.EitherOr( Test=gt4.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=integer.Output )
	rasterInput2 = m.RasterInput( Filename=IMM_INPUT2, MapBoundary="<boundary>", AttributesOnRasterOut="true" )
	gt2 = m.Gt( Input1=rasterInput2.RasterOut, Input2="Integer (1)" )
	lt2 = m.Lt( Input1=rasterInput2.RasterOut, Input2="Integer (0)" )
	logicalor2 = m.LogicalOr( Input1=gt2.Binary, Input2=lt2.Binary )
	either_or2 = m.EitherOr( Test=logicalor2.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=rasterInput2.RasterOut )
	multiply2 = m.Multiply( Input1=either_or2.Output, Input2="Integer (10000)" )
	round2 = m.Round( Input=multiply2.Output )
	integer2 = m.Integer( Input=round2.Output )
	gt5 = m.Gt( Input1=integer2.Output, Input2="Integer (10000)" )
	either_or5 = m.EitherOr( Test=gt5.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=integer2.Output )
	stackLayers = m.StackLayers( Input1=either_or4.Output, Input2=either_or5.Output )
	rasterInput3 = m.RasterInput( Filename=IMM_INPUT3, MapBoundary="<boundary>", AttributesOnRasterOut="true" )
	gt3 = m.Gt( Input1=rasterInput3.RasterOut, Input2="Integer (1)" )
	lt3 = m.Lt( Input1=rasterInput3.RasterOut, Input2="Integer (0)" )
	logicalor3 = m.LogicalOr( Input1=gt3.Binary, Input2=lt3.Binary )
	either_or3 = m.EitherOr( Test=logicalor3.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=rasterInput3.RasterOut )
	multiply3 = m.Multiply( Input1=either_or3.Output, Input2="Integer (10000)" )
	round3 = m.Round( Input=multiply3.Output )
	integer3 = m.Integer( Input=round3.Output )
	gt6 = m.Gt( Input1=integer3.Output, Input2="Integer (10000)" )
	either_or6 = m.EitherOr( Test=gt6.Binary, OutputIfTrue="Integer (0)", OutputOtherwise=integer3.Output )
	stackLayers2 = m.StackLayers( Input1=stackLayers.Raster, Input2=either_or6.Output )
	stackStandardDeviation = m.StackStandardDeviation( RasterIn=stackLayers2.Raster )
	stackMean = m.StackMean( RasterIn=stackLayers2.Raster )
	divide = m.Divide( Input1=stackStandardDeviation.RasterOut, Input2=stackMean.RasterOut )
	gt7 = m.Gt( Input1=divide.Output, Input2="Float (0.8)" )
	either_or7 = m.EitherOr( Test=gt7.Binary, OutputIfTrue="Integer (1)", OutputOtherwise="Integer (0)" )
	rasterOutput = m.RasterOutput( RasterIn=either_or7.Output, FilenameIn=OUTPUTCHG, PixelType="u2", Thematicity="Thematic" )
	m.Execute()

	
	
	
	
if __name__ == "__main__":

	###########################  "VARIABLE" INPUTS  ###########################################################################################
	INPUTSAR='t:\\vito\\S1A_IW_SLC__1SDV_20150313T165641_20150313T165708_005016_00649C_D9AA.zip'
	#INPUTSAR="S1A_IW_SLC__1SDV_20150124T165636_20150124T165703_004316_005423_1E8D_Deburst.dim"#"S1A_IW_SLC__1SDV_20141231T165636_20141231T165704_003966_004C60_9156_Deburst.dim"#"S1A_IW_SLC__1SDV_20141113T165637_20141113T165705_003266_003C70_2FE2_Deburst.dim"#"F:\\S1A_IW_SLC__1SDV_20141021T045517_20141021T045545_002923_00350C_03F6.zip"
	B_BOX=[13.95,14.23,40.8,41.1]#[16.5,17.2,40.7,41.3] ##rectangual bounding box defined as [xmin,xmax,ymin,ymax] for S1 data is [lon_min,lon_max,lat_min_lat_max]
	LOCATION_ID='Giulinao'#'Puglia'
	POL='VV' #puo' essere VV o VH
	AREA_THRESHOLD_POLYGONS='200'  #square meters of minimun size of poygonal change areas found
	
	############################################################################################################################################
	
	
	CARTELLA_DEBURST=MAIN_CARTELLA_DEBURST+LOCATION_ID+'\\'
	CARTELLA_SUBSET=MAIN_CARTELLA_SUBSET+LOCATION_ID+'\\'
	CARTELLA_COHERENCE=MAIN_CARTELLA_COHERENCE+LOCATION_ID+'\\'
	CARTELLA_COHERENCE_TIFF=MAIN_CARTELLA_COHERENCE_TIFF+LOCATION_ID+'\\'
	CARTELLA_OUTPUT=MAIN_CARTELLA_OUTPUT+LOCATION_ID+'\\'
	
	if not os.path.exists(CARTELLA_DEBURST):
		os.mkdir(CARTELLA_DEBURST)
	if not os.path.exists(CARTELLA_SUBSET):
		os.mkdir(CARTELLA_SUBSET)
	if not os.path.exists(CARTELLA_COHERENCE):
		os.mkdir(CARTELLA_COHERENCE)
	if not os.path.exists(CARTELLA_COHERENCE_TIFF):
		os.mkdir(CARTELLA_COHERENCE_TIFF)
	if not os.path.exists(CARTELLA_OUTPUT):
		os.mkdir(CARTELLA_OUTPUT)
		
	
	
	
	##DEBURST------------------------------------------------------------------
	
	Nomefile=os.path.basename(INPUTSAR)
	A=Nomefile.split('_')
	for i in A:
		if len(i)==15 and i[0]=='2':
			nome=i
			break
	
	Out_DB=CARTELLA_DEBURST+nome+'.dim'
	
	logging.info('start deburst of the image '+Nomefile)
	if NEST==0:
		try:
			deburst_S1TBX(INPUTSAR,Out_DB,TEMPDIR+'input_db.xml')
		except:
			logging.info('Problem in deburst image '+Nomefile+' with S1TBX')
	else:
		try:
			deburst_S1TBX(INPUTSAR,Out_DB,TEMPDIR+'input_db.xml') #deburst effettuato sempre con S1tbx
			None ##IMPLEMENTARE IL DEBURST CON NEST
		except:
			logging.info('Problem in deburst image '+Nomefile+' with S1TBX')
		
	logging.info('Deburst of '+Nomefile+' completed')
	
	## SUBSET------------------------------------------------------------------
	logging.info('start subsetting the image '+Nomefile)
	Out_DB_subset=CARTELLA_SUBSET+nome+'_sub.dim'
	
	if NEST==0:
		try:
			None ##IMPLEMENTARE IL SUBSET CON S1TBX
		except:
			logging.info('Problem in subsetting image '+Nomefile+' with S1TBX')
	else:
		
		try:
			subset_NEST(Out_DB,Out_DB_subset,B_BOX,TEMPDIR+'input_sub.xml')
			None
		except:
			logging.info('Problem in subsetting image '+Nomefile+' with NEST')
		
	logging.info('Subset of '+Nomefile+' completed')
	
	## COHERENCE IMAGE-----------------------------------------------------------
	
	logging.info('start creating coherence image for '+Nomefile)
	Imm=locate('*.dim',CARTELLA_SUBSET)
	
	Imm=sorted(Imm)
	if len(Imm)>=2:
		IN1=Imm[len(Imm)-2]
		IN2=Imm[len(Imm)-1]

		#CARTELLA_COHERENCE
		ImmCH=locate('*.dim',CARTELLA_COHERENCE)
		
		if len(ImmCH)==0:
			NumeroCH=1
		else:
			ImmCH=sorted(ImmCH)
			print ImmCH
			NomeUltimo=os.path.basename(ImmCH[-1])
			A=NomeUltimo.split('_')
			NumeroCH=int(A[0])+1
		
		testo=''
		for i in range(6-len(str(NumeroCH))):
				testo+='0'
		nomeIN1=os.path.basename(IN1)
		nomeIN2=os.path.basename(IN2)
		
		A=nomeIN1.split('_')
		B=nomeIN2.split('_')
		
		Out_coherence=CARTELLA_COHERENCE+testo+str(NumeroCH)+'_'+A[0]+'_'+B[0]+'_chr.dim'
		Out_Stack=TEMPDIR+testo+str(NumeroCH)+'_'+A[0]+'_'+B[0]+'_stk.dim'
		Out_coherence_tiff=CARTELLA_COHERENCE_TIFF+testo+str(NumeroCH)+'_'+A[0]+'_'+B[0]+'_chr.tif'
		
		if NEST==0:
			
			try:
				None ##IMPLEMENTARE LA COHERENCE CON S1TBX
			except:
				logging.info('Problem in coherence map '+nomeIN1+' '+nomeIN2+' with S1TBX')
		else:
			try:
				CreateStack_and_coherence_NEST(IN1,IN2,Out_Stack,POL,TEMPDIR+'input_chr.xml')
				Reprojection_Coherence_NEST(Out_Stack,Out_coherence,Out_coherence_tiff,TEMPDIR+'input_rpj.xml')
				None
			except:
				logging.info('Problem in sin coherence map '+nomeIN1+' '+nomeIN2+' with NEST')
	else:
		logging.info('Not enough images available for coherence mapping')
		
	
	##PARTE FINALE
	logging.info('start creating final shapefile...')
	Imm=locate('*.tif',CARTELLA_COHERENCE_TIFF)
	
	Imm=sorted(Imm)
	if len(Imm)>=3:	
		IN1=Imm[len(Imm)-3]
		IN2=Imm[len(Imm)-2]
		IN3=Imm[len(Imm)-1]

		
		#CARTELLA_OUTPUT
		ShpCH=locate('*.shp',CARTELLA_OUTPUT)
		
		if len(ShpCH)==0:
			NumeroShpCH=1
		else:
			ShpCH=sorted(ShpCH)
			NomeUltimo=os.path.basename(ShpCH[-1])
			A=NomeUltimo.split('_')
			NumeroShpCH=int(A[0])+1
		
		testo=''
		for i in range(6-len(str(NumeroShpCH))):
				testo+='0'
		
		nomeIN1=os.path.basename(IN1)
		nomeIN2=os.path.basename(IN2)
		nomeIN3=os.path.basename(IN3)
		
		A=nomeIN1.split('_')
		B=nomeIN2.split('_')
		C=nomeIN3.split('_')
		
		#temp and final files
		OUT_FINAL_SHP=CARTELLA_OUTPUT+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_'+C[2]+'.shp'
		OUT_ERDAS_MODEL=TEMPDIR+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_'+C[2]+'_ERDAS_output.tif'
		OUT_ERDAS_MODEL_SHAPEFILE=TEMPDIR+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_'+C[2]+'_ERDAS_output.shp'
		OUT_ERDAS_MODEL_SHAPEFILE_UTM=TEMPDIR+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_ERDAS_output_utm.shp'
		OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD=TEMPDIR+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_'+C[2]+'_ERDAS_output_utm_thd.shp'
		OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD_CENTROID=TEMPDIR+testo+str(NumeroShpCH)+'_'+A[1]+'_'+B[1]+'_'+C[1]+'_'+C[2]+'_ERDAS_output_utm_thd_centroid.shp'
		
		##run erdas model
		logging.info('Run erdas model...')
		Found_changes_ERDAS(IN1,IN2,IN3,OUT_ERDAS_MODEL)
		## trasform output of erdas in polygonal shapefile
		logging.info('Polygonize...')
		polygonize(OUT_ERDAS_MODEL,OUT_ERDAS_MODEL_SHAPEFILE,"ESRI Shapefile")
		## first iteration to compute areas of polygons
		logging.info('Calculate area 1...')
		calculate_area(OUT_ERDAS_MODEL_SHAPEFILE)
		## reproject shapefile in utm
		logging.info('Reprojection...')
		comando=GDAL_OGR2OGR+OUT_ERDAS_MODEL_SHAPEFILE_UTM+' '+OUT_ERDAS_MODEL_SHAPEFILE+' -s_srs EPSG:4326 -t_srs EPSG:32632'
		p=subprocess.Popen(comando)
		p.communicate()
		## second iteration to compute areas of polygons
		logging.info('Calculate area 2...')
		calculate_area(OUT_ERDAS_MODEL_SHAPEFILE_UTM)
		## apply threshold on the areas of polygons
		comando=GDAL_OGR2OGR+' -where "Area>'+AREA_THRESHOLD_POLYGONS+'" '+OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD+' '+OUT_ERDAS_MODEL_SHAPEFILE_UTM
		p=subprocess.Popen(comando)
		p.communicate()
		## calculate centroid of poygons e generate final output
		logging.info('Centroid...')
		Calculate_centroid(OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD,OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD_CENTROID)
		## assign projection to final output
		comando=GDAL_OGR2OGR+' -a_srs EPSG:32632 '+OUT_FINAL_SHP+' '+OUT_ERDAS_MODEL_SHAPEFILE_UTM_THRESHOLD_CENTROID
		p=subprocess.Popen(comando)
		p.communicate()
		
	else:
		logging.info('Not enough images available for change analysis')
	
	## delete tempdir
	logging.info('Deleting temp dir...')
	try:
		shutil.rmtree(TEMPDIR)
		logging.info('Delete completed')
	except:
		logging.info('Problems in deleting files.')