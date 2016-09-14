
module.exports = function (api) {


    var key = "d4d21114-10d3-11e6-a65e-029db85e733b";
    var developerId = 1000755;

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
    var lat = -37.720616;
    var lon = 145.046309;
    var max_stop_near_by = 6;
    var pt = api.ptv.createClient({ devId: developerId, key: key });
    var result;
    var curDateTime;

    var _getData = function (req, callback) {
        var promises = [];
        var i = 0;
        result = [];
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

            return Promise.all(promises).then(function (allResult) {
                // callback(mergeItems(allResult));
                callback(result);
            });
        });

    };

    var mergeItems = function (items) {
        var newItems = [];
        items.forEach(function (item) {
            if (item) {
                var found = false;

                //  Search in the result, if found, try to add new stop
                var i = 0;
                newItems.forEach(function (foundItem) {
                    if (foundItem.dest_name === item.dest_name &&
                        foundItem.dest_code === item.dest_code) {
                        found = true;

                        var foundInStop = false;
                        newItems[i].stops.forEach(function (stop) {
                            if (stop.id === item.stop_id &&
                                stop.name === item.location_name &&
                                stop.time === item.depMin &&
                                stop.dep === item.depTime) {
                                foundInStop = true;
                            }
                        });
                        if (!foundInStop) {
                            newItems[i].stops.push({
                                "id": item.stop_id,
                                "name": item.location_name,
                                "time": item.depMin,
                                "now": new Date(),
                                "dep": item.depTime
                            });
                        }
                    }
                    i++;
                });

                if (!found) {
                    newItems.push({
                        "dest_name": item.dest_name,
                        "dest_code": item.dest_code,
                        "transport_type": item.transport_type,
                        "stops": [
                            {
                                "id": item.stop_id,
                                "name": item.location_name,
                                "time": item.depMin,
                                "now": new Date(),
                                "dep": item.depTime
                            }
                        ]
                    });
                }
            }
        });

        return newItems;
    };

    var broadNextDeparturesSync = function (type, topNearStop, limit) {
        return new Promise(function (resolve, reject) {
            pt.broadNextDepartures(type, topNearStop.stop_id, limit, null, function (errNextDep, dataNextDeps) {
                var result = getResultArray(topNearStop, dataNextDeps, result);
                resolve(result);
            });
        });
    };

    var getResultArray = function (topNearStop, dataNextDeps) {
        var item = null;
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
                    result.push({
                        "dest_name": dataNextDep.platform.direction.direction_name,
                        "dest_code": dataNextDep.platform.direction.line.line_number,
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

    var testMethod = function (req, callback) {
        //"/v2/nearme/latitude/-37.817993/longitude/144.981916"
        var keyword = req.body.keyword; // $_POST["keyword"]
        var name = req.body.name; // $_POST["keyword"]
        pt.search(keyword, function (err, result) {
            if (err) {
                throw err;
            }
            callback(result);
        });
    };

    return {
        getData: _getData,
        testMethod: testMethod
    };

};