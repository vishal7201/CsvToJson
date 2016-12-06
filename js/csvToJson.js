var fs = require('fs');
var readline = require('readline');
var head = require('./config').header;
const rl = readline.createInterface({
  input: fs.createReadStream('../data/Indicators.csv')
});
var india = [];
var lifeExpectancyOfAsia = [];
var lifeExpectancy = {};
var obj = {};
var top = true;
var asianCountry = ["Arab World", "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei Darussalam", "Cambodia", "China", "Cyprus", "Egypt Arab Rep.", "India", "Indonesia", "Iran Islamic Rep.", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Korea Dem. Rep.", "Korea Rep.", "Kuwait", "Kyrgyz Republic", "Lao PDR", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen Rep."];
rl.on('line', function(line) {
  var values = line.split(new RegExp(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
  if (top) {
    top = false;
  } else {
    if (asianCountry.includes(values[head.country])) {
      var item = lifeExpectancyOfAsia.find((item) => (item.year == values[head.year]));
      if (!item) {
        var item = {};
        item.year = values[head.year];
        item.lifeExpectancyFemale = 0;
        item.lifeExpectancyMale = 0;
        lifeExpectancyOfAsia.push(item);
      }
      if (values[head.indicator] == '"Life expectancy at birth, female (years)"') {
        item["lifeExpectancyFemale"] += parseFloat(values[head.value]);
      } else if (values[head.indicator] == '"Life expectancy at birth, male (years)"') {
        item["lifeExpectancyMale"] += parseFloat(values[head.value]);
      }
    }
    if ((values[head.country] == "India")) {
      if (values[head.indicator] == '"Birth rate, crude (per 1,000 people)"') {
        obj.year = parseInt(values[head.year]);
        obj.birthrate = parseFloat(values[head.value]);
      } else if (values[head.indicator] == '"Death rate, crude (per 1,000 people)"') {
        obj.deathrate = parseFloat(values[head.value]);
        india.push(obj);
        obj = {};
      }
    }
    if (values[head.indicator] == '"Life expectancy at birth, total (years)"') {
      if (!lifeExpectancy[values[head.country]]) {
        lifeExpectancy[values[head.country]] = 0;
      }
      lifeExpectancy[values[head.country]] += parseFloat(values[head.value]);
    }
  }
});

rl.on('close', function() {
  createJSONData(lifeExpectancyOfAsia, "../json/asianCountryLifeExpectency.json");
  createJSONData(india, "../json/indiaBirthAndDeathRate.json");
  createJSONData(topFive(lifeExpectancy), "../json/topFive.json");
});

function topFive(obj) {
  var arr = Object.keys(lifeExpectancy).sort((a, b) => (obj[b] - obj[a]));
  var a = [];
  for (i = 0; i < 5; i++) {
    var o = {};
    o.country=arr[i];
    o.value=lifeExpectancy[arr[i]];
    a.push(o);
  }
  return a;
}

function createJSONData(data, fileName) {
  fs.writeFile(fileName, JSON.stringify(data), function(err) {
    if (err) throw err;
    console.log("Created" + " " + fileName + " file");
  });
}
