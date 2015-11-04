package it.planetek.rheticus.mule.components;

import it.planetek.rheticus.ShapefileImporterService;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Properties;

import org.mule.api.MuleEventContext;
import org.mule.api.lifecycle.Callable;
import org.mule.api.transport.PropertyScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class ShapefileImporterComponent
        implements Callable
    {
        protected static final Logger log = LoggerFactory.getLogger(ShapefileImporterComponent.class);

        /**
         * private Class implementing FilenameFilter for files with same name but different extension (shapefile.*)
         */
        private class ShapeFilenameFilter
                implements FilenameFilter
            {
                private final String filenameWithNoExt;


                public ShapeFilenameFilter(final String filenameWithNoExt)
                    {
                        this.filenameWithNoExt = filenameWithNoExt;
                    }


                @Override
                public boolean accept(final File dir, final String name)
                    {
                        return name.startsWith(filenameWithNoExt);
                    }
            };


        /**
         * Extract Shapefile PS data and save to ElasticSearch.
         *
         * @param eventContext
         *            the event context
         * @return shapefileNameNoExt
         */
        @Override
        public String onCall(final MuleEventContext eventContext)
            {
                // Get dp_ps properties
                final Properties psProps = eventContext.getMuleContext().getRegistry().get("psProps");

                // Get detected shape filename
                final String shapefileName = eventContext.getMessage().getProperty("originalFilename", PropertyScope.INBOUND);
                final String shapefileNameNoExt = shapefileName.substring(0, shapefileName.lastIndexOf("."));

                final String shapefileTransferDir = psProps.getProperty("ps.transfer.dir");
                final String shapefileMoveToDir = psProps.getProperty("ps.moveto.dir");

                log.info("New shapefile detected: " + shapefileNameNoExt + " in " + shapefileTransferDir);

                // Get filelist of files with the same name as the ".dbf" file, but different extension (.shx, .shp, .prj, ...)
                final File[] shapefileFiles = new File(shapefileTransferDir).listFiles(new ShapeFilenameFilter(shapefileNameNoExt));

                // Move newly arrived shape file(S) to elaboration dir
                if (!Files.exists(Paths.get(shapefileMoveToDir)))
                    {
                        try
                            {
                                // TODO: check if Files.createTempDirectory(dir, prefix, attrs) could be used to create a temp elaboration dir
                                Files.createDirectories(Paths.get(shapefileMoveToDir));
                            }
                        catch (final IOException e)
                            {
                                log.error("Cannot create elaboration dir: " + shapefileMoveToDir);
                            }
                    }
                for (final File file : shapefileFiles)
                    {
                        try
                            {
                                Files.move(Paths.get(file.getPath()), Paths.get(shapefileMoveToDir, file.getName()), StandardCopyOption.REPLACE_EXISTING);
                            }
                        catch (final IOException e)
                            {
                                log.error("Failed to move " + file.getName() + " to elaboration dir " + shapefileMoveToDir);
                            }
                    }
                log.info("Moved " + shapefileNameNoExt + ".* to elaboration dir " + shapefileMoveToDir);

                // Load Shapefile ps data into ElasticSearch
                final ShapefileImporterService importer = eventContext.getMuleContext().getRegistry().lookupObject("importer");
                // TODO: check if the regex is correctly escaped in the property file
                // importer.importFile("^(DL)([0-9]{8})$", Paths.get(shapefileMoveToDir, shapefileNameNoExt+".shp").toString());
                importer.importFile(psProps.getProperty("ps.measures.prefix"), Paths.get(shapefileMoveToDir, shapefileNameNoExt + ".shp").toString());

                /*
                 * TODO: is importFile() async? If so, how can we delete shp files, *ONLY* when importFile has finished?
                 * log.info("Deleting shape...");
                 * for(String ext : shapeExts)
                 * {
                 * Files.delete(Paths.get(shapefileOutdir, shapefileNameNoExt+ext));
                 * }
                 * log.info("Deleted");
                 */
                return shapefileNameNoExt;
            }

    }