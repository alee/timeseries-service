ifeq ('$(OS)', 'Windows_NT')
PWSH=powershell -noprofile -command
endif

ifeq ('$(MODE)', 'prod')
    REPRO_IMAGE=${REPRO_DOCKER_ORG}/${REPRO_NAME}:${REPRO_IMAGE_TAG}
else
    REPRO_IMAGE=${REPRO_DOCKER_ORG}/${REPRO_NAME}-repro:${REPRO_IMAGE_TAG}
endif

REPRO_DIR=/mnt/${REPRO_NAME}
REPRO_CODE_DIR=./${REPRO_CODE}/
REPRO_EXAMPLES_DIR = $(REPRO_DIR)/${REPRO_EXAMPLES}/

ifeq ('$(MODE)', 'prod')
REPRO_RUN_COMMAND=docker run -it --rm $(REPRO_DOCKER_OPTIONS)       \
                                 $(REPRO_IMAGE)
else
REPRO_RUN_COMMAND=docker run -it --rm $(REPRO_DOCKER_OPTIONS)       \
                                 --volume $(CURDIR):$(REPRO_DIR)    \
                                 $(REPRO_IMAGE)
endif

REPRO_SERVICE_COMMAND=${REPRO_DIR}/service/run.sh
REPRO_SERVICE_DEBUG_COMMAND=${REPRO_DIR}/service/debug.sh 

ifdef IN_RUNNING_REPRO
RUN_IN_REPRO=bash -ic
else
RUN_IN_REPRO=$(REPRO_RUN_COMMAND) bash -ic
endif

