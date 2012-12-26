// interface.js
// All the interface magic goes here

excludeSameCountry = true;

function updateCities(opt, country, cities) {
	opt.empty();
	opt.select2('data', {id: null, text: null});
	for (var i = 0; i < cities.length; i++) {
		var city = cities[i];
		if (data[city]["country"] == country || country == "all") {
			opt.append(
				$("<option></option>").attr("value",city).text(city+' [' + data[city]['country']  + ']')
			);
		}
	}
	updateSortedList();
}

function updateSortedList() {

		var avg_weight = $("#avgSlider").slider("option", "value");
		var min_weight = $("#minSlider").slider("option", "value");
		var max_weight = $("#maxSlider").slider("option", "value");
		var pcp_weight = $("#pcpSlider").slider("option", "value")/100;
		
		var errors = [];
		var city1 = $("#primaryCity").val();
		for (var city2 in errorTable[city1]) {
			if (city1 == city2) continue;
			var e = errorTable[city1][city2]
			var err  = e["avg"]*avg_weight + e["min"]*min_weight;
					err += e["max"]*max_weight + e["pcp"]*pcp_weight;
			if (excludeSameCountry) {
				if (data[city2]["country"] == data[city1]["country"]) continue;
			}
			errors.push([err,city2,city2+" ["+data[city2]["country"]+"]"]);
		}
		errors.sort(function(a,b) { return (a[0]-b[0]); });
		var sortList = $("#sortList");
		sortList.empty();
		for (var i = 0; i < 10; i+=2) {
			sortList.append("<li>"+errors[i  ][2]+" <span style='font-size: 60%'>("+errors[i  ][0].toFixed(0) + ")</span></li>");
			sortList.append("<li style='background-color: #EEEEEE'>"+errors[i+1][2]+" <span style='font-size: 60%'>("+errors[i+1][0].toFixed(0) + ")</span></li>");
		}
		
		var ocities = $("#otherCities").select2("val");
		var specErrors = [];
		for (var i = 0; i < ocities.length; i++) {
			var city2 = ocities[i];
			var e = errorTable[city1][city2]
			var err  = e["avg"]*avg_weight + e["min"]*min_weight;
					err += e["max"]*max_weight + e["pcp"]*pcp_weight;
			specErrors.push([err,city2,city2+" ["+data[city2]["country"]+"]"]);
		}
		specErrors.sort(function(a,b) { return (a[0]-b[0]); });
		var specList = $("#specificList");
		specList.empty();
		if (specErrors.length % 2 == 0) {
			for (var j = 0; j < specErrors.length; j+=2) {
				specList.append("<li>"+specErrors[j  ][2]+" <span style='font-size: 80%'>("+specErrors[j  ][0].toFixed(0) + ")</span></li>");
				specList.append("<li style='background-color: #EEEEEE'>"+specErrors[j+1][2]+" <span style='font-size: 80%'>("+specErrors[j+1][0].toFixed(0) + ")</span></li>");
			}
		} else {
			for (var j = 0; j < specErrors.length; j+=1) {
				specList.append("<li>"+specErrors[j  ][2]+" <span style='font-size: 80%'>("+specErrors[j  ][0].toFixed(0) + ")</span></li>");
			}
		}
}