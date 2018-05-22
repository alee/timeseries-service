SKOPE Time-Series Service
=========================

This repository contains the source code for the microservice that produces
time series displayed graphically in the SKOPE web application.  The
service is implemented in Java using the Spring Boot framework and is
REST-like.  The service invokes GDAL applications on the service host and
uses GDAL-compatible data files.  A docker image is provided for running the
microservice on any platform that supports Docker without having to install
Java, GDAL, or any other applications on the host.

<!-- This README describes how to configure and run the service; how to invoke the
service using REST calls; and how to build the software, run the service
in a debugger, and perform a set of automated tests on the running service 
during development. -->

Running the Service
-------------------
The recommended way to run the Time-Series Service is using the
[openskope/timeseries-service](https://hub.docker.com/r/openskope/timeseries-service/) 
docker image via Docker Compose.  To start the service run the following command in a 
directory containing a `docker-compose.yml` file:


```
docker-compose up
```

The following is an example of a valid `docker-compose.yml` file for running the timeseries service:

```
version: '3.2'

services:

  timeseries-service:
    image: openskope/timeseries-service:latest
    command: start
    restart: always
    environment:
      TIMESERIES_DATA_PATH_TEMPLATE: /data/{datasetId}_{variableName}
      TIMESERIES_UNCERTAINTY_PATH_TEMPLATE: /data/{datasetId}_{variableName}_uncertainty
      TIMESERIES_DATA_FILE_EXTENSIONS: .tif .nc .nc4
      TIMESERIES_MAX_PROCESSING_TIME: '5000'
    ports: 
      - 8001:8000
    volumes:
      - /data:/project/data
```


Configuring the service
-----------------------
The configuration of the timeseries service can be customized via settings in the `docker-compose.yml` file.

#### Specify the port on which the service should be exposed
The timeseries service listens on port 8001 within the running Docker container.   To expose the service outside the container map this port to a port on the host using the `ports` property of the service in the `docker-compose.yml` file as shown in the example above.  In this example the service is exposed on port 8000 of the host.

#### Provide access to data files stored on the host
To make data files on the host accessible to the service running in the docker container, use the `volumes` property in the `docker-compose.yml` file.  In the example above, the host `/data` directory is made available within the container at `/project/data`.

#### Declare the location and naming scheme for data files
A single data file must be provided for each variable of each data set made available via the timeseries service.  The naming convention for these files, and their location on the filesystem (as viewed from within the running container) are specified using the TIMESERIES_DATA_PATH_TEMPLATE environment variable.  This variable may be assigned a value in the `docker-compose.yml` file as shown in the example above.

The value given to this environment must represent a filepath template containing two variables, `datasetId` and `variableName`. Each variable must appear in curly braces in the path template, either as part of one of the directory names or in the filename portion of the template.  When a request for a time series from a particular dataset and variable is received by the service, it will expand the data path template using the requested dataset ID and variable name to locate the relevant data file.

The service first will try to find a file with a name that exactly matches the expanded data path template.  If this file does not exist then the service will try alterative file names formed by appending the data file extensions specified by `TIMESERIES_DATA_FILE_EXTENSIONS` environment variable.  This allows the service to use a single data path template with a set of files with different extensions.  In the example above, the data files may end with `.tif`, `.nc`, or `nc4.`

#### Optionally declare the location of data uncertainties
If the the TIMESERIES_UNCERTAINTY_PATH_TEMPLATE variable is assigned a value, the service will use this value as a file path template for finding data files containing the uncertainties associated with each value in the main data file for that variable.  The `datasetId` and `variableName` template variables must be used in this template as well, and the extensions declared via the `TIMESERIES_DATA_FILE_EXTENSIONS` environment variable will be used when matching these files.

#### Specify the timeout value for querying data files
The service invokes GDAL applications to read data files.  The `TIMESERIES_MAX_PROCESSING_TIME` environment variable sets the maximum time allowed, in milliseconds, for executions of these applications.  The service will kill any process that takes longer than this timeout value and return an error to the client.  The default value is 5000 ms.










