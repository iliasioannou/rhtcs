#! /bin/bash

echo Starting Processors stubs...
python SuperMaster/supermaster-rest.py 2>&1 | tee  sm.log &
python S1TBX/s1tbx-rest.py 2>&1 | tee s1tbx.log &
python PSinSAR/psinsar-rest.py 2>&1 | tee psinsar.log &
echo DONE
