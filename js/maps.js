$(document).ready(function() {
    $.ajax({
        cache: false,
        type: "GET",
        url: "xml/MapsBooths.xml",
        dataType: "xml",
        success: mapParser
    })
})

function mapParser(xmlDoc) {
	
	function addListener() {
		document.getElementById("insertMap").addEventListener("click", mapSet, false)
	}

	addListener()

	function mapSet() {
		node = document.getElementById("insertMap")
		node.insertAdjacentHTML("afterend", "<div id='Map' style='width: 100%; height: 600px; margin-bottom: 3px'></div>")	
		node.remove()	

		var xmlDiv = xmlDoc.querySelector('Division[Name="' + divisionName + '"]')
		execMap(xmlDiv)
	}
}

function execMap(xmlDiv) {
	
	var booths = xmlDiv.querySelectorAll("Booth")
	var infowindow = new google.maps.InfoWindow()
	
	// Create "data" array of polling booth details 

	var data = []

	for (i = 0; i < (booths.length); i++) {
		var dataBooth = []
		let booth = booths[i].getAttribute("Name")
		let latitude = Number(booths[i].getAttribute("Latitude"))
		let longitude = Number(booths[i].getAttribute("Longitude"))
		let zIndex = Number(booths[i].getAttribute("zIndex"))
		let boothType = booths[i].getAttribute("Type")
		let size0 = Number(booths[i].querySelector("Size").childNodes[0].nodeValue)
		if (size0 < 10) {size0 = "0" + size0.toString()} else {size0 = size0.toString()}
		
		let markerURL = "https://pollbludger.net/numbers/" + booths[i].querySelector("Party").childNodes[0].nodeValue + "-" + booths[i].querySelector("TPP").childNodes[0].nodeValue + "-" + size0
		if (boothType == "Normal") {markerURL = markerURL + ".png"} else {markerURL = markerURL + "-2.png"}

		dataBooth.push(booth, latitude, longitude, zIndex, markerURL, i)
		data.push(dataBooth)
	}
	
	
	// Create markers and InfoWindow click events
	
	var Markers = {}		
	
	function setMarkers(map, locations) {

		var shape = {
		  coords: [1, 1, 1, 20, 18, 20, 18 , 1],
		  type: "poly"
		}

		for (var i = 0; i < locations.length; i++) {

			var booth = locations[i]
			var myLatLng = new google.maps.LatLng(booth[1], booth[2])
			
			var marker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				icon: booth[4],
				shape: shape,
				title: booth[0],
				zIndex: booth[3]
			})
				
			google.maps.event.addListener(marker, "click", (function(marker, i) {
					
				return function() {
					
					var selectedBooth = xmlDiv.querySelector('Booth[Name="' + marker.title + '"]')
					var divisionOld = selectedBooth.getAttribute("Old")

					if (divisionName == divisionOld) {
						var BoothName = selectedBooth.getAttribute("Name")
					} else {
						var BoothName = selectedBooth.getAttribute("Location") + " (" + divisionOld + ")"
					}
					
					var tableInsert = "<table class='infowindow'><tr><td class='boothhead' colspan='3'><b>" + BoothName + "</b></td></tr><tr><td class='voteshead' colspan='3'>Primary vote</td></tr>"
					
					var selectedPrimary = selectedBooth.querySelectorAll("Primary Party")
					
					for (var ii = 0; ii < selectedPrimary.length; ii++) {
						tableInsert += "<tr><td align='left'>" + selectedPrimary[ii].getAttribute("Name") + "</td><td>" + selectedPrimary[ii].querySelector("Votes").childNodes[0].nodeValue + "</td><td>" + selectedPrimary[ii].querySelector("VotesPC").childNodes[0].nodeValue + "%</td></tr>"
					}
					
					tableInsert += "<tr><td class='voteshead' colspan='3'>Two-party preferred</td></tr>"

					var selectedTPP = selectedBooth.querySelectorAll("TPP Party")
					
						for (var iii = 0; iii < 2; iii++) {
							tableInsert += "<tr><td align='left'>" + selectedTPP[iii].getAttribute("Name") + "</td><td>" + selectedTPP[iii].querySelector("Votes").childNodes[0].nodeValue + "</td><td>" + selectedTPP[iii].querySelector("VotesPC").childNodes[0].nodeValue + "%</td></tr>"
						}
						
					infowindow.setContent(tableInsert)
					infowindow.setOptions({minWidth: 200})
					infowindow.open(map, marker)
					
				}
					
			}) (marker, i))

			Markers[locations[i][5]] = marker

		}
			
	}
	
	
	// Execute

	$(document).ready(function(){
		initialize()
	})	

	function initialize() {
	
		var State = xmlDiv.getAttribute("State")
		var CentroidX = Number(xmlDiv.getAttribute("CentroidX"))
		var CentroidY = Number(xmlDiv.getAttribute("CentroidY"))
		var Zoom = Number(xmlDiv.getAttribute("Zoom"))
		
		var mapOptions = {
			center: new google.maps.LatLng(CentroidY, CentroidX),
			zoom: Zoom,
			controlSize: 25
		  }
		
		var map = new google.maps.Map(document.getElementById("Map"), mapOptions)
		
		if (divisionId == "Bass" | divisionId == "Fenner" | divisionId == "Flinders" | divisionId == "Franklin" | divisionId == "Leichhardt" | divisionId == "Lyons" | divisionId == "Mayo") {
			
			var newLayer2 = new google.maps.KmlLayer({
				url: "https://pollbludger.net/fed2022/kml2022/" + divisionId + "2.kml",
				zIndex: 2		
			})
			
			newLayer2.setMap(map)
			
			var newLayer1 = new google.maps.KmlLayer({
				url: "https://pollbludger.net/fed2022/kml2022/" + divisionId + "1.kml",
				zIndex: 1		
			})
			
			newLayer1.setMap(map)

		} else {

			var newLayer = new google.maps.KmlLayer({
				url: "https://pollbludger.net/fed2022/kml2022/" + divisionId + ".kml",
				zIndex: 1		
			})
			
			newLayer.setMap(map)
		}
		
		if (divisionId == "Franklin") {

			var newLayer3 = new google.maps.KmlLayer({
				url: "https://pollbludger.net/fed2022/kml2022/Franklin3.kml",
				zIndex: 3		
			})
			
			newLayer3.setMap(map)
		
		}
		
		if (State == "VIC" || State == "WA") {
			
			var oldLayer = new google.maps.KmlLayer({
				url: "https://pollbludger.net/fed2022/kml2019/" + divisionId + ".kml",
				zIndex: 2
			})
			
			oldLayer.setMap(map)
			
		}
		
		setMarkers(map, data)
		locate(0)
		
		function locate(marker_id) {
			var myMarker = Markers[marker_id]
			var markerPosition = myMarker.getPosition()
		}
	}
}
	
