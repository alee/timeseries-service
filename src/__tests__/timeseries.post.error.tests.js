const rest = require('rest');
const mime = require('rest/interceptor/mime');

const timeseriesServiceBase = 'http://localhost:8001/timeseries-service/api/v1';

const callRESTService =  rest.wrap(mime, { mime: 'application/json' } );

describe("When a values POST request is missing the datasetId property", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that datasetId property is not present', async function() {
        expect(response.entity.message).toBe("Required property 'datasetId' is not present");
    });    
});

describe("When a values POST request is missing the variableName property", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that variableName property is not present', async function() {
        expect(response.entity.message).toBe("Required property 'variableName' is not present");
    });    
});

describe("When a values POST request is missing the boundaryGeometry property", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that variableName property is not present', async function() {
        expect(response.entity.message).toBe("Required property 'boundaryGeometry' is not present");
    });    
});

describe("When a values POST request is missing the boundaryGeometry.type property", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		coordinates: [-123, 45]
		    	},		    	
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that boundaryGeometry.type property is not present', async function() {
        expect(response.entity.message).toBe("Required property 'boundaryGeometry.type' is not present");
    });    
});

describe("When a values POST request is missing the boundaryGeometry.coordinates property", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point'
		    	},		    	
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that boundaryGeometry.coordintes property is not present', async function() {
        expect(response.entity.message).toBe("Required property 'boundaryGeometry.coordinates' is not present");
    });    
});

describe("When a values POST request specifies an unsupported boundary geometry type", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Polygon',
		    		coordinates: [-123, 45]
		    	},		    	
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400', async function() {
        expect(response.status.code).toBe(400);
    });

    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that value for boundaryGeometry.type property is not supported', async function() {
        expect(response.entity.message).toBe("'Polygon' is not a supported value for property 'boundaryGeometry.type'");
    });    
});

describe("When a values POST request specifies coordinates outside of raster file", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-124, 45]
		    	},
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that coordinates are outside dataset coverage', async function() {
        expect(response.entity.message).toBe("Coordinates are outside region covered by the dataset");
    });
    
});

describe("When a values POST request specifies a nonexistent a dataset that does not exist", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: 'not-a-dataset',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that dataset file does not exist', async function() {
        expect(response.entity.message).toBe("Data file not-a-dataset_temp.tif does not exist on timeseries server.");
    });
    
});

describe("When a values POST request specifies a nonexistent variable for dataset", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'not-a-variable',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 0,
		    		end: 4
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that dataset file does not exist', async function() {
        expect(response.entity.message).toBe("Data file 5x5x5_not-a-variable.tif does not exist on timeseries server.");
    });
    
})


describe("When a values POST request specifies a range start outside of dataset coverage", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 5,
		    		end: 5
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that range start is outside dataset coverage', async function() {
        expect(response.entity.message).toBe("Time range start is outside coverage of dataset");
    });
    
})

describe("When a values POST request specifies a range end outside of dataset coverage", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 4,
		    		end: 5
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that range end is outside dataset coverage', async function() {
        expect(response.entity.message).toBe("Time range end is outside coverage of dataset");
    });
    
})


describe("When a values POST request specifies a range end before range start", async () => {
    
	var response;
	
	beforeAll(async () => {
		response = await callRESTService({
		    method: 'POST',
		    path: timeseriesServiceBase + '/values',
		    entity: {
		    	datasetId: '5x5x5',
		    	variableName: 'temp',
		    	boundaryGeometry: {
		    		type: 'Point',
		    		coordinates: [-123, 45]
		    	},
		    	range: {
		    		start: 4,
		    		end: 3
		    	}
		    }
		});
    });

    it ('HTTP response status code should be 400 - bad request', async function() {
        expect(response.status.code).toBe(400);
    });
    
    it ('Error summary should be bad request', async function() {
        expect(response.entity.error).toBe("Bad Request");
    });

    it ('Error message should be that range end precedes range start', async function() {
        expect(response.entity.message).toBe("Time range end is before time range start");
    });
    
})