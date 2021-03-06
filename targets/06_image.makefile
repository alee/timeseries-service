## 
## --- Targets for managing the Docker image for this REPRO ---
## 

ifndef IN_RUNNING_REPRO

start-image:            ## Start a new container using the Docker image.
	$(REPRO_RUN_COMMAND)

build-image:            ## Build the Docker image used to run this REPRO.
	docker build --build-arg MODE="${MODE}" -t ${REPRO_IMAGE} .

rebuild-image:          ## Build the Docker image without using cache.
	docker build --no-cache --build-arg MODE="${MODE}" -t ${REPRO_IMAGE} .

pull-image:             ## Pull the Docker image from Docker Hub.
	docker pull ${REPRO_IMAGE}

push-image:             ## Push the Docker image to Docker Hub.
	docker push ${REPRO_IMAGE}

endif
