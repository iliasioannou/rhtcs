@echo off

set NEST_HOME=C:\Program Files\NEST


"%NEST_HOME%\jre\bin\java.exe" ^
    -server -Xms512M -Xmx3000M -XX:PermSize=512m -XX:MaxPermSize=512m -Xverify:none ^
    -XX:+AggressiveOpts -XX:+UseFastAccessorMethods -Xconcurrentio -XX:CompileThreshold=10000 ^
    -XX:+UseParallelGC -XX:+UseNUMA -XX:+UseLoopPredicate -XX:+UseStringCache ^
    -Dceres.context=nest ^
    "-Dnest.mainClass=org.esa.beam.framework.gpf.main.Main" ^
    "-Dnest.home=%NEST_HOME%" ^
    "-Dnest.debug=false" ^
    "-Dncsa.hdf.hdflib.HDFLibrary.hdflib=%NEST_HOME%\jhdf.dll" ^
    "-Dncsa.hdf.hdf5lib.H5.hdf5lib=%NEST_HOME%\jhdf5.dll" ^
    -jar "%NEST_HOME%\bin\ceres-launcher.jar" %*

exit /B 0