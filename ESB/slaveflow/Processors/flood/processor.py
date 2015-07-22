from osgeo import gdal
from gdalconst import *
from imagine import modeler
import numpy
import os
import threading
from time import sleep
import logging
import string
import subprocess
import random

##For debug purpose---------------------
# import matplotlib.pyplot as plt
# import inspect
##---------------------------------------

#/* -------------------------------------------------------------------- */
#/*      FILES AND DIRECTORY                                             */
#/* -------------------------------------------------------------------- */ 

SENSITIVITY=1   #If 0 three images are generated, 1=it generates only "normal" sensitivity, 2= generate only "low" sensitivity, 3=generates only "high" sensitiviy

Output_Image='output\\Flood_map.img'  #Output file name

TEMPDIR='output\\temp\\'  #Temporary directory to
NomeFileTemp=TEMPDIR+'output_modelv2.img' #Internal temporary file name
model1='F:\\SHIRA\\SHIRA_Flood_Workflow\\01_SHOT_Alluvione_Sardegna\\flood_spatialmodeler.gmdx'   #Name of the first Erdas Model
model2='F:\\SHIRA\\SHIRA_Flood_Workflow\\01_SHOT_Alluvione_Sardegna\\flood_spatialmodeler_postprossv2.gmdx' #Name of the second Erdas Model
model3='F:\\SHIRA\\SHIRA_Flood_Workflow\\01_SHOT_Alluvione_Sardegna\\modelloconversione.gmdx' #Name of the second Erdas Model


#/* -------------------------------------------------------------------- */
#/*      PARAMETERS                                                      */
#/* -------------------------------------------------------------------- */ 

#Internal parameters
SMOOTHING_WINDOWS_LENGTH=11  #Size of the window in smoothing histogram. It must be always an odd number.
NUMMAXTHREAD=3 #Max number of thread can be started.

#User parameters
MAX_SLOPE= 25 #Maximum slope allowed for the DEM
SAR_MAX_VALUE_ALLOWED= 950 #Max value allowed in SAR image
SAR_MASKED_VALUE=950 #...non mi ricordo...
PARAM_ASPECT=45 #....
MINIMUM_MAP_SIZE=3000 #Min size, in pixel, of the patches and the holes in final map. 


logging.basicConfig(level=logging.DEBUG,format='[%(levelname)s] (%(threadName)-10s) %(message)s',)
	
	
#/* -------------------------------------------------------------------- */
#/*      FUNCTIONS                                                       */
#/* -------------------------------------------------------------------- */

def id_generator(size=10, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for x in range(size))

def smooth(x,window_len=SMOOTHING_WINDOWS_LENGTH,window='hanning'):
    """smooth the data using a window with requested size.
    
    This method is based on the convolution of a scaled window with the signal.
    The signal is prepared by introducing reflected copies of the signal 
    (with the window size) in both ends so that transient parts are minimized
    in the begining and end part of the output signal.
    
    input:
        x: the input signal 
        window_len: the dimension of the smoothing window; should be an odd integer
        window: the type of window from 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'
            flat window will produce a moving average smoothing.

    output:
        the smoothed signal
        
    example:

    t=linspace(-2,2,0.1)
    x=sin(t)+randn(len(t))*0.1
    y=smooth(x)
    
    see also: 
    
    numpy.hanning, numpy.hamming, numpy.bartlett, numpy.blackman, numpy.convolve
    scipy.signal.lfilter
 
    TODO: the window parameter could be the window itself if an array instead of a string
    NOTE: length(output) != length(input), to correct this: return y[(window_len/2-1):-(window_len/2)] instead of just y."""

    if x.ndim != 1:
        raise ValueError, "smooth only accepts 1 dimension arrays."

    if x.size < window_len:
        raise ValueError, "Input vector needs to be bigger than window size."


    if window_len<3:
        return x


    if not window in ['flat', 'hanning', 'hamming', 'bartlett', 'blackman']:
        raise ValueError, "Window is on of 'flat', 'hanning', 'hamming', 'bartlett', 'blackman'"


    s=numpy.r_[x[window_len-1:0:-1],x,x[-1:-window_len:-1]]
    #print(len(s))
    if window == 'flat': #moving average
        w=numpy.ones(window_len,'d')
    else:
        w=eval('numpy.'+window+'(window_len)')

    y=numpy.convolve(w/w.sum(),s,mode='valid')
    return y

