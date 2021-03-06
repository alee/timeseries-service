FROM openjdk:8-jdk-slim-buster

ARG MODE=
ENV MODE $MODE
ENV REPRO_NAME  timeseries-service
ENV REPRO_MNT   /mnt/${REPRO_NAME}
ENV REPRO_USER  repro
ENV REPRO_UID   1000
ENV REPRO_GID   1000

RUN echo "MODE=${MODE}"

RUN echo '***** Update package index *****'                                 \
 && apt -y update                                                           \
                                                                            \
 && echo '***** Install packages required for creating this image *****'    \
 && apt -y install apt-utils wget curl makepasswd                           \
                                                                            \
 &&  echo '***** Install command-line utility packages *****'               \
 && apt -y install git sudo less file tree make procps                      \
                                                                            \
 && echo '***** Install python2, pip, and numpy *****'                      \
 && apt -y install python python-pip                                        \
 && pip2 install --upgrade pip                                              \
 && pip2 install numpy

RUN echo '***** download source package for GDAL 2.1.2 *****'               \
 && mkdir -p /tmp/builds                                                    \
 && cd /tmp/builds                                                          \
 && wget http://download.osgeo.org/gdal/2.1.2/gdal-2.1.2.tar.gz             \
 && gunzip gdal-2.1.2.tar.gz                                                \
 && tar -xvvf gdal-2.1.2.tar                                                \
                                                                            \
 && echo '***** configure and build GDAL with Python2 bindings ******'      \
 && cd /tmp/builds/gdal-2.1.2                                               \
 && mkdir -p /opt/gdal                                                      \
 && ./configure --prefix /opt/gdal/gdal-2.1.2                               \
                --with-python=$(which python2)                              \
 && make install                                                            \
                                                                            \
 && if [ "$MODE" = "prod" ] ; then                                          \
    echo '**** clean up GDAL build directories *****'                       \
    && rm -rf /tmp/builds                                                   \
; fi

ENV LD_LIBRARY_PATH=/opt/gdal/gdal-2.1.2/lib/
ENV PYTHONPATH=/opt/gdal/gdal-2.1.2/lib/python2.7/site-packages/
ENV PATH=/opt/gdal/gdal-2.1.2/bin/:$PATH

RUN echo '***** Download and install maven *****'                           \
 && MAVEN_REPO=https://mirrors.gigenet.com/apache/maven/maven-3             \
 && MAVEN_VERSION=3.6.3                                                     \
 && MAVEN_RELEASE_DIR=${MAVEN_REPO}/${MAVEN_VERSION}/binaries               \
 && MAVEN_RELEASE_NAME=apache-maven-${MAVEN_VERSION}                        \
 && MAVEN_ARCHIVE=${MAVEN_RELEASE_NAME}-bin.tar.gz                          \
 && MAVEN_BIN_DIR=/opt/${MAVEN_RELEASE_NAME}/bin                            \
 && cd /opt                                                                 \
 && wget -O ${MAVEN_ARCHIVE} ${MAVEN_RELEASE_DIR}/${MAVEN_ARCHIVE}          \
 && tar -xvf ${MAVEN_ARCHIVE}                                               \
 && mv ${MAVEN_RELEASE_NAME} maven-3                                        \
 && rm ${MAVEN_ARCHIVE}

ENV PATH /opt/maven-3/bin:$PATH

COPY service /mnt/timeseries-service/service
COPY data /mnt/timeseries-service/data

RUN if [ "$MODE" = "prod" ] ; then                                          \
    echo '***** Purge log files and make service directory accesible *****' \
    && rm ${REPRO_MNT}/service/logs/*                                       \
    && chown -R ${REPRO_UID}.${REPRO_GID} ${REPRO_MNT}/service              \
; else                                                                      \
    echo '***** Download and install Node.js from NodeSource *****'         \
    && curl -sL https://deb.nodesource.com/setup_15.x | bash -              \
    && apt install -y nodejs                                                \
; fi


RUN echo '***** Add the REPRO user and group *****'                         \
    && groupadd ${REPRO_USER} --gid ${REPRO_GID}                            \
    && useradd ${REPRO_USER} --uid ${REPRO_UID} --gid ${REPRO_GID}          \
        --shell /bin/bash                                                   \
        --create-home                                                       \
        -p `echo repro | makepasswd --crypt-md5 --clearfrom - | cut -b8-`   \
    && echo "${REPRO_USER} ALL=(ALL) NOPASSWD: ALL"                         \
            > /etc/sudoers.d/${REPRO_USER}                                  \
    && chmod 0440 /etc/sudoers.d/repro

ENV HOME /home/${REPRO_USER}
ENV BASHRC ${HOME}/.bashrc
USER  ${REPRO_USER}
WORKDIR $HOME

COPY java/maven-settings.xml ${HOME}/.m2/settings.xml

RUN echo '***** Clone geoserver-loader repo and install CLI tools *****'    \
 && git clone https://github.com/openskope/geoserver-loader.git             \
 && cd geoserver-loader                                                     \
 && pip install .

RUN echo "PATH=${PATH}" >> ${BASHRC}
RUN echo "export IN_RUNNING_REPRO=${REPRO_NAME}" >> ${BASHRC}
RUN echo "cd ${REPRO_MNT}" >> ${BASHRC}

RUN echo "MODE=${MODE}"

CMD  /bin/bash -il
