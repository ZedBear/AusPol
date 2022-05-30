$(document).ready(function() {
    $.ajax({
        cache: false,
        type: "GET",
        url: "https://www.pollbludger.net/fed2022/xml/CandidatesSenate.xml",
        dataType: "xml",
        success: candidatesParser
    })
})

google.load("visualization", "1", {	packages: ["table"] })


function candidatesParser(xmlDoc) {

	///// PRELIMINARIES
	
	if (stateId != "Overview") {			
		document.querySelector("#CandidateList").innerHTML = "<h1 style='margin-top: 24px'>CANDIDATES IN BALLOT PAPER ORDER</h1><div id='TableCands'></div>"
	
	var xmlState = xmlDoc.querySelector("State[Name='" + stateId + "']")

	google.setOnLoadCallback(drawTableCands)

	///// PREVIOUS ELECTION RESULTS TABLE (drawTable)
	
	// Build data array
	
	var inputTableCands = [["Group", "Candidate"]]
	var inputGroups = xmlState.querySelectorAll("Group")
	var GroupRows = []
	var RowCount = 0
	
	for (i = 0; i < inputGroups.length; i++) {

		var inputGroup = []
		var ticket = inputGroups[i].getAttribute("Ticket")
		var group = inputGroups[i].getAttribute("Name")
		
		if (ticket == "ZZ") { ticket = "UNG" }

		inputGroup.push(ticket, group)
		inputTableCands.push(inputGroup)

		GroupRows.push(RowCount)
		RowCount += 1
		
		thisGroup = inputGroups[i].querySelectorAll("Candidate")
		
		for (ii = 0; ii < thisGroup.length; ii++) {
			var inputGroup = []
			var candidate = thisGroup[ii].getAttribute("Name")
			
			inputGroup.push("", candidate)
			inputTableCands.push(inputGroup)
			RowCount +=1
		}
		
	}
}
		
	// Execute function

	function drawTableCands() {
		
		var TableCands = new google.visualization.Table(document.getElementById("TableCands"))
		var dataTableCands = google.visualization.arrayToDataTable(inputTableCands)

		var cssClassNames = {
			"headerCell": "resultsHeadSenateCands",
			"tableRow": "resultsRowSenate"
		}
		
		for (iii = 0; iii < GroupRows.length; iii++) {
			dataTableCands.setProperty(GroupRows[iii], 0, "style", "font-weight: bold")
			dataTableCands.setProperty(GroupRows[iii], 1, "style", "font-weight: bold")
		}

		TableCands.draw(dataTableCands, {
			width: "100%",
			alternatingRowStyle: false,
			sort: "disable",
			cssClassNames: cssClassNames,
			allowHtml: true
		})
		
	}
	
}
