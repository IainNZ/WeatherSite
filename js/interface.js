// interface.js
// All the interface magic goes here

countriesMode = 2; // 0 all, 1 same, 2 other

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

function updateSpecificCompare() {
	var city1 = $("#primaryCity").val();
	var city2 = $("#secondCity").val();
	
}

function updateSortedList() {

	var avg_weight = $("#avgSlider").slider("option", "value");
	var pcp_weight = $("#pcpSlider").slider("option", "value");
	var rds_weight = $("#rdsSlider").slider("option", "value");
	var sun_weight = $("#sunSlider").slider("option", "value");
		
	var errors = [];
	var city1 = $("#primaryCity").val();
	for (var city2 in errorTable[city1]) {
		if (city1 == city2) continue;
		var e = errorTable[city1][city2]
		var err = 0;
		err += e["avgtemp" ]*avg_weight;
		err += e["raindays"]*rds_weight;
		err += e["rainfall"]*pcp_weight;
		
		if (countriesMode == 0) { // All
			// Do nothing
		} else if (countriesMode == 1) { // Same only
			if (data[city2]["country"] != data[city1]["country"]) continue;
			if (data[city1]["country"] == "NZ") {
				err += e["sunhours"]*sun_weight;
			}
		} else {
			if (data[city2]["country"] == data[city1]["country"]) continue;
		}
		
		errors.push([err,city2,city2+" ["+data[city2]["country"]+"]"]);
	}
	errors.sort(function(a,b) { return (a[0]-b[0]); });
	var sortList = $("#sortList");
	sortList.empty();
	for (var i = 0; i < 10; i+=2) {
		var city2 = errors[i][1];
		var errTxt = errors[i][0].toFixed(0);
		errTxt += "="
		errTxt +=     avg_weight.toFixed(0)+"x"+errorTable[city1][city2]["avgtemp" ].toFixed(0);
		errTxt += "+"+pcp_weight.toFixed(0)+"x"+errorTable[city1][city2]["rainfall"].toFixed(0);
		errTxt += "+"+rds_weight.toFixed(0)+"x"+errorTable[city1][city2]["raindays"].toFixed(0);
		if (data[city1]["country"] == "NZ" && data[city2]["country"] == "NZ") {
			errTxt += "+"+sun_weight.toFixed(0)+"x"+errorTable[city1][city2]["sunhours"].toFixed(0);
		}
		sortList.append("<li>"+errors[i][2]+" <span style='font-size: 60%'>("+errTxt+")</span></li>");
		
		city2 = errors[i+1][1];
		errTxt = errors[i+1][0].toFixed(0);
		errTxt += "="
		errTxt +=     avg_weight.toFixed(0)+"x"+errorTable[city1][city2]["avgtemp"].toFixed(0);
		errTxt += "+"+pcp_weight.toFixed(0)+"x"+errorTable[city1][city2]["rainfall"].toFixed(0);
		errTxt += "+"+rds_weight.toFixed(0)+"x"+errorTable[city1][city2]["raindays"].toFixed(0);
		if (data[city1]["country"] == "NZ" && data[city2]["country"] == "NZ") {
			errTxt += "+"+sun_weight.toFixed(0)+"x"+errorTable[city1][city2]["sunhours"].toFixed(0);
		}
		sortList.append("<li style='background-color: #EEEEEE'>"+errors[i+1][2]+" <span style='font-size: 60%'>("+errTxt+")</span></li>");
	}
		
	var ocities = $("#otherCities").select2("val");
	var specErrors = [];
	for (var i = 0; i < ocities.length; i++) {
		var city2 = ocities[i];
		var e = errorTable[city1][city2]
		var err = 0;
		err += e["avgtemp" ]*avg_weight;
		err += e["raindays"]*rds_weight;
		err += e["rainfall"]*pcp_weight;
		
		if (countriesMode == 0) { // All
			// Do nothing
		} else if (countriesMode == 1) { // Same only
			if (data[city2]["country"] != data[city1]["country"]) continue;
			if (data[city1]["country"] == "NZ") {
				err += e["sunhours"]*sun_weight;
			}
		} else {
			if (data[city2]["country"] == data[city1]["country"]) continue;
		}
		
		specErrors.push([err,city2,city2+" ["+data[city2]["country"]+"]"]);
	}
	specErrors.sort(function(a,b) { return (a[0]-b[0]); });
	var specList = $("#specificList");
	specList.empty();
	if (specErrors.length % 2 == 0) {
		for (var j = 0; j < specErrors.length; j+=2) {
			var city2 = specErrors[j][1];
			var errTxt = specErrors[j][0].toFixed(0);
			errTxt += "="
			errTxt +=     avg_weight.toFixed(0)+"x"+errorTable[city1][city2]["avgtemp"].toFixed(0);
			errTxt += "+"+pcp_weight.toFixed(0)+"x"+errorTable[city1][city2]["rainfall"].toFixed(0);
			errTxt += "+"+rds_weight.toFixed(0)+"x"+errorTable[city1][city2]["raindays"].toFixed(0);
			if (data[city1]["country"] == "NZ" && data[city2]["country"] == "NZ") {
				errTxt += "+"+sun_weight.toFixed(0)+"x"+errorTable[city1][city2]["sunhours"].toFixed(0);
			}
			specList.append("<li>"+specErrors[j][2]+" <span style='font-size: 80%'>("+errTxt+")</span></li>");
			
			city2 = specErrors[j+1][1];
			errTxt = specErrors[j+1][0].toFixed(0);
			errTxt += "="
			errTxt +=     avg_weight.toFixed(0)+"x"+errorTable[city1][city2]["avgtemp"].toFixed(0);
			errTxt += "+"+pcp_weight.toFixed(0)+"x"+errorTable[city1][city2]["rainfall"].toFixed(0);
			errTxt += "+"+rds_weight.toFixed(0)+"x"+errorTable[city1][city2]["raindays"].toFixed(0);
			if (data[city1]["country"] == "NZ" && data[city2]["country"] == "NZ") {
				errTxt += "+"+sun_weight.toFixed(0)+"x"+errorTable[city1][city2]["sunhours"].toFixed(0);
			}
			specList.append("<li style='background-color: #EEEEEE'>"+specErrors[j+1][2]+" <span style='font-size: 80%'>("+errText+")</span></li>");
		}
	} else {
		for (var j = 0; j < specErrors.length; j+=1) {
			var city2 = specErrors[j][1];
			var errTxt = specErrors[j][0].toFixed(0);
			errTxt += "="
			errTxt +=     avg_weight.toFixed(0)+"x"+errorTable[city1][city2]["avgtemp"].toFixed(0);
			errTxt += "+"+pcp_weight.toFixed(0)+"x"+errorTable[city1][city2]["rainfall"].toFixed(0);
			errTxt += "+"+rds_weight.toFixed(0)+"x"+errorTable[city1][city2]["raindays"].toFixed(0);
			if (data[city1]["country"] == "NZ" && data[city2]["country"] == "NZ") {
				errTxt += "+"+sun_weight.toFixed(0)+"x"+errorTable[city1][city2]["sunhours"].toFixed(0);
			}
			specList.append("<li>"+specErrors[j][2]+" <span style='font-size: 80%'>("+errTxt+")</span></li>");
		}
	}
}