def GetHist(filename):
	#/* -------------------------------------------------------------------- */
	#/*      Open dataset and get histogramm                                 */
	#/* -------------------------------------------------------------------- */
	hDataset = gdal.Open( filename, gdal.GA_ReadOnly )

	if hDataset is None:
		print ("Unable to open '%s'." % filename )
		stop #PREVEDERE USCITA
	else:
		hBand = hDataset.GetRasterBand(1) #GET BAND 1 od the input raster
		hist = hBand.GetDefaultHistogram(force = True, callback = gdal.TermProgress) #Get histogram of band 
		if hist is not None:
			dfMin = hist[0]
			dfMax = hist[1]
			nBucketCount = hist[2]
			panHistogram = hist[3]
		
			intervallo=(dfMax-dfMin)/nBucketCount
			val=dfMin
			xvalues=[]
			while val<dfMax:
				xvalues.append((val+(val+intervallo))/2)
				val=val+intervallo
			 
			line =[]
			for bucket in panHistogram:
				line.append(bucket)

			return xvalues, line
		else:
			return None

def GetThresh(istogramma,xarr):
	
	ist=numpy.array(istogramma)
	ist[0]=0 #Remove nodata value

	ist2t=smooth(ist) #smoothing the histogramm curve
	ist2=ist2t[(SMOOTHING_WINDOWS_LENGTH-1)/2:-(SMOOTHING_WINDOWS_LENGTH-1)/2] #remove 
	
	#compute the local minima and maximum
	a = numpy.diff(numpy.sign(numpy.diff(ist2))).nonzero()[0] + 1 # local min+max
	b = (numpy.diff(numpy.sign(numpy.diff(ist2))) > 0).nonzero()[0] + 1 # local min
	c = (numpy.diff(numpy.sign(numpy.diff(ist2))) < 0).nonzero()[0] + 1 # local max
	xval_min=xarr[b]
	yval_min=ist2[b]
	XMIN=xval_min[numpy.where(yval_min==max(yval_min))] #It is selected the local minima with the highest value.
	return XMIN,b,c

def StartModeler(model,nome):
	logging.debug(nome)
	model.Execute()
	logging.debug("finished")


