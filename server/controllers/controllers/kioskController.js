
module.exports = function (api) {

    // Developer key and id for ptv website
    var key = "d4d21114-10d3-11e6-a65e-029db85e733b";
    var developerId = 1000755;

    // Information of two train stops(Reservoir Station, Macleod Railway Station) near to Bundoora La Trobe Uni
    var train_stops = [
        {
            distance: 0.00000538514,
            lat: -37.71689,
            location_name: "Reservoir Station",
            lon: 145.006989,
            route_type: 0,
            stop_id: 1161,
            suburb: "Reservoir",
            transport_type: "train"
        },
        {
            distance: 0.00000424370228,
            lat: -37.72601,
            location_name: "Macleod Railway Station",
            lon: 145.069153,
            route_type: 0,
            stop_id: 1117,
            suburb: "Macleod",
            transport_type: "train",
        }
    ];

    // Location of La Trobe University
    var lat = -37.720616;
    var lon = 145.046309;

    // Public variables
    var max_stop_near_by = 6;
    var pt = api.ptv.createClient({ devId: developerId, key: key });
    var result;
    var curDateTime;
    var location_promises = [];

    /*
         Get the next departure services for the kiosk, and next departue page in mobile and desktop
         @return array
    */
    var _getData = function (req, callback) {
        var promises = [];
        var i = 0;
        result = [];
        location_promises = [];
        curDateTime = (new Date()).getTime();

        pt.stopsNearby(lat, lon, function (errStopsNearby, dataStopsNearby) {
            dataStopsNearby.forEach(function (topNearStop) {

                if (i < max_stop_near_by) {
                    promises.push(broadNextDeparturesSync(api.ptv.mode.bus, topNearStop, 1));
                    promises.push(broadNextDeparturesSync(api.ptv.mode.tram, topNearStop, 3));
                }
                i++;

            });

            // Add train stops
            train_stops.forEach(function (train_stop) {
                promises.push(broadNextDeparturesSync(api.ptv.mode.train, train_stop, 2));
            });

            var iResolved = 0;
            return Promise.all(promises).then(function (allResult) {
                // callback(mergeItems(allResult));
                return Promise.all(location_promises);

            }).then(function (locations_to) {
                var waypoints = [];
                for (var iLocation = 0; iLocation < locations_to.length; iLocation++) {
                    var location_to = locations_to[iLocation][0];
                    var dest_code = locations_to[iLocation][1];
                    var dest_name = locations_to[iLocation][2];

                    // No waypoints needed yet
                    if(waypoints.length < 0)
                        waypoints.push({location: location_to, stopover: false});

                    for (var iResult = 0; iResult < result.length; iResult++) {
                        if (result[iResult].dest_code == dest_code && result[iResult].dest_name == dest_name) {
                            result[iLocation].location_to = location_to;
                            result[iLocation].waypoints = waypoints;
                        }
                    }
                }
                callback(result);
            });
        });

    };

    /*
         Get the next departure synchronously
         @return array
    */
    var broadNextDeparturesSync = function (type, topNearStop, limit) {
        return new Promise(function (resolve, reject) {
            pt.broadNextDepartures(type, topNearStop.stop_id, limit, null, function (errNextDep, dataNextDeps) {
                var result = getResultArray(topNearStop, dataNextDeps, result);
                resolve(result);
            });
        });
    };

    /*
         Get the last stop location to be used in the Google map
         @return array
    */
    var getLastStopLocation = function (route_type, line_id, destination_id, dest_code, dest_name) {
        return new Promise(function (resolve, reject) {
            pt.stopsOnALine(route_type, line_id, function (errStopsOnALine, dataStopsOnALine) {
                var result = getStopsOnALineResult(dataStopsOnALine, destination_id);
                resolve([result, dest_code, dest_name]);
            });
        });
    };

    /*
         Get the list of stops in one line
         @return array
    */
    var getStopsOnALineResult = function (dataStopsOnALine, destination_id) {
        dataStopsOnALine = dataStopsOnALine || [];
        for (var iStop = 0; iStop < dataStopsOnALine.length; iStop++) {
            if (dataStopsOnALine[iStop].stop_id == destination_id) {
                return dataStopsOnALine[iStop].lat + "," + dataStopsOnALine[iStop].lon;
            }
        }
    };

    /*
         Create the array of lines and merge them together
         @return array
    */
    var getResultArray = function (topNearStop, dataNextDeps) {
        var item = null;
        dataNextDeps = dataNextDeps || [];
        dataNextDeps.forEach(function (dataNextDep) {
            var depDT = new Date(dataNextDep.time_realtime_utc || dataNextDep.time_timetable_utc);
            var depTime = depDT.getTime();
            var depMin = Math.round(Math.abs((curDateTime - depDT.getTime()) / (60 * 1000), 2));
            if (depMin < 120) {
                var found = false;

                //Search in the result, if found, try to add new stop
                var i = 0;
                result.forEach(function (foundItem) {
                    if (foundItem.dest_name === dataNextDep.platform.direction.direction_name &&
                        foundItem.dest_code === dataNextDep.platform.direction.line.line_number) {
                        found = true;

                        var foundInStop = false;
                        result[i].stops.forEach(function (stop) {
                            if (stop.id === topNearStop.stop_id &&
                                stop.name === topNearStop.location_name &&
                                stop.time === depMin &&
                                stop.dep === depTime) {
                                foundInStop = true;
                            }
                        });
                        if (!foundInStop) {
                            result[i].stops.push({
                                "id": topNearStop.stop_id,
                                "name": topNearStop.location_name,
                                "time": depMin,
                                "now": new Date(),
                                "dep": depTime
                            });
                        }

                    }
                    i++;
                });

                if (!found) {
                    location_promises.push(getLastStopLocation(dataNextDep.platform.stop.route_type, dataNextDep.platform.direction.line.line_id, dataNextDep.run.destination_id, dataNextDep.platform.direction.line.line_number, dataNextDep.platform.direction.direction_name));

                    result.push({
                        "disruptions": dataNextDep.disruptions,
                        "dest_name": dataNextDep.platform.direction.direction_name,
                        "dest_code": dataNextDep.platform.direction.line.line_number,
                        "location_from": dataNextDep.platform.stop.lat + "," + dataNextDep.platform.stop.lon,
                        "transport_type": topNearStop.transport_type,
                        "stops": [
                            {
                                "id": topNearStop.stop_id,
                                "name": topNearStop.location_name,
                                "time": depMin,
                                "now": new Date(),
                                "dep": depTime
                            }
                        ]
                    });
                }
                // item = {
                //     "dest_name": dataNextDep.platform.direction.direction_name,
                //     "dest_code": dataNextDep.platform.direction.line.line_number,
                //     "transport_type": topNearStop.transport_type,
                //     "stop_id": topNearStop.stop_id,
                //     "location_name": topNearStop.location_name,
                //     "depMin": depMin,
                //     "depTime": depTime
                // };
            }
        });
        return item;
    };

    /*
         Search the locations by keyword
         @return array
    */
    var search = function (req, callback) {
        //"/v2/nearme/latitude/-37.817993/longitude/144.981916"
        var keyword = req.body.term;
        pt.search(keyword, function (err, result) {
            if (err) {
                //  throw err;
            } else {
                var resultAuto = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].result.location_name) {
                        resultAuto.push({
                            id: result[i].result.stop_id,
                            label: result[i].result.location_name + ', ' + result[i].result.suburb,
                            value: result[i].result.location_name + ' - ' + result[i].result.lat + ',' + result[i].result.lon
                        });
                    }
                }
                if(resultAuto.length === 0){
                    resultAuto.push({
                        id: 0,
                        label: 'Sorry, cannot find any result!',
                        value: ''
                    });
                }
                callback(resultAuto);
            }
        });
    };

    /*
         Calculate and return the location of glider at the current time
         @return array
    */
    var getGliderLocation = function (req, cb) {
        var TWENTY_MIN = (20 * 60 * 1000);
        var now = new Date();
        now.setTime(now.getTime() + (11 * 60 * 60 * 1000));
        // console.log(req.body.time);
        // console.log(now);
        var gliderStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 30, 0);
        while (gliderStartTime.getTime() + TWENTY_MIN < now.getTime()) {
            gliderStartTime.setTime(gliderStartTime.getTime() + TWENTY_MIN);
        }

        // Now glider time is greater now
        var numOfStops = 10;
        var minToCycle = 14;
        var timeInEachStop = (minToCycle * 60 * 1000) / numOfStops;
        var locationOfGlider = (now.getTime() - gliderStartTime.getTime());
        var stopSeq = Math.ceil(locationOfGlider / timeInEachStop);
        if (stopSeq > 10 || stopSeq < 0)
            stopSeq = 1;

        cb({
            stop: stopSeq
        });
    };


    /*
         Get the nearBy stops at the first time when user load the plan a journey
         @return array
    */
    var _getNearBy = function (req, callback) {

        var result = [];
        var lat = req.body.lat;
        var lon = req.body.lon;

        pt.stopsNearby(lat, lon, function (errStopsNearby, dataStopsNearby) {
            callback(dataStopsNearby || []);
        });

    };

    /*
         Return the public methods
    */
    return {
        getData: _getData,
        search: search,
        getGliderLocation: getGliderLocation,
        getNearBy: _getNearBy
    };

};