<?php
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);

$key = "d4d21114-10d3-11e6-a65e-029db85e733b"; // supplied by PTV
$developerId = 1000755; // supplied by PTV
        
$date = gmdate('Y-m-d\TH:i:s\Z');
$healthcheckurl = "/v2/healthcheck?timestamp=" . $date;
$nearmeurl = "/v2/nearme/latitude/-37.720616/longitude/145.046309";
// $stopsurl = "/v2/mode/2/line/8135/stops-for-line";
// $generalurl = "/v2/mode/2/stop/21042/departures/by-destination/limit/1";
// $specificurl = "/v2/mode/2/line/8135/stop/21042/directionid/6/departures/all/limit/1";


function generateURLWithDevIDAndKey($apiEndpoint, $developerId, $key)
{
	// append developer ID to API endpoint URL
	if (strpos($apiEndpoint, '?') > 0)
	{
		$apiEndpoint .= "&";
	}
	else
	{
		$apiEndpoint .= "?";
	}
	$apiEndpoint .= "devid=" . $developerId;
 
	// hash the endpoint URL
	$signature = strtoupper(hash_hmac("sha1", $apiEndpoint, $key, false));
 
	// add API endpoint, base URL and signature together
	return "http://timetableapi.ptv.vic.gov.au" . $apiEndpoint . "&signature=" . $signature;
}
// function drawResponse($signedUrl)
// {
//     echo "<p>$signedUrl</p>";
//     echo "<textarea rows=\"10\" cols=\"60\">";
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $signedUrl); 
//     curl_setopt($ch, CURLOPT_TIMEOUT, '3'); 
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     echo $xmlstr = curl_exec($ch); 
//     curl_close($ch);
    
//     echo "</textarea>";
// }


function get($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_TIMEOUT, '3'); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $arr = json_decode(curl_exec($ch));
    curl_close($ch);
    return $arr;
}

