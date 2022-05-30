$(document).ready(function() {
    $.ajax({
        cache: false,
        type: "GET",
        url: "xml/ContentSenate.xml",
        dataType: "xml",
        success: contentParser
    })
})

function contentParser(xmlDoc) {
	
	document.querySelector("#profile").innerHTML = xmlDoc.querySelector("#" + stateId + " profile").innerHTML

	var title = document.createTextNode(stateName)
	document.querySelector("#title").appendChild(title)
	
}
