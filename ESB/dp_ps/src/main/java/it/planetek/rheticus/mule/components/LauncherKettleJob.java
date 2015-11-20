/************************************************
 * Azienda........: Planetek Italia srl
 * Progetto.......: Rheticus
 * Data...........: 06/nov/2015
 ***********************************************/
package it.planetek.rheticus.mule.components;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.SystemUtils;
import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 * Job (Geo)Kettle Laucher
 */
public class LauncherKettleJob
        implements Callable
    {
        private static final Logger log                      = LoggerFactory.getLogger(LauncherKettleJob.class);
        private final String        CLASS_NAME               = LauncherKettleJob.class.getSimpleName() + ": ";
        private static final String PROPERTIES_FILE_NAME     = "psProps";
        private static final String SPACE                    = " ";
        private static String       QUOTE                    = "\"";
        private static final String KETTLE_JOB_EXT_WINDOWS   = ".bat";
        private static final String KETTLE_JOB_EXT_LINUX     = ".sh";

        private String              kettleInstallationFolder = "";
        private String              kettleAppName            = "";
        private String              jobFolder                = "";
        private String              jobName                  = "";
        private static String       jobLogLevel              = "";
        private String              dbHost                   = "";
        private String              dbPort                   = "";
        private String              dbName                   = "";
        private String              dbUser                   = "";
        private String              dbPassword               = "";
        private String              tablePs                  = "";
        private String              tablePsMeasure           = "";
        private String              inputFolder              = "";

        private String              datasetId                = "";
        private String              shapefileName            = "";


        @Override
        public Object onCall(final MuleEventContext eventContext)
            {
                log.info("{}Operative System is {}", CLASS_NAME, getOperativeSystemName());

                final Properties psProps = eventContext.getMuleContext().getRegistry().get(PROPERTIES_FILE_NAME);
                readFromPropertiesFile(psProps);
                logProperties();

                Object objToReturn = eventContext.getMessage();
                if (isOsWindows() || isOsLinux())
                    {
                        try
                            {
                                objToReturn = importPs(eventContext);
                            }
                        catch (final IOException e)
                            {
                                log.error("{}Error: {}", CLASS_NAME, e.getMessage());
                            }
                        catch (final InterruptedException e)
                            {
                                log.error("{}Error: {}", CLASS_NAME, e.getMessage());
                            }
                    }
                else
                    {
                        log.error("{}Operative System does not supported", CLASS_NAME);
                    }

                return objToReturn;
            }


        private boolean isOsWindows()
            {
                return (SystemUtils.IS_OS_WINDOWS || SystemUtils.IS_OS_WINDOWS_2000 || SystemUtils.IS_OS_WINDOWS_95 || SystemUtils.IS_OS_WINDOWS_98 || SystemUtils.IS_OS_WINDOWS_VISTA || SystemUtils.IS_OS_WINDOWS_XP);
            }


        private boolean isOsLinux()
            {
                return SystemUtils.IS_OS_LINUX;
            }


        private Object importPs(final MuleEventContext eventContext) throws IOException, InterruptedException
            {
                datasetId = eventContext.getMessage().getInvocationProperty("datasetId");
                shapefileName = eventContext.getMessage().getInvocationProperty("shapefileName");
                log.info("{}datasetId={}, shapefileName={}", CLASS_NAME, datasetId, shapefileName);

                final String command = createCommandToRun();
                log.info("{}command={}", CLASS_NAME, command);

                log.info("{}Starting job ...", CLASS_NAME);
                final Runtime runTime = Runtime.getRuntime();
                final Process process = runTime.exec(command);
                log.info("{}Job started", CLASS_NAME);

                final BufferedReader bri = new BufferedReader(new InputStreamReader(process.getInputStream()));
                final BufferedReader bre = new BufferedReader(new InputStreamReader(process.getErrorStream()));
                String line;
                while ((line = bri.readLine()) != null)
                    {
                        log.info("{} {}", CLASS_NAME, line);
                    }
                bri.close();
                while ((line = bre.readLine()) != null)
                    {
                        log.info("{} {}", CLASS_NAME, line);
                    }
                bre.close();

                process.waitFor();
                final int processExitValue = process.exitValue();
                log.info("{}Job finished with exit code = {}", CLASS_NAME, processExitValue);
                if (processExitValue > 0)
                    {
                        log.error("{}GeoKettle Job finished with error :-)", CLASS_NAME);
                    }
                else
                    {
                        log.info("{}GeoKettle Job finished with succesfull :-(", CLASS_NAME);
                    }
                eventContext.getMessage().setPayload(new Integer(processExitValue));
                return eventContext.getMessage();
            }


        private void readFromPropertiesFile(final Properties psProps)
            {
                kettleInstallationFolder = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.kettle.app.folder"));
                kettleAppName = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.kettle.app.name"));
                dbHost = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.host"));
                dbPort = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.port"));
                dbName = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.name"));
                dbUser = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.user"));
                dbPassword = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.password"));
                tablePs = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.table.ps"));
                tablePsMeasure = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.db.table.ps_measure"));
                inputFolder = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.folder"));
                jobFolder = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.kettle.job.folder"));
                jobName = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.kettle.job.name"));
                jobLogLevel = StringUtils.trimToEmpty(psProps.getProperty("import.shapefile.kettle.job.log.level"));
            }


        private void logProperties()
            {
                log.info("{}kettleInstallationFolder= {}", CLASS_NAME, kettleInstallationFolder);
                log.info("{}kettleAppName= {}", CLASS_NAME, kettleAppName);
                log.info("{}dbHost= {}", CLASS_NAME, dbHost);
                log.info("{}dbPort= {}", CLASS_NAME, dbPort);
                log.info("{}dbName= {}", CLASS_NAME, dbName);
                log.info("{}dbUser= {}", CLASS_NAME, dbUser);
                log.info("{}dbPassword= {}", CLASS_NAME, dbPassword);
                log.info("{}tablePs= {}", CLASS_NAME, tablePs);
                log.info("{}tablePsMeasure= {}", CLASS_NAME, tablePsMeasure);
                log.info("{}inputFolder= {}", CLASS_NAME, inputFolder);
                log.info("{}jobFolder= {}", CLASS_NAME, jobFolder);
                log.info("{}jobName= {}", CLASS_NAME, jobName);
                log.info("{}jobLogLevel= {}", CLASS_NAME, jobLogLevel);
            }


        private String createCommandToRun()
            {
                // Kitchen.bat -file="C:\rheticus\import_PS\rheticus_ps_import.kjb"
                // "-param:VAR_RHETICUS_DB_HOST=localhost"
                // "-param:VAR_RHETICUS_DB_PORT=5432" "-param:VAR_RHETICUS_DB_NAME=ps"
                // "-param:VAR_RHETICUS_DB_USER=postgres"
                // "-param:VAR_RHETICUS_DB_PASSWORD=pkadmin123"
                // "-param:VAR_RHETICUS_DB_TABLE_PS=ps"
                // "-param:VAR_RHETICUS_DB_TABLE_PS_MEASURE=ps_measure"
                // "-param:VAR_RHETICUS_IMPORT_PS_FOLDER=C:\\rheticus\\import_PS\\files"
                // "-param:VAR_DATASETID=A" "-param:VAR_SHP_NAME=PS_Sample.shp"

                createKettleAppNameForEnvironment();
                if (isOsLinux())
                    {
                        QUOTE = "";
                    }

                final StringBuffer cdToKettleFolder = new StringBuffer();
                if (isOsWindows())
                    {
                        cdToKettleFolder.append("cmd /c cd ").append(QUOTE).append(kettleInstallationFolder).append(QUOTE);
                        cdToKettleFolder.append(SPACE);
                        cdToKettleFolder.append("&&");
                        cdToKettleFolder.append(SPACE);
                    }

                final StringBuffer runKettleJob = new StringBuffer();
                if (isOsLinux())
                    {
                        runKettleJob.append(kettleInstallationFolder).append(File.separator);
                    }
                runKettleJob.append(kettleAppName);
                runKettleJob.append(SPACE);
                runKettleJob.append("-file=").append(QUOTE).append(jobFolder).append(File.separator).append(jobName).append(QUOTE);
                runKettleJob.append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_HOST=").append(dbHost);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_PORT=").append(dbPort);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_NAME=").append(dbName);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_USER=").append(dbUser);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_PASSWORD=").append(dbPassword);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_TABLE_PS=").append(tablePs);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_DB_TABLE_PS_MEASURE=").append(tablePsMeasure);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_RHETICUS_IMPORT_PS_FOLDER=").append(inputFolder);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_DATASETID=").append(datasetId);
                runKettleJob.append(QUOTE).append(SPACE).append(QUOTE);
                runKettleJob.append("-param:VAR_SHP_NAME=").append(shapefileName);
                runKettleJob.append(QUOTE).append(SPACE);
                runKettleJob.append("-level:").append(jobLogLevel);

                final StringBuffer command = new StringBuffer();
                if (isOsWindows())
                    {
                        command.append(cdToKettleFolder.toString());
                    }
                command.append(runKettleJob.toString());

                return command.toString();
            }


        private void createKettleAppNameForEnvironment()
            {
                if (isOsWindows())
                    {
                        kettleAppName = kettleAppName + KETTLE_JOB_EXT_WINDOWS;
                    }
                else if (isOsLinux())
                    {
                        kettleAppName = kettleAppName + KETTLE_JOB_EXT_LINUX;
                        QUOTE = "";
                    }
            }


        private String getOperativeSystemName()
            {
                String osName = "UNKNOW";
                if (isOsWindows())
                    {
                        osName = "WINDOWS";
                    }
                else if (isOsLinux())
                    {
                        osName = "LINUX";
                    }
                return osName;
            }

    }
