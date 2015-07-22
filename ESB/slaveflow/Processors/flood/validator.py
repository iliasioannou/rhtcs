# -*- coding: cp1252 -*-
import os
import datetime as dt
# inputDate     Mon May 05 00:00:00 CEST 2014
# inputZone     MinLat MaxLat MinLon MaxLon
    
inputDateFormat = "%a %b %d %H:%M:%S CEST %Y"
outDateFormat = "%d %b %Y"

#Variables to be initialised by the first Task by means of
#the initial workflow-setup, based on the service level agreement
firstYear=2006
deltatimehour=36
maxKMarea=1000
TminLat=36.6
TmaxLat=46.5
TminLon=7.5
TmaxLon=18.5

def run( argsDict ):
    #TEST EXAMPLES
    #inputZone= "40.66 40.85 9.25 9.73"
    #inputDate= "Mon May 05 00:00:00 CEST 2014"
    #inputZone="C:/pincopallino/shape.shp"

    inputDate = argsDict["inputDate"]
    inputZone = argsDict["inputZone"]
    
    out = { "errorCode": -1 }       # generic error code
    try:
        date1 = dt.datetime.strptime(inputDate, inputDateFormat) 
    except ValueError:
        print "ERROR: Invalid Date Format specified!"
        out["errorCode"] = 1        # date parsing error code
    else:
        date2 = date1 + dt.timedelta(hours=deltatimehour)
        if ( date1 > dt.datetime.now() ):
            print "ERROR: Future Date specified!"
            out["errorCode"] = 2        # future date error code
        else:
            if (date1.year < firstYear):
                print "ERROR: Too old Date specified!"
                out["errorCode"] = 3        # future date error code
            else:
                print "SUCCESS: Valid Date!"
                out["minDate"] = date1.strftime(outDateFormat)
                out["maxDate"] = date2.strftime(outDateFormat)

        #Any error occurred: exit
        if (out["errorCode"] != -1):
            return out
        
        if (inputZone[-4:] == ".shp"):
            #TO BE IMPLEMENTED IF A PATH TO A SHAPEFILE IS PASSED
            print "ERROR: shapefile not yet supported!"
            out["errorCode"] = 99        # shapefile error code
        else:
            #Converts any tabs & commas to spaces
            #-->Directly modify the global variable
            zonestring=inputZone.expandtabs(1)
            inputZone=zonestring.replace(","," ")

            elements=inputZone.split(" ")
            if len(elements) != 4:
                print "ERROR: Invalid Zone Format specified!"
                out["errorCode"] = 4        # wrong zone format error code
            else:
                #Check against allowed borders
                values=[float(i) for i in elements]
                errore=0
                if (values[0] >= values[1] or values[2] >= values[3]):
                    errore=1
                if (values[0] < TminLat or values[1] > TmaxLat or values[2] < TminLon or values[3] > TmaxLon):
                    errore=2
                if (errore == 0):
                    totalarea=(values[1]-values[0])*(values[3]-values[2])
                    #In the Italian area, 1°Lon isabout 82km and 1°Lat isabout 111km
                    totalarea=totalarea*82*111
                    if (totalarea > maxKMarea):
                        print "ERROR: Zone area too large (",int(totalarea),")!"
                        out["errorCode"] = 6        # zone area too large error code
                    else:
                        print "SUCCESS: Valid Zone!"
                        out["errorCode"] = 0        # success error code
                else:
                    print "ERROR: Invalid Zone specified: out of allowed borders!"
                    out["errorCode"] = 5        # zone out of allowed boundaries error code

    return out


if __name__ == '__main__':
    # if executed as script
    run()
