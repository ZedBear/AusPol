///// The name of this file notwithstanding, it also takes care of the Details field

google.load("visualization", "1", {	packages: ["table", "corechart"] })


///// GET Sidebar.xml. 
///// NOTE THAT THE OTHER XML FILE, LineCharts.xml, GETS GOTTEN AT THE END OF THE THE sidebarParser FUNCTION, THEN FED INTO A SEPARATE "HISTORIC TWO PARTY RESULTS" FUNCTION.

$(document).ready(function() {
    $.ajax({
        cache: false,
        type: "GET",
        url: "xml/Sidebar.xml",
        dataType: "xml",
        success: sidebarParser
    })
})


function sidebarParser(xmlDoc) {
	
	///// PRELIMINARIES
	
	var xmlDiv = xmlDoc.querySelector('Division[Name="' + divisionName + '"]')
	

	//// EXECUTE CHARTS

	google.setOnLoadCallback(drawChartPrimary)
	google.setOnLoadCallback(drawChartTCP)
	google.setOnLoadCallback(drawChartTPP)
	
	if (divisionId != "Hawke") {
		google.setOnLoadCallback(drawTablePrimary)
		google.setOnLoadCallback(drawTableTCP)
	}
	
	google.setOnLoadCallback(drawEducation)
	google.setOnLoadCallback(drawMortgages)
	google.setOnLoadCallback(drawIncome)

	google.setOnLoadCallback(drawAncestry1)
	google.setOnLoadCallback(drawAncestry2)

	google.setOnLoadCallback(drawAgeDist)

	
	//// DETAILS

	var incumbent = xmlDiv.getAttribute("Incumbent")
	var margin = xmlDiv.getAttribute("Margin")
	var state = xmlDiv.getAttribute("State")
	var region = xmlDiv.getAttribute("Region")
	var enrolment = addCommas(xmlDiv.getAttribute("Enrolment"))
	var partycolor = parseColor(incumbent)
	
	if (divisionId == "Eden-Monaro" || divisionId == "Groom") {
		var detailsInsert = "<p class='seatinfo'><strong>Margin: <font color='" + partycolor + "'>" + incumbent + " " + margin + "</font>*</strong><br /><strong>Region:</strong> " + region + "<br /><strong>State:</strong> " + parseState(state) + "<br /><strong>Enrolment:</strong> " + enrolment + "</p>"
	} else {
		var detailsInsert = "<p class='seatinfo'><strong>Margin: <font color='" + partycolor + "'>" + incumbent + " " + margin + "</font></strong><br /><strong>Region:</strong> " + region + "<br /><strong>State:</strong> " + parseState(state) + "<br /><strong>Enrolment:</strong> " + enrolment + "</p>"
	}

	// if (divisionId == "Cunningham") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Sharon Bird (Labor)</strong></p>" }
	//if (divisionId == "Holt") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Anthony Byrne (Labor)</strong></p>" }
	//if (divisionId == "Spence") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Nick Champion (Labor)</strong></p>" }
	//if (divisionId == "Hunter") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Joel Fitzgibbon (Labor)</strong></p>" }
	//if (divisionId == "Fowler") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Chris Hayes (Labor)</strong></p>" }
	//if (divisionId == "Parramatta") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Julie Owens (Labor)</strong></p>" }
	//if (divisionId == "Lingiari") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Warren Snowdon (Labor)</strong></p>" }

	//if (divisionId == "Bennelong") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> John Alexander (Liberal)</strong></p>" }
	//if (divisionId == "Menzies") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Kevin Andrews (Liberal)</strong></p>" }
	//if (divisionId == "Boothby") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Nicolle Flint (Liberal)</strong></p>" }
	//if (divisionId == "Flinders") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Greg Hunt (Liberal)</strong></p>" }
	//if (divisionId == "Swan") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Steve Irons (Liberal)</strong></p>" }
	//if (divisionId == "Bowman") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Andrew Laming (Liberal National)</strong></p>" }
	//if (divisionId == "Pearce") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Christian Porter (Liberal)</strong></p>" }
	//if (divisionId == "Casey") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Tony Smith (Liberal)</strong></p>" }

	//if (divisionId == "Dawson") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> George Christensen (Liberal National)</strong></p>" }
	//if (divisionId == "Nicholls") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Damian Drum (Nationals)</strong></p>" }
	//if (divisionId == "Flynn") { detailsInsert += "<p class='seatinfo'><strong>Outgoing member:</strong> Ken O'Dowd (Liberal National)</strong></p>" }
	
	var d1 = document.getElementById("details")
	d1.insertAdjacentHTML("afterend", detailsInsert)
	
	//// PAST VOTE TABLES AND CHARTS FOR NON-NEW ELECTORATES (I.E. NOT HAWKE)
	
	if (divisionId != "Hawke") {

		var tablesInsert = "<div class='tableHead'>Primary vote</div><div id='TablePrimary' class='tableVotes'></div><div class='tableHead'>Two-candidate preferred</div><div id='TableTCP' class='tableVotes'></div>"

		var d2 = document.getElementById("tablesInsert")
		d2.insertAdjacentHTML("afterend", tablesInsert)
		
		var chartsInsert = "<h1 style='margin-top: 12px'>HISTORICAL TWO-PARTY RESULTS</h1><div id='LineHist' style='width: 370px; height: 240px;'></div>"

		var d3 = document.getElementById("chartsInsert")
		d3.insertAdjacentHTML("afterend", chartsInsert)
		
	}

	///// PREVIOUS ELECTION PRIMARY VOTE BAR CHART (drawChartPrimary)

	function drawChartPrimary() {
		
		// Build data array

		var inputBarPrimary = [["Indicator", "Votes", { role: "style" }]]
		var inputParties = xmlDiv.querySelectorAll("BarPrimary Party")
		var maxPC = 0
		var gridPrimary

		for (i = 0; i < inputParties.length; i++) {
			var inputParty = []
			let party = inputParties[i].getAttribute("Name")
			let votesPC = Number(inputParties[i].childNodes[0].nodeValue)
			if (votesPC > maxPC) {maxPC = votesPC}
			inputParty.push(parsePartyMid(party), votesPC, parseColor(party))
			inputBarPrimary.push(inputParty)
		}
		
		// Options and style

		if (maxPC >= 80) {
		  gridPrimary = 5
		} else if (maxPC >= 70) {
		  gridPrimary = 9
		} else if (maxPC >= 60) {
		  gridPrimary = 8
		} else if (maxPC >= 50) {
		  gridPrimary = 7
		} else if (maxPC >= 40) {
		  gridPrimary = 6
		} else if (maxPC >= 30) {
		  gridPrimary = 5
		} else {
		  gridPrimary = 4
		}	
		
		var barHeight
		var numBars = inputBarPrimary.length - 1
		
		if (numBars == 2) { 
			barheight = "52%" 
			document.getElementById("BarPrimary").className = "Bar2"
			}
			
		if (numBars == 3) { 
			barheight = "65%"
			document.getElementById("BarPrimary").className = "Bar3"
			}
			
		if (numBars == 4) {
			barheight = "70%" 
			document.getElementById("BarPrimary").className = "Bar4"
			}
			
		if (numBars == 5) {
			barheight = "76%"
			document.getElementById("BarPrimary").className = "Bar5"
			}
			
		if (numBars == 6) {
			barheight = "76%"
			document.getElementById("BarPrimary").className = "Bar6"
			}
			
		if (numBars == 7) {
			barheight = "76%"
			document.getElementById("BarPrimary").className = "Bar7"
			}
			
		if (state == "VIC" || state == "WA") {
			hAxisTitle1 = "Primary vote (redistribution-adjusted)"
		} else {
			hAxisTitle1 = "Primary vote"
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
			   title: hAxisTitle1,
			   textStyle: {
				  fontSize: 12
			  },
			  baseline: 0,
			  gridlines: {
				  count: gridPrimary
			  },
			titleTextStyle: {
				color: 'black',
				italic: 'false',
				fontSize: 12
				}
			}
		}
		
		// Execute
		
		var chart = new google.visualization.BarChart(document.getElementById("BarPrimary"))
		var data = google.visualization.arrayToDataTable(inputBarPrimary)

		// Add % sign in tooltip
		var formatter = new google.visualization.NumberFormat({ pattern: '##.#', suffix: '%'})
		formatter.format(data, 1)
		
		chart.draw(data, options)
	}

		
	///// PREVIOUS ELECTION TCP BAR CHART (drawChartTCP)
	
	function drawChartTCP() {

		// Build data array

		var inputBarTCP = [["Indicator", "Votes", { role: "style" }]]
		var inputTCP = xmlDiv.querySelectorAll("BarTCP Party")
		var maxPC = 0
		var gridTCP

		for (i = 0; i < 2; i++) {
			var inputParty = []
			let party = inputTCP[i].getAttribute("Name")
			let votesPC = Number(inputTCP[i].childNodes[0].nodeValue)
			if (votesPC > maxPC) {maxPC = votesPC}
			inputParty.push(parsePartyMid(party), votesPC, parseColor(party))
			inputBarTCP.push(inputParty)
		}
		
		// Options and style

		if (maxPC >= 80) {
		  gridTCP = 5
		} else if (maxPC >= 70) {
		  gridTCP = 9
		} else if (maxPC >= 60) {
		  gridTCP = 8
		} else if (maxPC >= 50) {
		  gridTCP = 7
		} else if (maxPC >= 40) {
		  gridTCP = 6
		} else if (maxPC >= 30) {
		  gridTCP = 5
		} else {
		  gridTCP = 4
		}	
		
		if (state == "VIC" || state == "WA") {
			hAxisTitle2 = "Two-candidate (redistribution-adjusted)"
		} else {
			hAxisTitle2 = "Two-candidate preferred"
		}

		var options = {
			legend: {
				position: "none"
			},
			chartArea: {
				left: 85,
				top: 0,
				bottom: 40,
				width: "65%"
			},
			vAxis: {
				textStyle: {
				  fontSize: 13
				}
			},
			hAxis: {
				title: hAxisTitle2,
				textStyle: {
					fontSize: 12
				},
				baseline: 0,
				gridlines: {
					count: gridTCP
				},
				titleTextStyle: {
					color: 'black',
					italic: 'false',
					fontSize: 12
				}
			}
		}
		
		// Execute

		var chart = new google.visualization.BarChart(document.getElementById("BarTCP"))
		var data = google.visualization.arrayToDataTable(inputBarTCP)
		
		// Add % sign in tooltip
		var formatter = new google.visualization.NumberFormat({ pattern: '##.#', suffix: '%'})
		formatter.format(data, 1)

		chart.draw(data, options)
	}
	

	///// PREVIOUS ELECTION TPP BAR CHART (drawChartTPP)
	
	function drawChartTPP() {
		
		if (xmlDiv.querySelector("BarTPP")) {

			document.getElementById("BarTPP").style.width = "370px"
			document.getElementById("BarTPP").style.height = "99px"
			document.getElementById("BarTPP").style.margin = "10px 0 0 0"
	
			// Build data array

			var inputBarTPP = [["Indicator", "Votes", { role: "style" }]]
			var inputTPP = xmlDiv.querySelectorAll("BarTPP Party")
			var maxPC = 0
			var gridTPP

			for (i = 0; i < 2; i++) {
				var inputParty = []
				let party = inputTPP[i].getAttribute("Name")
				let votesPC = Number(inputTPP[i].childNodes[0].nodeValue)
				if (votesPC > maxPC) {maxPC = votesPC}
				inputParty.push(parsePartyMid(party), votesPC, parseColor(party))
				inputBarTPP.push(inputParty)
			}
			
			// Options and style

			if (maxPC >= 80) {
			  gridTPP = 5
			} else if (maxPC >= 70) {
			  gridTPP = 9
			} else if (maxPC >= 60) {
			  gridTPP = 8
			} else if (maxPC >= 50) {
			  gridTPP = 7
			} else if (maxPC >= 40) {
			  gridTPP = 6
			} else if (maxPC >= 30) {
			  gridTPP = 5
			} else {
			  gridTPP = 4
			}	
			
			if (state == "VIC" || state == "WA") {
				hAxisTitle2 = "Two-party (redistribution-adjusted)"
			} else {
				hAxisTitle2 = "Two-party preferred"
			}

			var options = {
				legend: {
					position: "none"
				},
				chartArea: {
					left: 85,
					top: 0,
					bottom: 40,
					width: "65%"
				},
				vAxis: {
					textStyle: {
					  fontSize: 13
					}
				},
				hAxis: {
					title: hAxisTitle2,
					textStyle: {
						fontSize: 12
					},
					baseline: 0,
					gridlines: {
						count: gridTPP
					},
					titleTextStyle: {
						color: 'black',
						italic: 'false',
						fontSize: 12
					}
				}
			}
			
			// Execute

			var chart = new google.visualization.BarChart(document.getElementById("BarTPP"))
			var data = google.visualization.arrayToDataTable(inputBarTPP)

			chart.draw(data, options)
		}
	}
	

	///// PREVIOUS ELECTION PRIMARY VOTE TABLE (drawTablePrimary)

	function drawTablePrimary() {

		// Build data array

		var inputTablePrimary = [["", "#", "%", "Swing"]]
		var inputCandidates = xmlDiv.querySelectorAll("TablePrimary Candidate")
		
		for (i = 0; i < inputCandidates.length; i++) {

			var inputCandidate = []
			var candidate = inputCandidates[i].getAttribute("Name")
			var votes = Number(inputCandidates[i].querySelector("Votes").childNodes[0].nodeValue)

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputCandidates[i].querySelector("VotesPC")) {
				var votesPC = {v: 0, f: Number(inputCandidates[i].querySelector("VotesPC").childNodes[0].nodeValue).toFixed(1).toString() + "%"}
			} else {
				var votesPC = null
			}

			if (inputCandidates[i].querySelector("Swing")) {
				var swing = Number(inputCandidates[i].querySelector("Swing").childNodes[0].nodeValue)
				if (swing > 0) {swing = {v: 0, f: "+" + swing.toFixed(1) + "%"}} else {swing = {v: 0, f: swing.toFixed(1) + "%"}}
			} else {
				var swing = null
			}
			
			inputCandidate.push(candidate, votes, votesPC, swing)
			inputTablePrimary.push(inputCandidate)
		}

		var table = new google.visualization.Table(document.getElementById("TablePrimary"))
		var data = google.visualization.arrayToDataTable(inputTablePrimary)
		
		// Options and style
		
		var cssClassNames = {
			"headerCell": "resultsHead",
			"tableRow": "resultsRow"
		}

		data.setProperty(inputTablePrimary.length - 3, 0, "style", "font-weight: bold")
		data.setProperty(inputTablePrimary.length - 3, 1, "style", "font-weight: bold")
		
		var options = {
			width: "100%",
			alternatingRowStyle: false,
			sort: 'disable',
			cssClassNames: cssClassNames,
			allowHtml: true
		}
		
		// Execute

		table.draw(data, options)
	}


	///// PREVIOUS ELECTION TCP TABLE (drawTableTCP)

	function drawTableTCP() {
		
		// Build data array

		var inputTableTCP = [["", "#", "%", "Swing"]]
		var inputCandidates = xmlDiv.querySelectorAll("TableTCP Candidate")

		var votes0 = Number(inputCandidates[0].querySelector("Votes").childNodes[0].nodeValue)
		var votes1 = Number(inputCandidates[1].querySelector("Votes").childNodes[0].nodeValue)

		if (votes0 >= votes1) {
			var sortArray = [0, 1]
		} else {
			var sortArray = [1, 0]
		}
		
		for (i = 0; i < 2; i++) {

			var inputCandidate = []
			var candidate = inputCandidates[sortArray[i]].getAttribute("Name")
			var votes = Number(inputCandidates[sortArray[i]].querySelector("Votes").childNodes[0].nodeValue)

			// v: 0 fools it into thinking it's dealing with a number and aligning right
			if (inputCandidates[sortArray[i]].querySelector("VotesPC")) {
				var votesPC = {v: 0, f: Number(inputCandidates[sortArray[i]].querySelector("VotesPC").childNodes[0].nodeValue).toFixed(1).toString() + "%"}
			} else {
				var votesPC = null
			}

			if (inputCandidates[i].querySelector("Swing")) {
				var swing = Number(inputCandidates[sortArray[i]].querySelector("Swing").childNodes[0].nodeValue)
				if (swing > 0) {swing = {v: 0, f: "+" + swing.toFixed(1) + "%"}} else {swing = {v: 0, f: swing.toFixed(1) + "%"}}
			} else {
				var swing = null
			}
			
			inputCandidate.push(candidate, votes, votesPC, swing)
			inputTableTCP.push(inputCandidate)
			}
			
		// Options and style
		
		var cssClassNames = {
			"headerCell": "resultsHead",
			"tableRow": "resultsRow"
		}

		var options = {
			width: "100%",
			alternatingRowStyle: false,
			sort: "disable",
			cssClassNames: cssClassNames,
			allowHtml: true
		}
		
		// Execute

		var table = new google.visualization.Table(document.getElementById("TableTCP"))
		var data = google.visualization.arrayToDataTable(inputTableTCP)
		
		table.draw(data, options)
	}
	
	
	///// DEMOGRAPHICS
	
	/// Education
	
    function drawEducation() {

		var finSchool = Number(xmlDiv.querySelector("BarDemography FinSchool").childNodes[0].nodeValue)
		
		if (finSchool > 70) { 
			var gridlines = 9 
		} else if (finSchool > 60) {
			var gridlines = 8
		} else {
			var gridlines = 7
		}

        let data = google.visualization.arrayToDataTable([
            ["Indicator", divisionName.toUpperCase(), "AUSTRALIA"],
            ["Finished School", finSchool, 51.5]
        ])
		
        let options = {
            legend: {
                position: "none"
            },
            chartArea: {
                left: 100,
                top: 0,
                width: "65%",
                height: "57%"
            },
            vAxis: {
                textStyle: {
                    fontSize: 12
                }
            },
				hAxis: {
                title: "% of persons aged 15+",
                textStyle: {
                    fontSize: 12
                },
                baseline: 0,
                titleTextStyle: {
                    color: "black",
                    italic: "false",
                    fontSize: 12
                },
                gridlines: {
                    count: gridlines
                }
            }
        }
		
        let chart = new google.visualization.BarChart(document.getElementById("BarEducation"))
        chart.draw(data, options)
    }	

	/// Mortgages
	
    function drawMortgages() {

		var mortgages = Number(xmlDiv.querySelector("BarDemography Mortgages").childNodes[0].nodeValue)
		
		if (mortgages > 39) { 
			var gridlines = 5 
		} else {
			var gridlines = 6
		}

        let data = google.visualization.arrayToDataTable([
            ["Indicator", divisionName.toUpperCase(), "AUSTRALIA"],
            ["Mortgages", mortgages, 34.5]
        ])
		
        let options = {
            legend: {
                position: "none"
            },
            chartArea: {
                left: 100,
                top: 0,
                width: "65%",
                height: "60%"
            },
            vAxis: {
                textStyle: {
                    fontSize: 12
                }
            },
			hAxis: {
				title: "% of dwellings",
				textStyle: {
					fontSize: 12
				},
                baseline: 0,
                titleTextStyle: {
                    color: "black",
                    italic: "false",
                    fontSize: 12
                },
                gridlines: {
                    count: gridlines
                }
            }
        }
		
        let chart = new google.visualization.BarChart(document.getElementById("BarMortgages"))
        chart.draw(data, options)
    }	

	/// Income
	
    function drawIncome() {

		var income = Number(xmlDiv.querySelector("BarDemography MFY").childNodes[0].nodeValue)
		
		if (income > 2500) {
			var gridlines = 7
			var hAxisFont = 11
		} else if (income > 2000) {
			var gridlines = 6
			var hAxisFont = 12
		} else {
			var gridlines = 5
			var hAxisFont = 12
		}
		
        let data = google.visualization.arrayToDataTable([
            ["Indicator", divisionName.toUpperCase(), "AUSTRALIA"],
            ["Family Income", income, 1734]
        ])
		
        let options = {
            legend: {
                position: "none",
				textStyle: {
					fontSize: 11
				}
            },
            chartArea: {
                left: 100,
                top: 0,
                width: "65%",
                height: "50%"
            },
            vAxis: {
                textStyle: {
                    fontSize: 12
                }
            },
			hAxis: {
				title: "Median weekly $",
				textStyle: {
					fontSize: hAxisFont
				},
                baseline: 0,
                titleTextStyle: {
                    color: "black",
                    italic: "false",
                    fontSize: 12
                },
                gridlines: {
                    count: gridlines
                }
            }
        }
		
        let chart = new google.visualization.BarChart(document.getElementById("BarIncome"))
        chart.draw(data, options)
    }	

	/// Ancestry (electorate)
	
    function drawAncestry1() {
		
		let ukne = Number(xmlDiv.querySelector("Ancestry UKNE").childNodes[0].nodeValue)
		let see = Number(xmlDiv.querySelector("Ancestry SEE").childNodes[0].nodeValue)
		let esea = Number(xmlDiv.querySelector("Ancestry ESEA").childNodes[0].nodeValue)
		let isl = Number(xmlDiv.querySelector("Ancestry ISL").childNodes[0].nodeValue)
		let lt = Number(xmlDiv.querySelector("Ancestry LT").childNodes[0].nodeValue)
		let other = Number(xmlDiv.querySelector("Ancestry Other").childNodes[0].nodeValue)
		let indigenous = Number(xmlDiv.querySelector("Ancestry Indigenous").childNodes[0].nodeValue)
		
		if (divisionId == "Durack" | divisionId == "Kennedy" | divisionId == "Leichhardt" | divisionId == "Lingiari") {

			document.getElementById("ancestryLegend").src = "https://www.pollbludger.net/images/ancestry-legend-plus.png"

			var data = google.visualization.arrayToDataTable([
				['Ancestry', '%'],
				['UK/Northern Europe', ukne],
				['South/East Europe', see],
				['East/South-East Asia', esea],
				['India/Sri Lanka', isl],
				['Lebanese/Turkish', lt],
				['Other', other],
				['Indigenous', indigenous]
			])		
		
		} else {

			var data = google.visualization.arrayToDataTable([
				['Ancestry', '%'],
				['UK/Northern Europe', ukne],
				['South/East Europe', see],
				['East/South-East Asia', esea],
				['India/Sri Lanka', isl],
				['Lebanese/Turkish', lt],
				['Other', other + indigenous]
			])		
		
		}

        var options = {
            legend: 'none',
            fontSize: 10,
            tooltip: {
                text: 'percentage',
                textStyle: {
                    fontSize: 12
                },
                showColorCode: 'true'
            },
            chartArea: {
                width: '90%',
                height: '90%'
            }
        }

        var chart = new google.visualization.PieChart(document.getElementById("PieAncestry1"))

        chart.draw(data, options)
	}	

	/// Ancestry (Australia)
	
    function drawAncestry2() {
		
		if (divisionId == "Durack" | divisionId == "Kennedy" | divisionId == "Leichhardt" | divisionId == "Lingiari") {

			var data = google.visualization.arrayToDataTable([
				['Ancestry', '%'],
				['UK/Northern Europe', 79.8],
				['South/East Europe', 8.7],
				['East/South-East Asia', 7.2],
				['India/Sri Lanka', 2.7],
				['Lebanese/Turkish', 1.1],
				['Other', 9.9],
				['Indigenous', 0.5]
			])		
		
		} else {

			var data = google.visualization.arrayToDataTable([
				['Ancestry', '%'],
				['UK/Northern Europe', 79.8],
				['South/East Europe', 8.7],
				['East/South-East Asia', 7.2],
				['India/Sri Lanka', 2.7],
				['Lebanese/Turkish', 1.1],
				['Other', 10.4]
			])		
		
		}

        var options = {
            legend: 'none',
            fontSize: 10,
            tooltip: {
                text: 'percentage',
                textStyle: {
                    fontSize: 12
                },
                showColorCode: 'true'
            },
            chartArea: {
                width: '90%',
                height: '90%'
            }
        }

        var chart = new google.visualization.PieChart(document.getElementById("PieAncestry2"))

        chart.draw(data, options)
	}	

	/// Age distribution
	
    function drawAgeDist() {

		let age0 = Number(xmlDiv.querySelector("AgeDist Age0").childNodes[0].nodeValue)
		let age1 = Number(xmlDiv.querySelector("AgeDist Age1").childNodes[0].nodeValue)
		let age2 = Number(xmlDiv.querySelector("AgeDist Age2").childNodes[0].nodeValue)
		let age3 = Number(xmlDiv.querySelector("AgeDist Age3").childNodes[0].nodeValue)
		let age4 = Number(xmlDiv.querySelector("AgeDist Age4").childNodes[0].nodeValue)
		let age5 = Number(xmlDiv.querySelector("AgeDist Age5").childNodes[0].nodeValue)
		let age6 = Number(xmlDiv.querySelector("AgeDist Age6").childNodes[0].nodeValue)
		let age7 = Number(xmlDiv.querySelector("AgeDist Age7").childNodes[0].nodeValue)
		let age8 = Number(xmlDiv.querySelector("AgeDist Age8").childNodes[0].nodeValue)
		
		let ageTicks = []
		
		for (i = 0; i < ((Math.ceil(Math.max(age0, age1, age2, age3, age4, age5, age6, age7, age8) + 2) / 5) * 5) + 5; i = i + 5) {ageTicks.push(i)}

        var data = google.visualization.arrayToDataTable([
            ['Age', divisionName.toUpperCase(), 'AUSTRALIA'],
            ["0-9", age0, 12.7],
            ["10-19", age1, 12],
            ["20-29", age2, 13.8],
            ["30-39", age3, 14],
            ["40-49", age4, 13.5],
            ["50-59", age5, 12.7],
            ["60-69", age6, 10.6],
            ["70-79", age7, 6.6],
            ["80+", age8, 4]
        ])

        var options = {
            legend: {
                position: 'bottom'
            },
            hAxis: {
                textStyle: {
                    fontSize: 10
                },
			},
            vAxis: {
				ticks: ageTicks
            },
            chartArea: {
                left: 30,
                top: 10,
                width: '100%',
                height: '80%'
        },
			
		}

        var chart = new google.visualization.ColumnChart(document.getElementById("BarAge"))
        chart.draw(data, options)
    }
	
	///// GET LineCharts.xml

	if (divisionId != "Hawke") {
		$(document).ready(function() {
			$.ajax({
				cache: false,
				type: "GET",
				url: "xml/LineCharts.xml",
				dataType: "xml",
				success: lineChart
			})
		})
	}
}



