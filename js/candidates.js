$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "xml/Candidates.xml",
        dataType: "xml",
        success: candParser
    })
})


function candParser(xmlDoc) {
	
	// Candidate names
	
	if (divisionName == "O’Connor") {var divisionPics = "O'Connor"} else {var divisionPics = divisionName}
	
    var xmlDiv = xmlDoc.querySelector('Division[id="' + divisionPics + '"]')
	
	var candidates = xmlDiv.querySelectorAll("Candidate")
	
	var insert = ""
	
	for (i = 0; i < candidates.length; i++) {
		
		var rank = candidates[i].getAttribute("Rank")
		
		if (rank=="1") {
			if (candidates[i].getAttribute("Incumbent") == "Y") {
				insert += "<b>" + candidates[i].querySelector("Name").childNodes[0].nodeValue + "</b><br/>" + candidates[i].querySelector("Party").childNodes[0].nodeValue + " <i>(top)</i>"
			} else {
				insert += candidates[i].querySelector("Name").childNodes[0].nodeValue + "<br/>" + candidates[i].querySelector("Party").childNodes[0].nodeValue + " <i>(top)</i>"
			}
			
		} else if (rank=="2") {
			insert += (candidates[i].querySelector("Name").childNodes[0].nodeValue + "<br/>" + candidates[i].querySelector("Party").childNodes[0].nodeValue + " <i>(centre)</i>")
			
		} else if (rank=="3") {
			insert += (candidates[i].querySelector("Name").childNodes[0].nodeValue + "<br/>" + candidates[i].querySelector("Party").childNodes[0].nodeValue + " <i>(bottom)</i>")
			
		} else {
			insert += (candidates[i].querySelector("Name").childNodes[0].nodeValue + "<br/>" + candidates[i].querySelector("Party").childNodes[0].nodeValue)
			
		}
		
		if (i < (candidates.length - 1)) {insert += "<br/><br/>"}
		
	}
	
	document.querySelector('#candidatesBox').innerHTML = insert
	
	// Picture links
	
	var pic1 = "pics/" + divisionId.toLowerCase() + "_" + partyPic(xmlDiv.querySelector("Candidate[Rank='1'] Party").childNodes[0].nodeValue) + ".jpg"
	var pic2 = "pics/" + divisionId.toLowerCase() + "_" + partyPic(xmlDiv.querySelector("Candidate[Rank='2'] Party").childNodes[0].nodeValue) + ".jpg"
	var pic3 = "pics/" + divisionId.toLowerCase() + "_" + partyPic(xmlDiv.querySelector("Candidate[Rank='3'] Party").childNodes[0].nodeValue) + ".jpg"
	
	document.getElementById("pic1").src = pic1
	document.getElementById("pic2").src = pic2
	document.getElementById("pic3").src = pic3
	
	if (candidates.length < 4) {
		document.getElementById("candidatesBox").classList.add("candidatesBoxFamily")
	} else if (candidates.length < 6) {
		document.getElementById("candidatesBox").classList.add("candidatesBoxLarge")
	} else if (candidates.length < 10) {
		document.getElementById("candidatesBox").classList.add("candidatesBoxMid")
	} else {
		document.getElementById("candidatesBox").classList.add("candidatesBoxSmall")
	}
	
}


function partyPic(input) {
    if (input == "Labor") {
        output = "alp"
    }
    if (input == "Liberal") {
        output = "lib"
    }
    if (input == "Nationals") {
        output = "nat"
    }
    if (input == "Liberal National") {
        output = "lnp"
    }
    if (input == "Country Liberals") {
        output = "clp"
    }
    if (input == "Australian Democrats") {
        output = "dem"
    }
    if (input == "Independent") {
        output = "ind"
    }
    if (input == "Katter's Australian Party") {
        output = "kap"
    }
    if (input == "Centre Alliance") {
        output = "cap"
    }
    if (input == "One Nation") {
        output = "onp"
    }
    if (input == "United Australia Party") {
        output = "uap"
    }
    if (input == "Jacqui Lambie Network") {
        output = "jln"
    }
    return output
}
