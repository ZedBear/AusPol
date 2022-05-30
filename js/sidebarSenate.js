// Initialise

$(document).ready(function() {
	$.ajax({
		cache: false,
		type: "GET",
		url: "https://www.pollbludger.net/fed2022/xml/SidebarSenate.xml",
		dataType: "xml",
		success: xmlParser
	})
})

google.load("visualization", "1", {	packages: ["table", "corechart"] })


// Execute

function xmlParser(xmlDoc) {

	///// PRELIMINARIES
	
	var xmlDist = xmlDoc.querySelector("State[ID='" + stateId + "']")
	
	google.setOnLoadCallback(drawChartVotes)
	google.setOnLoadCallback(drawTableVotes)
	google.setOnLoadCallback(drawSeatsHist)
	google.setOnLoadCallback(drawVoteHist)


	///// PREVIOUS ELECTION RESULTS BAR CHART (drawChartVotes)
	
	// Build data array

	var inputBarPrev = [["Indicator", "Votes", { role: "style" }]]
	var partiesBar = xmlDist.querySelectorAll("Bar Party")
	
	for (i = 0; i < partiesBar.length; i++) {
		var dataParty = []
		let party = partiesBar[i].getAttribute("Name")
		let votesPC = Number(partiesBar[i].querySelector("VotesPC").childNodes[0].nodeValue * 100)
		dataParty.push(parsePartyMid(party), votesPC, parseColor(party))
		inputBarPrev.push(dataParty)
	}
	
	// Execute function

	function drawChartVotes() {

		var ChartVotes = new google.visualization.BarChart(document.getElementById("ChartVotes"))
		var dataChartVotes = google.visualization.arrayToDataTable(inputBarPrev)
		
		var barHeight
		var numBars = inputBarPrev.length - 1
		
		if (numBars == 2) { 
			barheight = "52%" 
			document.getElementById("ChartVotes").className = "Bar2"
			}
			
		if (numBars == 3) { 
			barheight = "65%" 
			document.getElementById("ChartVotes").className = "Bar3"
			}
			
		if (numBars == 4) {
			barheight = "70%"
			document.getElementById("ChartVotes").className = "Bar4"
			}
			
		if (numBars == 5) {
			barheight = "76%"
			document.getElementById("ChartVotes").className = "Bar5"
			}
			
		if (numBars == 6) {
			barheight = "76%"
			document.getElementById("ChartVotes").className = "Bar6"
			}
			
		if (numBars == 7) {
			barheight = "76%"
			document.getElementById("ChartVotes").className = "Bar7"
			}
			
		var options = {
			legend: {
			  position: "none"
			},
			chartArea: {
			  left: 85,
			  top: 0,
				height: barheight,
			  bottom: 40,
			   width: "65%"
			},
			vAxis: {
			  textStyle: {
				  fontSize: 13
			  }
			},
			hAxis: {
			   textStyle: {
				  fontSize: 12
			  },
			  baseline: 0,
			  gridlines: {
				  count: "5"
			  },
			}
		}

		// Add % sign in tooltip
		var formatter = new google.visualization.NumberFormat({ pattern: '##.#', suffix: '%'})
		formatter.format(dataChartVotes, 1)
		
		ChartVotes.draw(dataChartVotes, options)
	}
	
	
	///// PREVIOUS ELECTION RESULTS TABLE (drawTable)
	
	// Build data array
	
	if (stateId == "Overview") {
		
		var inputTableVotes = [["", "#", "%", "Swing", "Seats"]]
		var inputParties = xmlDist.querySelectorAll("Table Party")
		
		for (i = 0; i < inputParties.length; i++) {

			var inputParty = []
			var party = parseParty(inputParties[i].getAttribute("Name"))
			var votes = Number(inputParties[i].querySelector("Votes").childNodes[0].nodeValue)

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputParties[i].querySelector("VotesPC")) {
				var votesPC = {v: 0, f: Number(inputParties[i].querySelector("VotesPC").childNodes[0].nodeValue * 100).toFixed(1).toString() + "%"}
			} else {
				var votesPC = null
			}

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputParties[i].querySelector("Swing")) {
				var swing = Number(inputParties[i].querySelector("Swing").childNodes[0].nodeValue) * 100
				if (swing > 0) {swing = {v: 0, f: "+" + swing.toFixed(1) + "%"}} else {swing = {v: 0, f: swing.toFixed(1) + "%"}}
			} else {
				var swing = null
			}
			
			if (inputParties[i].querySelector("Seats")) {
				var seats = Number(inputParties[i].querySelector("Seats").childNodes[0].nodeValue)
			} else {
				var seats = null
			}

			inputParty.push(party, votes, votesPC, swing, seats)
			inputTableVotes.push(inputParty)
			}
		
	} else {

		var inputTableVotes = [["", "#", "%", "Swing", "Quotas", "Seats"]]
		var inputParties = xmlDist.querySelectorAll("Table Party")
		
		for (i = 0; i < inputParties.length; i++) {

			var inputParty = []
			var party = parseParty(inputParties[i].getAttribute("Name"))
			var votes = Number(inputParties[i].querySelector("Votes").childNodes[0].nodeValue)

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputParties[i].querySelector("VotesPC")) {
				var votesPC = {v: 0, f: Number(inputParties[i].querySelector("VotesPC").childNodes[0].nodeValue * 100).toFixed(1).toString() + "%"}
			} else {
				var votesPC = null
			}

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputParties[i].querySelector("Swing")) {
				var swing = Number(inputParties[i].querySelector("Swing").childNodes[0].nodeValue) * 100
				if (swing > 0) {swing = {v: 0, f: "+" + swing.toFixed(1) + "%"}} else {swing = {v: 0, f: swing.toFixed(1) + "%"}}
			} else {
				var swing = null
			}
			
			// v: 0 fools it into thinking it's dealing with a number and aligning right. The reason you want a string here is that otherwise, 0.00 results get rounded to 0.
			if (inputParties[i].querySelector("Quotas")) {
				var quotas = {v: 0, f: Number(inputParties[i].querySelector("Quotas").childNodes[0].nodeValue).toFixed(2)}
			} else {
				var quotas = null
			}

			if (inputParties[i].querySelector("Seats")) {
				var seats = Number(inputParties[i].querySelector("Seats").childNodes[0].nodeValue)
			} else {
				var seats = null
			}

			inputParty.push(party, votes, votesPC, swing, quotas, seats)
			inputTableVotes.push(inputParty)
			}
		
	}
		
	// Execute function

	function drawTableVotes() {

		var TableVotes = new google.visualization.Table(document.getElementById("TableVotes"))
		var dataTableVotes = google.visualization.arrayToDataTable(inputTableVotes)

		var cssClassNames = {
			"headerCell": "resultsHeadSenate",
			"tableRow": "resultsRowSenate"
		}

		dataTableVotes.setProperty(inputTableVotes.length - 3, 0, "style", "font-weight: bold")
		dataTableVotes.setProperty(inputTableVotes.length - 3, 1, "style", "font-weight: bold")
		
		TableVotes.draw(dataTableVotes, {
			width: "100%",
			alternatingRowStyle: false,
			sort: "disable",
			cssClassNames: cssClassNames,
			allowHtml: true
		})
	}


	///// PAST ELECTION SEATS BAR CHART (drawSeatsHist)

	/// Build data array for Seats Bar Chart

	var hist = xmlDist.querySelectorAll("VotesHist Election")
	
	var histParties = hist[0].querySelectorAll("Party")

	var inputHistSeats = []
	var partiesRef = ["Labor", "Greens", "Democrats", "Others", "NXT/CA", "JLN", "Independent", "Shooters", "PUP/UAP", "One Nation", "LNP", "CLP", "Coalition", "Nationals", "Liberal"]
	var partiesIndex = []
	var barColors = []
	
	/// Header row (parties)
	
	for (i = 0; i < histParties.length; i++) {
		partiesIndex.push(partiesRef.indexOf(histParties[i].getAttribute("Name")))
	}
	
	// Sorted parties index array: looping through this excludes redundant parties from partiesRef

	var seatsBarHeader = ["Year"]
	var partiesIndexSorted = partiesIndex.slice()
	partiesIndexSorted = partiesIndexSorted.sort(function(a, b) {return a - b})
	
	for (i of partiesIndexSorted) {
		seatsBarHeader.push(parsePartyMid(partiesRef[i]))
		barColors.push(parseColor(partiesRef[i]))
	}
	
	inputHistSeats.push(seatsBarHeader)
	
	/// Results rows
	
	// Elections held under 6x6 model

	for (i = hist.length - 1; i >= 0; i--) {	
		
		var seatsBarInsert = [hist[i].getAttribute("Year")]

		if (i == hist.length - 2) { var divisorNew = 12 } else { var divisorNew = 6 }
		
		if (stateId == "Overview") { var divisorNew = 76 }

		if (stateId == "ACT" | stateId == "NT") { var divisorNew = 2 }
		
		for (ii of partiesIndexSorted) {
			
			if (hist[i].querySelectorAll("Party")[partiesIndex.indexOf(ii)].querySelector("Seats")) {
				var jsonInsert = {v: Number(hist[i].querySelectorAll("Party")[partiesIndex.indexOf(ii)].querySelector("Seats").childNodes[0].nodeValue) / divisorNew, f: Number(hist[i].querySelectorAll("Party")[partiesIndex.indexOf(ii)].querySelector("Seats").childNodes[0].nodeValue)}
			} else {
				var jsonInsert = {v: 0, f: 0}
			}
			
			seatsBarInsert.push(jsonInsert)
		}

		inputHistSeats.push(seatsBarInsert)
	}

	/// Execute function
	
	function drawSeatsHist() {
	
		var chartSeatsHist = new google.visualization.BarChart(document.getElementById("SeatsHist"))
		var dataSeatsHist = google.visualization.arrayToDataTable(inputHistSeats)
		
		var options = {
			legend: {
				position: "none"
			},
			colors: barColors,
			chartArea: {
				left: 35,
				top: 10,
				height: "100%",
				width: "100%"
			},
			vAxis: {
				textStyle: {
				  fontSize: 11
				}
			},
			hAxis: {
				baseline: 0,
				gridlines: {
				  color: "#333"
				},
				textPosition: "none",
				ticks: [0, 0.5, 1]
			},
			isStacked: "true"
		}

		chartSeatsHist.draw(dataSeatsHist, options)
	}

	
	///// HISTORIC VOTE RESULTS LINE CHART (drawSeatsHist)
	
	var inputHistVotes = []
	var lineHeader = ["Year"]
	var lineColors = []

	for (i = 0; i < histParties.length; i++) {
		lineHeader.push(histParties[i].getAttribute("Name"))
		lineColors.push(parseColor(histParties[i].getAttribute("Name")))
	}
	
	inputHistVotes.push(lineHeader)
	
	var inputParties = xmlDist.querySelectorAll("Table Party")

	for (i = 0; i < hist.length; i++) {
	
		var lineInsert = [hist[i].getAttribute("Year")]
	
		for (ii = 0; ii < hist[i].querySelectorAll("Party").length; ii++) {
			
			if (hist[i].querySelectorAll("Party")[ii].querySelector("VotesPC")) {
				lineInsert.push({v: Number(hist[i].querySelectorAll("Party")[ii].querySelector("VotesPC").childNodes[0].nodeValue) * 100, f: (Number(hist[i].querySelectorAll("Party")[ii].querySelector("VotesPC").childNodes[0].nodeValue) * 100).toFixed(1) + "%"}) 
			} else {
				lineInsert.push(null)
			}
		}

		inputHistVotes.push(lineInsert)
	}

	function drawVoteHist() {

		var chartVotesHist = new google.visualization.LineChart(document.getElementById("VotesHist"))
		var dataVotesHist = google.visualization.arrayToDataTable(inputHistVotes)
		
		var options = {
			legend: { position: "none" },
			fontSize: "11",
			colors: lineColors,
			chartArea:{top: 20, bottom: 20, left: 20, height: "75%", width: "90%"},
			vAxis: { gridlines: { count: 6} },
			hAxis: { textStyle: { fontSize: 9 } }
		}

		chartVotesHist.draw(dataVotesHist, options)
	}
	
	}
	  