///// HISTORICAL TWO-PARTY RESULTS

function lineChart(lineDoc) {
	
	var lineDiv = lineDoc.querySelector('Division[Name="' + divisionName + '"]')
	var stateId = lineDiv.getAttribute("State")

	if (stateId == "NSW") {

		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96")) { var votesA96 = Number(lineDiv.querySelector("Series[Id='1'] votesA96").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB98r")) { var votesB98r = Number(lineDiv.querySelector("Series[Id='2'] votesB98r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB01")) { var votesB01 = Number(lineDiv.querySelector("Series[Id='2'] votesB01").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB04")) { var votesB04 = Number(lineDiv.querySelector("Series[Id='2'] votesB04").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC04r")) { var votesC04r = Number(lineDiv.querySelector("Series[Id='3'] votesC04r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC07")) { var votesC07 = Number(lineDiv.querySelector("Series[Id='3'] votesC07").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD07r")) { var votesD07r = Number(lineDiv.querySelector("Series[Id='4'] votesD07r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD10")) { var votesD10 = Number(lineDiv.querySelector("Series[Id='4'] votesD10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD13")) { var votesD13 = Number(lineDiv.querySelector("Series[Id='4'] votesD13").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		var partyE1 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party1")
		var partyE2 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='5'] votesE13r")) { var votesE13r = Number(lineDiv.querySelector("Series[Id='5'] votesE13r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='5'] votesE16")) { var votesE16 = Number(lineDiv.querySelector("Series[Id='5'] votesE16").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='5'] votesE19")) { var votesE19 = Number(lineDiv.querySelector("Series[Id='5'] votesE19").childNodes[0].nodeValue) }
		var colorE1 = parseColor(partyE1)
		var colorE2 = parseColor(partyE2)
		
		if (divisionId == "Newcastle") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["1998", votesB98r, 100 - votesB98r, null, null, null, null, null, null],
				["2001", votesB01, 100 - votesB01, null, null, null, null, null, null],
				["2004", votesB04, 100 - votesB04, votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", null, null, votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, null, null, votesD13, 100 - votesD13, votesE13r, 100 - votesE13r],
				["2016", null, null, null, null, null, null, votesE16, 100 - votesE16],
				["2019", null, null, null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]

		} else if (divisionId == "Calare") {
			
			var data = google.visualization.arrayToDataTable([
				["Year", partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["2004", votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, votesD13, 100 - votesD13, votesE13r, 100 - votesE13r],
				["2016", null, null, null, null, votesE16, 100 - votesE16],
				["2019", null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
			
		} else {
			
			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["1996", votesA96, 100 - votesA96, null, null, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, votesB98r, 100 - votesB98r, null, null, null, null, null, null],
				["2001", null, null, votesB01, 100 - votesB01, null, null, null, null, null, null],
				["2004", null, null, votesB04, 100 - votesB04, votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", null, null, null, null, votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, null, null, null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, null, null, null, null, votesD13, 100 - votesD13, votesE13r, 100 - votesE13r],
				["2016", null, null, null, null, null, null, null, null, votesE16, 100 - votesE16],
				["2019", null, null, null, null, null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
		}
	}

	if (stateId == "VIC") {
		
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96")) { var votesA96 = Number(lineDiv.querySelector("Series[Id='1'] votesA96").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA01")) { var votesA01 = Number(lineDiv.querySelector("Series[Id='1'] votesA01").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB01r")) { var votesB01r = Number(lineDiv.querySelector("Series[Id='2'] votesB01r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB04")) { var votesB04 = Number(lineDiv.querySelector("Series[Id='2'] votesB04").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB07")) { var votesB07 = Number(lineDiv.querySelector("Series[Id='2'] votesB07").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB10")) { var votesB10 = Number(lineDiv.querySelector("Series[Id='2'] votesB10").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC10r")) { var votesC10r = Number(lineDiv.querySelector("Series[Id='3'] votesC10r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC13")) { var votesC13 = Number(lineDiv.querySelector("Series[Id='3'] votesC13").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC16")) { var votesC16 = Number(lineDiv.querySelector("Series[Id='3'] votesC16").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD16r")) { var votesD16r = Number(lineDiv.querySelector("Series[Id='4'] votesD16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD19")) { var votesD19 = Number(lineDiv.querySelector("Series[Id='4'] votesD19").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)
	
		if (divisionId == "Fraser") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyD1, partyD2],
				["2016", votesD16r, 100 - votesD16r],
				["2019", votesD19, 100 - votesD19]
				])
				
			var colors = [colorD1, colorD2]
				
		} else if (divisionId == "Gorton") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
				["2001", votesB01r, 100 - votesB01r, null, null, null, null],
				["2004", votesB04, 100 - votesB04, null, null, null, null],
				["2007", votesB07, 100 - votesB07, null, null, null, null],
				["2010", votesB10, 100 - votesB10, votesC10r, 100 - votesC10r, null, null],
				["2013", null, null, votesC13, 100 - votesC13, null, null],
				["2016", null, null, votesC16, 100 - votesC16, votesD16r, 100 - votesD16r],
				["2019", null, null, null, null, votesD19, 100 - votesD19]
				])
				
			var colors = [colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
				
		} else {
			
			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
				["1996", votesA96, 100 - votesA96, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, null, null, null, null, null, null],
				["2001", votesA01, 100 - votesA01, votesB01r, 100 - votesB01r, null, null, null, null],
				["2004", null, null, votesB04, 100 - votesB04, null, null, null, null],
				["2007", null, null, votesB07, 100 - votesB07, null, null, null, null],
				["2010", null, null, votesB10, 100 - votesB10, votesC10r, 100 - votesC10r, null, null],
				["2013", null, null, null, null, votesC13, 100 - votesC13, null, null],
				["2016", null, null, null, null, votesC16, 100 - votesC16, votesD16r, 100 - votesD16r],
				["2019", null, null, null, null, null, null, votesD19, 100 - votesD19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
		}
	}
	

	if (stateId == "QLD") {

		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96r")) { var votesA96r = Number(lineDiv.querySelector("Series[Id='1'] votesA96r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA01")) { var votesA01 = Number(lineDiv.querySelector("Series[Id='1'] votesA01").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB01r")) { var votesB01r = Number(lineDiv.querySelector("Series[Id='2'] votesB01r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB04")) { var votesB04 = Number(lineDiv.querySelector("Series[Id='2'] votesB04").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC04r")) { var votesC04r = Number(lineDiv.querySelector("Series[Id='3'] votesC04r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC07")) { var votesC07 = Number(lineDiv.querySelector("Series[Id='3'] votesC07").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD07r")) { var votesD07r = Number(lineDiv.querySelector("Series[Id='4'] votesD07r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD10")) { var votesD10 = Number(lineDiv.querySelector("Series[Id='4'] votesD10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD13")) { var votesD13 = Number(lineDiv.querySelector("Series[Id='4'] votesD13").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD16")) { var votesD16 = Number(lineDiv.querySelector("Series[Id='4'] votesD16").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		var partyE1 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party1")
		var partyE2 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='5'] votesE16r")) { var votesE16r = Number(lineDiv.querySelector("Series[Id='5'] votesE16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='5'] votesE19")) { var votesE19 = Number(lineDiv.querySelector("Series[Id='5'] votesE19").childNodes[0].nodeValue) }
		var colorE1 = parseColor(partyE1)
		var colorE2 = parseColor(partyE2)

		if (divisionId == "Wright") {

			var data = google.visualization.arrayToDataTable([
				["Year", partyD1, partyD2, partyE1, partyE2],
				["2007", votesD07r, 100 - votesD07r, null, null],
				["2010", votesD10, 100 - votesD10, null, null],
				["2013", votesD13, 100 - votesD13, null, null],
				["2016", votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
				["2019", null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorD1, colorD2, colorE1, colorE2]

		} else if (divisionId == "Flynn") {

			var data = google.visualization.arrayToDataTable([
				["Year", partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["2004", votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, votesD13, 100 - votesD13, null, null],
				["2016", null, null, votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
				["2019", null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]

		} else if (divisionId == "Bonner") {

			var data = google.visualization.arrayToDataTable([
				["Year", partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["2001", votesB01r, 100 - votesB01r, null, null, null, null, null, null],
				["2004", votesB04, 100 - votesB04, votesB04, 100 - votesB04, null, null, null, null],
				["2007", null, null, votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, null, null, votesD13, 100 - votesD13, null, null],
				["2016", null, null, null, null, votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
				["2019", null, null, null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
			
		} else if (divisionId == "Kennedy") {

			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["1996", votesA96r, 100 - votesA96r, null, null, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, null, null, null, null, null, null, null, null],
				["2001", votesA01, 100 - votesA01, votesB01r, 100 - votesB01r, null, null, null, null, null, null],
				["2004", null, null, votesB04, 100 - votesB04, votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", null, null, null, null, votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, null, null, null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, null, null, null, null, votesD13, 100 - votesD13, null, null],
				["2016", null, null, null, null, null, null, votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
				["2019", null, null, null, null, null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
			
		} else {

			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
				["1996", votesA96r, 100 - votesA96r, null, null, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, null, null, null, null, null, null, null, null],
				["2001", votesA01, 100 - votesA01, votesB01r, 100 - votesB01r, null, null, null, null, null, null],
				["2004", null, null, votesB04, 100 - votesB04, votesC04r, 100 - votesC04r, null, null, null, null],
				["2007", null, null, null, null, votesC07, 100 - votesC07, votesD07r, 100 - votesD07r, null, null],
				["2010", null, null, null, null, null, null, votesD10, 100 - votesD10, null, null],
				["2013", null, null, null, null, null, null, votesD13, 100 - votesD13, null, null],
				["2016", null, null, null, null, null, null, votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
				["2019", null, null, null, null, null, null, null, null, votesE19, 100 - votesE19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
		}
	}
	

	if (stateId == "WA") {
	
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96r")) { var votesA96r = Number(lineDiv.querySelector("Series[Id='1'] votesA96r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB98r")) { var votesB98r = Number(lineDiv.querySelector("Series[Id='2'] votesB98r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB01")) { var votesB01 = Number(lineDiv.querySelector("Series[Id='2'] votesB01").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB04")) { var votesB04 = Number(lineDiv.querySelector("Series[Id='2'] votesB04").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB07")) { var votesB07 = Number(lineDiv.querySelector("Series[Id='2'] votesB07").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC07r")) { var votesC07r = Number(lineDiv.querySelector("Series[Id='3'] votesC07r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC10")) { var votesC10 = Number(lineDiv.querySelector("Series[Id='3'] votesC10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC13")) { var votesC13 = Number(lineDiv.querySelector("Series[Id='3'] votesC13").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD13r")) { var votesD13r = Number(lineDiv.querySelector("Series[Id='4'] votesD13r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD16")) { var votesD16 = Number(lineDiv.querySelector("Series[Id='4'] votesD16").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD19")) { var votesD19 = Number(lineDiv.querySelector("Series[Id='4'] votesD19").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		if (divisionId == "Burt") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyD1, partyD2],
				["2013", votesD13r, 100 - votesD13r],
				["2016", votesD16, 100 - votesD16],
				["2019", votesD19, 100 - votesD19]
				])
				
			var colors = [colorD1, colorD2]
				
		} else if (divisionId == "Hasluck") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
				["2001", votesB01, 100 - votesB01, null, null, null, null],
				["2004", votesB04, 100 - votesB04, null, null, null, null],
				["2007", votesB07, 100 - votesB07, votesC07r, 100 - votesC07r, null, null],
				["2010", null, null, votesC10, 100 - votesC10, null, null],
				["2013", null, null, votesC13, 100 - votesC13, votesD13r, 100 - votesD13r],
				["2016", null, null, null, null, votesD16, 100 - votesD16],
				["2019", null, null, null, null, votesD19, 100 - votesD19]
			])

			var colors = [colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
			
		} else {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
				["1996", votesA96r, 100 - votesA96r, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, votesB98r, 100 - votesB98r, null, null, null, null],
				["2001", null, null, votesB01, 100 - votesB01, null, null, null, null],
				["2004", null, null, votesB04, 100 - votesB04, null, null, null, null],
				["2007", null, null, votesB07, 100 - votesB07, votesC07r, 100 - votesC07r, null, null],
				["2010", null, null, null, null, votesC10, 100 - votesC10, null, null],
				["2013", null, null, null, null, votesC13, 100 - votesC13, votesD13r, 100 - votesD13r],
				["2016", null, null, null, null, null, null, votesD16, 100 - votesD16],
				["2019", null, null, null, null, null, null, votesD19, 100 - votesD19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
		}
	}


	if (stateId == "SA") {
	
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96")) { var votesA96 = Number(lineDiv.querySelector("Series[Id='1'] votesA96").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB98r")) { var votesB98r = Number(lineDiv.querySelector("Series[Id='2'] votesB98r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB01")) { var votesB01 = Number(lineDiv.querySelector("Series[Id='2'] votesB01").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC01r")) { var votesC01r = Number(lineDiv.querySelector("Series[Id='3'] votesC01r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC04")) { var votesC04 = Number(lineDiv.querySelector("Series[Id='3'] votesC04").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC07")) { var votesC07 = Number(lineDiv.querySelector("Series[Id='3'] votesC07").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC10")) { var votesC10 = Number(lineDiv.querySelector("Series[Id='3'] votesC10").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD10r")) { var votesD10r = Number(lineDiv.querySelector("Series[Id='4'] votesD10r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD13")) { var votesD13 = Number(lineDiv.querySelector("Series[Id='4'] votesD13").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD16")) { var votesD16 = Number(lineDiv.querySelector("Series[Id='4'] votesD16").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		var partyE1 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party1")
		var partyE2 = lineDiv.querySelector("Series[Id='5']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='5'] votesE16r")) { var votesE16r = Number(lineDiv.querySelector("Series[Id='5'] votesE16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='5'] votesE19")) { var votesE19 = Number(lineDiv.querySelector("Series[Id='5'] votesE19").childNodes[0].nodeValue) }
		var colorE1 = parseColor(partyE1)
		var colorE2 = parseColor(partyE2)

		var data = google.visualization.arrayToDataTable([
			["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2, partyE1, partyE2],
			["1996", votesA96, 100 - votesA96, null, null, null, null, null, null, null, null],
			["1998", votesA98, 100 - votesA98, votesB98r, 100 - votesB98r, null, null, null, null, null, null],
			["2001", null, null, votesB01, 100 - votesB01, votesC01r, 100 - votesC01r, null, null, null, null],
			["2004", null, null, null, null, votesC04, 100 - votesC04, null, null, null, null],
			["2007", null, null, null, null, votesC07, 100 - votesC07, null, null, null, null],
			["2010", null, null, null, null, votesC10, 100 - votesC10, votesD10r, 100 - votesD10r, null, null],
			["2013", null, null, null, null, null, null, votesD13, 100 - votesD13, null, null],
			["2016", null, null, null, null, null, null, votesD16, 100 - votesD16, votesE16r, 100 - votesE16r],
			["2019", null, null, null, null, null, null, null, null, votesE19, 100 - votesE19]
		])
	
		var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2, colorE1, colorE2]
		
	}
	

	if (stateId == "TAS") {
	
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96")) { var votesA96 = Number(lineDiv.querySelector("Series[Id='1'] votesA96").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB98r")) { var votesB98r = Number(lineDiv.querySelector("Series[Id='2'] votesB98r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB01")) { var votesB01 = Number(lineDiv.querySelector("Series[Id='2'] votesB01").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB04")) { var votesB04 = Number(lineDiv.querySelector("Series[Id='2'] votesB04").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB07")) { var votesB07 = Number(lineDiv.querySelector("Series[Id='2'] votesB07").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC07r")) { var votesC07r = Number(lineDiv.querySelector("Series[Id='3'] votesC07r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC10")) { var votesC10 = Number(lineDiv.querySelector("Series[Id='3'] votesC10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC13")) { var votesC13 = Number(lineDiv.querySelector("Series[Id='3'] votesC13").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC16")) { var votesC16 = Number(lineDiv.querySelector("Series[Id='3'] votesC16").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD16r")) { var votesD16r = Number(lineDiv.querySelector("Series[Id='4'] votesD16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD19")) { var votesD19 = Number(lineDiv.querySelector("Series[Id='4'] votesD19").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		var data = google.visualization.arrayToDataTable([
			["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
			["1996", votesA96, 100 - votesA96, null, null, null, null, null, null],
			["1998", votesA98, 100 - votesA98, votesB98r, 100 - votesB98r, null, null, null, null],
			["2001", null, null, votesB01, 100 - votesB01, null, null, null, null],
			["2004", null, null, votesB04, 100 - votesB04, null, null, null, null],
			["2007", null, null, votesB07, 100 - votesB07, votesC07r, 100 - votesC07r, null, null],
			["2010", null, null, null, null, votesC10, 100 - votesC10, null, null],
			["2013", null, null, null, null, votesC13, 100 - votesC13, null, null],
			["2016", null, null, null, null, votesC16, 100 - votesC16, votesD16r, 100 - votesD16r],
			["2019", null, null, null, null, null, null, votesD19, 100 - votesD19]
		])

		var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
	}


	if (stateId == "ACT") {
	
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA96r")) { var votesA96r = Number(lineDiv.querySelector("Series[Id='1'] votesA96r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA98")) { var votesA98 = Number(lineDiv.querySelector("Series[Id='1'] votesA98").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA01")) { var votesA01 = Number(lineDiv.querySelector("Series[Id='1'] votesA01").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA04")) { var votesA04 = Number(lineDiv.querySelector("Series[Id='1'] votesA04").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB04r")) { var votesB04r = Number(lineDiv.querySelector("Series[Id='2'] votesB04r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB07")) { var votesB07 = Number(lineDiv.querySelector("Series[Id='2'] votesB07").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB10")) { var votesB10 = Number(lineDiv.querySelector("Series[Id='2'] votesB10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB13")) { var votesB13 = Number(lineDiv.querySelector("Series[Id='2'] votesB13").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var partyC1 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party1")
		var partyC2 = lineDiv.querySelector("Series[Id='3']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='3'] votesC13r")) { var votesC13r = Number(lineDiv.querySelector("Series[Id='3'] votesC13r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='3'] votesC16")) { var votesC16 = Number(lineDiv.querySelector("Series[Id='3'] votesC16").childNodes[0].nodeValue) }
		var colorC1 = parseColor(partyC1)
		var colorC2 = parseColor(partyC2)

		var partyD1 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party1")
		var partyD2 = lineDiv.querySelector("Series[Id='4']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='4'] votesD16r")) { var votesD16r = Number(lineDiv.querySelector("Series[Id='4'] votesD16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='4'] votesD19")) { var votesD19 = Number(lineDiv.querySelector("Series[Id='4'] votesD19").childNodes[0].nodeValue) }
		var colorD1 = parseColor(partyD1)
		var colorD2 = parseColor(partyD2)

		if (divisionId == "Bean") {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyD1, partyD2],
				["2016", votesD16r, 100 - votesD16r],
				["2019", votesD19, 100 - votesD19]
				])
				
			var colors = [colorD1, colorD2]
			
		} else {
		
			var data = google.visualization.arrayToDataTable([
				["Year", partyA1, partyA2, partyB1, partyB2, partyC1, partyC2, partyD1, partyD2],
				["1996", votesA96r, 100 - votesA96r, null, null, null, null, null, null],
				["1998", votesA98, 100 - votesA98, null, null, null, null, null, null],
				["2001", votesA01, 100 - votesA01, null, null, null, null, null, null],
				["2004", votesA04, 100 - votesA04, votesB04r, 100 - votesB04r, null, null, null, null],
				["2007", null, null, votesB07, 100 - votesB07, null, null, null, null],
				["2010", null, null, votesB10, 100 - votesB10, null, null, null, null],
				["2013", null, null, votesB13, 100 - votesB13, votesC13r, 100 - votesC13r, null, null],
				["2016", null, null, null, null, votesC16, 100 - votesC16, votesD16r, 100 - votesD16r],
				["2019", null, null, null, null, null, null, votesD19, 100 - votesD19]
			])

			var colors = [colorA1, colorA2, colorB1, colorB2, colorC1, colorC2, colorD1, colorD2]
		}
	}


	if (stateId == "NT") {
	
		var partyA1 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party1")
		var partyA2 = lineDiv.querySelector("Series[Id='1']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='1'] votesA98r")) { var votesA98r = Number(lineDiv.querySelector("Series[Id='1'] votesA98r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA01")) { var votesA01 = Number(lineDiv.querySelector("Series[Id='1'] votesA01").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA04")) { var votesA04 = Number(lineDiv.querySelector("Series[Id='1'] votesA04").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA07")) { var votesA07 = Number(lineDiv.querySelector("Series[Id='1'] votesA07").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA10")) { var votesA10 = Number(lineDiv.querySelector("Series[Id='1'] votesA10").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA13")) { var votesA13 = Number(lineDiv.querySelector("Series[Id='1'] votesA13").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='1'] votesA16")) { var votesA16 = Number(lineDiv.querySelector("Series[Id='1'] votesA16").childNodes[0].nodeValue) }
		var colorA1 = parseColor(partyA1)
		var colorA2 = parseColor(partyA2)
		
		var partyB1 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party1")
		var partyB2 = lineDiv.querySelector("Series[Id='2']").getAttribute("Party2")
		if (lineDiv.querySelector("Series[Id='2'] votesB16r")) { var votesB16r = Number(lineDiv.querySelector("Series[Id='2'] votesB16r").childNodes[0].nodeValue) }
		if (lineDiv.querySelector("Series[Id='2'] votesB19")) { var votesB19 = Number(lineDiv.querySelector("Series[Id='2'] votesB19").childNodes[0].nodeValue) }
		var colorB1 = parseColor(partyB1)
		var colorB2 = parseColor(partyB2)

		var data = google.visualization.arrayToDataTable([
			["Year", partyA1, partyA2, partyB1, partyB2],
			["2001", votesA98r, 100 - votesA98r, null, null],
			["2001", votesA01, 100 - votesA01, null, null],
			["2004", votesA04, 100 - votesA04, null, null],
			["2007", votesA07, 100 - votesA07, null, null],
			["2010", votesA10, 100 - votesA10, null, null],
			["2013", votesA13, 100 - votesA13, null, null],
			["2016", votesA16, 100 - votesA16, votesB16r, 100 - votesB16r],
			["2019", null, null, votesB19, 100 - votesB19]
		])

		var colors = [colorA1, colorA2, colorB1, colorB2]
	}

	
	var options = {

		legend: {
			position: "none"
			},
		colors: colors,
		fontSize: "11",
		hAxis: {
			format: "#"
		},
		chartArea: {
			top: 20, 
			bottom: 20, 
			left: 25, 
			height: "75%",
			width: "90%"
		}
	}

	var chart = new google.visualization.LineChart(document.getElementById("LineHist"))
	chart.draw(data, options)

}

	
///// UTILITIES

function parseColor(input) {
	if (input == "Labor") {
		output = "#DC3912"
	}
	if (input == "Liberal") {
		output = "#3366CC"
	}
	if (input == "Nationals") {
		output = "#008800"
	}
	if (input == "LNP" | input == "Liberal National" | input == "Country Liberal" | input == "CLP") {
		output = "#008080"
	}
	if (input == "Coalition") {
		output = "#008080"
	}
	if (input == "Democrats") {
		output = "#24AA96"
	}
	if (input == "KAP" | input == "Katter's Australian Party") {
		output = "#B50204"
	}
	if (input == "Independent") {
		output = "#666666"
	}
	if (input == "One Nation") {
		output = "#F36C21"
	}
	if (input == "Shooters Fishers and Farmers" | input == "Shooters") {
		output = "#CD5C5C"
	}
	if (input == "Liberal Democrats" | input == "LDP") {
		output = "#FF9900"
	}
	if (input == "Centre Alliance" | input == "CA") {
		output = "#FF6300"
	}
	if (input == "CDP") {
		output = "#800080"
	}
	if (input == "UAP") {
		output = "#CCBD00"
	}
	if (input == "SPP") {
		output = "#047E49"
	}
	if (input == "Animal Justice" | input == "AJP") {
		output = "#A52A2A"
	}
	if (input == "Science" | input == "Others") {
		output = "#808080"
	}
	if (input == "FACN") {
		output = "#4169E1"
	}
	return output
}

function parseState(input) {
	if (input == "NSW") {output = "New South Wales"}
	if (input == "VIC") {output = "Victoria"}
	if (input == "QLD") {output = "Queensland"}
	if (input == "WA") {output = "Western Australia"}
	if (input == "SA") {output = "South Australia"}
	if (input == "TAS") {output = "Tasmania"}
	if (input == "ACT") {output = "Australian Capital Territory"}
	if (input == "NT") {output = "Northern Territory"}
    return output
}

function parsePartyMid(input) {
	if (input == "Shooters Fishers and Farmers") {
		output = "Shooters"
	} else if (input == "Liberal Democrats") {
		output = "LDP"
	} else {
		output = input.slice()
	}
    return output
}

function addCommas(nStr) {
    nStr += ""
    x = nStr.split(".")
    x1 = x[0]
    x2 = x.length > 1 ? "." + x[1] : ""
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2")
    }
    return x1 + x2
}