function drawJsonResponse()
{
    $result = array();
    
    // Get near stops
    $topNearStops = array();
    $nearStops = get(generateURLWithDevIDAndKey($GLOBALS['nearmeurl'], $GLOBALS['developerId'], $GLOBALS['key']));
    for($i=0;$i<count($nearStops) && $i < 6;$i++){
        $topNearStops[$i] = $nearStops[$i];
    }
    
    // Get broad departure
    for ($i=0; $i < count($topNearStops); $i++) {
        $topNearStop = $topNearStops[$i];
        $urlBroadNextDep = '/v2/mode/2/stop/'.$topNearStop->result->stop_id.'/departures/by-destination/limit/1';
        $broadNextDeps = get(generateURLWithDevIDAndKey($urlBroadNextDep, $GLOBALS['developerId'], $GLOBALS['key']))->values;
        
        // For each departure, add a new entity
        for ($j=0; $j < count($broadNextDeps); $j++) {
            $broadNextDep = $broadNextDeps[$j];
            
            $found = false;
            
            $now = strtotime(gmdate("Y-m-d\TH:i:s\Z"));
            $depDT = empty($broadNextDep->time_realtime_utc) ? $broadNextDep->time_timetable_utc : $broadNextDep->time_realtime_utc;
            $depTime = strtotime($depDT);
            $depMin = round(abs($depTime - $now) / 60,2);
            
            if($depMin < 120){
                for ($r=0; $r < count($result); $r++) {
                    if(strcmp($result[$r]['dest_name'],$broadNextDep->platform->direction->direction_name) == 0 && strcmp($result[$r]['dest_code'],$broadNextDep->platform->direction->line->line_number) == 0){
                        $found = true;
                        array_push($result[$r]['stops'], array(
                                                            "id"  =>  $topNearStop->result->stop_id,
                                                            "name"  =>  $topNearStop->result->location_name,
                                                            "time"  => $depMin,
                                                            "now"   => $now,
                                                            "dep"   => $depTime,
                                                            "time"  => $depMin
                                                        ));
                    }
                }
                
                if(!$found){
                    array_push($result, array(
                                        "dest_name" => $broadNextDep->platform->direction->direction_name,
                                        "dest_code" => $broadNextDep->platform->direction->line->line_number,
                                        "transport_type"=> $topNearStop->result->transport_type,
                                        "stops" =>  array(
                                            array(
                                                            "id"  =>  $topNearStop->result->stop_id,
                                                            "name"  =>  $topNearStop->result->location_name,
                                                            "time"  => $depMin,
                                                            "now"   => $now,
                                                            "dep"   => $depTime,
                                                            "time"  => $depMin
                                            )
                                        )
                    ));
                }
            }
        }
        
        
        
        
        $urlBroadNextDep = '/v2/mode/1/stop/'.$topNearStop->result->stop_id.'/departures/by-destination/limit/3';
        $broadNextDeps = get(generateURLWithDevIDAndKey($urlBroadNextDep, $GLOBALS['developerId'], $GLOBALS['key']))->values;
        // For each departure, add a new entity
        for ($j=0; $j < count($broadNextDeps); $j++) {
            $broadNextDep = $broadNextDeps[$j];
            
            $found = false;
            
            $now = strtotime(gmdate("Y-m-d\TH:i:s\Z"));
            $depDT = empty($broadNextDep->time_realtime_utc) ? $broadNextDep->time_timetable_utc : $broadNextDep->time_realtime_utc;
            $depTime = strtotime($depDT);
            $depMin = round(abs($depTime - $now) / 60,2);
            
            if($depMin < 120){
                for ($r=0; $r < count($result); $r++) {
                    if(strcmp($result[$r]['dest_name'],$broadNextDep->platform->direction->direction_name) == 0 && strcmp($result[$r]['dest_code'],$broadNextDep->platform->direction->line->line_number) == 0){
                        $found = true;
                        array_push($result[$r]['stops'], array(
                                                            "id"  =>  $topNearStop->result->stop_id,
                                                            "name"  =>  $topNearStop->result->location_name,
                                                            "time"  => $depMin,
                                                            "now"   => $now,
                                                            "dep"   => $depTime,
                                                            "time"  => $depMin
                                                        ));
                    }
                }
                
                if(!$found){
                    array_push($result, array(
                                        "dest_name" => $broadNextDep->platform->direction->direction_name,
                                        "dest_code" => $broadNextDep->platform->direction->line->line_number,
                                        "transport_type"=> $topNearStop->result->transport_type,
                                        "stops" =>  array(
                                            array(
                                                            "id"  =>  $topNearStop->result->stop_id,
                                                            "name"  =>  $topNearStop->result->location_name,
                                                            "time"  => $depMin,
                                                            "now"   => $now,
                                                            "dep"   => $depTime,
                                                            "time"  => $depMin
                                            )
                                        )
                    ));
                }
            }
        }
    }
    return $result;
}


echo json_encode(drawJsonResponse());


if(isset($_GET["all"]) && $_GET["all"] == "true"){
    ?>
    <h1>Health Check</h1>
    <?php
    $signedUrl = generateURLWithDevIDAndKey($healthcheckurl, $developerId, $key);
    drawResponse($signedUrl);
    ?>
    <h1>Near Me</h1>
    <?php
    $signedUrl = generateURLWithDevIDAndKey($nearmeurl, $developerId, $key);
    drawResponse($signedUrl);
    ?>
    <h1>Stops for Line</h1>
    <?php
    $signedUrl = generateURLWithDevIDAndKey($stopsurl, $developerId, $key);
    drawResponse($signedUrl);
    ?>
    <h1>General Next Departures</h1>
    <?php
    $signedUrl = generateURLWithDevIDAndKey($generalurl, $developerId, $key);
    drawResponse($signedUrl);
    ?>
    <h1>Specific Next Departures</h1>
    <?php
    $signedUrl = generateURLWithDevIDAndKey($specificurl, $developerId, $key);
    drawResponse($signedUrl);
}
    ?>