///// UTILITIES

var parseColor = function(input) {
	if (input == "Labor") {
		output = "#DC3912"
	}
	if (input == "Liberal") {
		output = "#3366CC"
	}
	if (input == "Nationals") {
		output = "#008800"
	}
	if (input == "Coalition") {
		output = "#008080"
	}
	if (input == "LNP") {
		output = "#008080"
	}
	if (input == "CLP") {
		output = "#008080"
	}
	if (input == "Greens") {
		output = "#32CD32"
	}
	if (input == "Democrats") {
		output = "#CCBD00"
	}
	if (input == "One Nation") {
		output = "#7B2A0D"
	}
	if (input == "UAP" | input == "PUP/UAP") {
		output = "#CCBD00"
	}
	if (input == "Shooters") {
		output = "#CD5C5C"
	}
	if (input == "CA" | input == "NXT/CA") {
		output = "#FF6300"
	}
	if (input == "JLN") {
		output = "#FFCB08"
	}
	if (input == "DHJ") {
		output = "#002F5D"
	}
	if (input == "Others") {
		output = "#808080"
	}
	return output
}

var parseParty = function(input) {
	if (input == "Shooters Fishers and Farmers") {
		output = "Shooters Fishers & Farmers"
	} else {
		output = input.slice()
	}	
    return output
}

var parsePartyMid = function(input) {
	if (input == "Shooters Fishers and Farmers") {
		output = "Shooters"
	} else {
		if (input == "Liberal Democrats") {
			output = "LDP"
		} else {
			output = input.slice()
		}
	}
    return output
}
