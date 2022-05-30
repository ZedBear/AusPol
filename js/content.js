$(document).ready(function() {
    $.ajax({
        cache: false,
        type: "GET",
        url: "xml/Content.xml",
        dataType: "xml",
        success: contentParser
    })
})

function contentParser(xmlDoc) {
	
	if (divisionName == "O'Connor") { divisionTitle = "O\u2019Connor" } else { divisionTitle = divisionName }
	
	var title = document.createTextNode(divisionTitle)
	document.querySelector("#title").appendChild(title)

	document.querySelector("#background").innerHTML = xmlDoc.querySelector("#" + divisionId + " background").innerHTML
	document.querySelector("#profile").innerHTML = xmlDoc.querySelector("#" + divisionId + " profile").innerHTML
	document.querySelector("#candidates").innerHTML = xmlDoc.querySelector("#" + divisionId + " candidates").innerHTML

	if (!!xmlDoc.querySelector("#" + divisionId + " update")) {			
		document.querySelector("#update").innerHTML = "<h4>Campaign update</h4>"
		var tmp = document.querySelector("#update")
		tmp.insertAdjacentHTML("beforeend", xmlDoc.querySelector("#" + divisionId + " update").innerHTML)
		}
		
	var candidatehead = document.createTextNode("Candidates in ballot paper order")

	var divisionNameUpper = divisionName.toUpperCase()
	if ( divisionNameUpper === "MCMAHON" ) { divisionNameUpper = "McMAHON" }
	
	var titleAncestry = document.createTextNode(divisionNameUpper)
	document.querySelector("#titleAncestry").appendChild(titleAncestry)

	document.querySelector("#candidatehead").appendChild(candidatehead)
	
}