def run(argsDict):
        out = {}
	
	#/* -------------------------------------------------------------------- */
	#/*      PRE_PROCESSING                                                  */
	#/* -------------------------------------------------------------------- */	

        #CREARE CARTELLA TEMP
        if not os.path.exists(TEMPDIR):
                os.makedirs(TEMPDIR)
        
	print "WD: " + os.getcwd()
	
	# map WF passed args to locally used vars
	# CAST TO **STR** TO AVOID **UNICODE** ERRORS!!!
	Input_Image = "input\\"+str(argsDict["inputSar"] )  #Input SAR image
	DEM_Image = "input\\"+str(argsDict["inputDem"] )  #Input DEM image

        SENSITIVITY = int(argsDict["inputSensitivity"] )
        
	modelFile1 = model1
	modelFile2 = model2
	modelFile3 = model3
	
	m = modeler.Solution.Load(modelFile1)


	rasterInput = next(op for op in m.GetOperators() if op.displayName == u"SAR_IMAGE")
	#Change an input to that operator
	rasterInput["Filename"] = Input_Image

	rasterOutput = next(op for op in m.GetOperators() if op.displayName == u"Output_Temp_File")
	#Change an input to that operator
	rasterOutput["FilenameIn"] = NomeFileTemp

	##delete temp file if exist
	# if os.path.isfile(NomeFileTemp) ==True:
		# os.remove(NomeFileTemp)
	# NomeRRD=NomeFileTemp[:-3]+'rrd'

	# if os.path.isfile(NomeRRD) ==True:
		# os.remove(NomeRRD)

	rasterInput2 = next(op for op in m.GetOperators() if op.displayName == u"DEM")
	# Change an input to that operator
	rasterInput2["Filename"] = DEM_Image

	scalarInput = next(op for op in m.GetOperators() if op.displayName == u"Max Slope")
	# Change an input to that operator
	scalarInput["Value"] = MAX_SLOPE

	scalarInput2 = next(op for op in m.GetOperators() if op.displayName == u"Max Value Allowed(SAR)")
	# Change an input to that operator
	scalarInput2["Value"] = SAR_MAX_VALUE_ALLOWED
	#print inspect.getmembers(rasterInput2)

	scalarInput3 = next(op for op in m.GetOperators() if op.displayName == u"Masked Value (SAR)")
	# Change an input to that operator
	scalarInput3["Value"] = SAR_MASKED_VALUE

	scalarInput3 = next(op for op in m.GetOperators() if op.displayName == u"Parameter Aspect")
	# Change an input to that operator
	scalarInput3["Value"] = PARAM_ASPECT

	#print inspect.getmembers(scalarInput2)

	# Run the model
	print 'Run model 1...'
	m.Execute()



	#/* -------------------------------------------------------------------- */
	#/*       HISTOGRAM THRESHOLD                                            */
	#/* -------------------------------------------------------------------- */

	print 'Computes Threshold...'
	xval,isto=GetHist(NomeFileTemp)
	xx=numpy.array(xval)
	Flood_Threshold,b1,c1=GetThresh(isto,xx)
	print 'Threshold value: ', Flood_Threshold[0]

	#/* -------------------------------------------------------------------- */
	#/*       POST PROCESSING                                                */
	#/* -------------------------------------------------------------------- */

	FRAZIONE=0.1
	Final_paths=[]
	threads = []

	#/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  */
	#/* TO BE MODIFIED IF A SENSITIVE INPUT PARAMETER IS INCLUDED AT THE START OF THE WORKFLOW      */
	#/*                                                                                             */
	#/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  */
	
	if SENSITIVITY>3:
		SENSITIVITY=3
	if SENSITIVITY<=0:
		SENSITIVITY=0
	
	if SENSITIVITY==0:
		GeneraImm=[1,1,1]
	else:
		GeneraImm=[0,0,0]
		GeneraImm[SENSITIVITY-1]=1
	
	
	if GeneraImm[0]==1:
		Flood_thrs=Flood_Threshold[0]
		testo='Normal'
		Final_img=Output_Image[:-4]+'_'+testo+'.img'
		Final_paths.append(Final_img)
		
	if GeneraImm[1]==1:
		Flood_thrs=Flood_Threshold[0]-Flood_Threshold[0]*FRAZIONE
		testo='Low'
		Final_img=Output_Image[:-4]+'_'+testo+'.img'
		Final_paths.append(Final_img)
		
	if GeneraImm[2]==1:
		Flood_thrs=Flood_Threshold[0]+Flood_Threshold[0]*FRAZIONE
		testo='High'
		Final_img=Output_Image[:-4]+'_'+testo+'.img'
		Final_paths.append(Final_img)
		
	
		
		
	m1=modeler.Solution.Load(modelFile2)

	rasterInput3 = next(op for op in m1.GetOperators() if op.displayName == u"Temp_File")
	# Change an input to that operator
	rasterInput3["Filename"] = NomeFileTemp

	scalarInput4 = next(op for op in m1.GetOperators() if op.displayName == u"Flood_Threshold")
	# Change an input to that operator
	scalarInput4["Value"] = Flood_thrs

	scalarInput5 = next(op for op in m1.GetOperators() if op.displayName == u"Minimum_Area_Size")
	# Change an input to that operator
	scalarInput5["Value"] = MINIMUM_MAP_SIZE   #Value in pixels

	rasterOutput2 = next(op for op in m1.GetOperators() if op.displayName == u"Raster Output")
	#Change an input to that operator
	rasterOutput2["FilenameIn"] = Final_img

	threads.append(threading.Thread(name='thread_',target=StartModeler, args=(m1,'Run model 2 version '+testo+'...',)))

	# Run the model
	MAXIMG=len(threads)
	contaThread=0

	while contaThread<MAXIMG:
		while len(threading.enumerate())<(NUMMAXTHREAD+1) and contaThread<MAXIMG:
			threads[contaThread].start()
			contaThread=contaThread+1
		sleep(1)
	while len(threading.enumerate())>1:
		sleep(1)	

		
	#/* -------------------------------------------------------------------- */
	#/*       TIFF CONVERSION                                                */
	#/* -------------------------------------------------------------------- */
	threads=[]
	Final_paths_tif=[]
	for i in Final_paths:
		
		outfile=i[:-4]+'_TIFF.tif'
		nome=os.path.basename(outfile)
		Final_paths_tif.append(outfile)
		
		
		m3 = modeler.Solution.Load(modelFile3)
		
		rasterInput6 = next(op for op in m3.GetOperators() if op.displayName == u"Raster_Input")
		# Change an input to that operator
		rasterInput6["Filename"] = i
		
		rasterOutput3 = next(op for op in m3.GetOperators() if op.displayName == u"Raster_Output")
		#Change an input to that operator
		rasterOutput3["FilenameIn"] = outfile
		
		print 'Run Tiff conversion...'
		m3.Execute()
		
	
	conta=0
	for i in Final_paths_tif:
		conta=conta+1
		out['path'+str(conta)] =i
	
	return out
	

if __name__ == '__main__':
    # if executed as script
    run("")
	#run({"inputSar":'ortho_image_20131120.img',"inputDem":'DTM_GBO_10m.img',"inputSensitivity":3})	
