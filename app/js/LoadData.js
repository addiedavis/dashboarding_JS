$.ajax({
  url: "https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)%20like%20%27%25CANCER%25%27",
  type: "GET",
  data: {
    "$limit" : 5000,
    "$$app_token" : "iGaG5AYNvR6WFu9h88z86SQay"
  }
}).done(function(data) {
  setData(data);
});

let heatMap = []
let numberCount = []

function setData(data) {
  console.log(data);
  cancerTypeAndAgeGroupHeatMap(data);
  numberOfCancerBarChart(data);
  locationBarGraph(data);
  genderPieChart(data);
  racePieChart(data);
  severityPieChart(data);
};

function numberOfCancerBarChart(data) {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let cssDiagnosisArray = [];
  for (let diagnosis of data) {
    if(cssDiagnosisArray.indexOf(diagnosis) === -1) {
      cssDiagnosisArray.push(diagnosis.ccs_diagnosis_description);
    }
  }

  cssDiagnosisArray = reduceArrayToUniqueItems(cssDiagnosisArray)
  let series = [];
  
  for (let x of cssDiagnosisArray) {
    let point = {x: '', y: ''};
    point.x=x,
    point.y=data.filter(z =>z.ccs_diagnosis_description === x).length;
    series.push(point);
  }
  
  numberCount = series;

  JSC.Chart('amountsOfCancerTypes', {
    type: 'horizontal column',
    series: [
       {
          points: numberCount
       }
    ]
  });
  
}

function cancerTypeAndAgeGroupHeatMap(data) {
  // sets a heatmap where that diagnosis is used for over 200 cases in the data
  // need x y and z in points
  // x css_diagnosis_description Cancer of bronchus; lung
  // y age_group
  // z counts of that type of cancer in that age group

  let cssDiagnosisArray = [];
  let ageArray = [];
  for (let datum of data) {
    if(cssDiagnosisArray.indexOf(datum) === -1) {
      cssDiagnosisArray.push(datum.ccs_diagnosis_description);
    }
    if(ageArray.indexOf(datum) === -1) {
      ageArray.push(datum.age_group);
    }
  }
  
  // make the ageArray and cssDiagnosisArray have unique values only
  ageArray = reduceArrayToUniqueItems(ageArray);
  cssDiagnosisArray = reduceArrayToUniqueItems(cssDiagnosisArray);
  let series = [];
  
  for (let diagnosis of cssDiagnosisArray) {
    if (data.filter(i => i.ccs_diagnosis_description === diagnosis).length > 200) {
      for (let age of ageArray) {
        let point = {x: '', y: '', z: 0};
        point.x=age;
        point.y=diagnosis;
        point.z=data.filter(z => z.ccs_diagnosis_description === diagnosis && z.age_group === age).length;
        series.push(point);
      }
    }
  }

  // sort the series by the age groups so it goes youngest to oldest
  series.sort(dynamicSort("x", false));

  heatMap = series;
  
 JSC.chart('heatMap200AgeType', { 
    debug: true, 
    type: 'heatmap', 
    toolbar_visible: false, 
    title_label_text: 
      'Cancer types with over 200 instances', 
    legend_title_label_text: 'Instances', 
    palette: { 
      colors: ['green', 'yellow', 'red'], 
      pointValue: '{%zValue}'
    }, 
    series: [ 
      { 
        name: 'Cancer types with over 200 instances', 
        points: heatMap
      } 
    ] 
  });
}

function locationBarGraph(data)  {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let serviceAreaArray = [];
  for (let location of data) {
    if(serviceAreaArray.indexOf(location) === -1) {
      serviceAreaArray.push(location.health_service_area);
    }
  }
  serviceAreaArray = reduceArrayToUniqueItems(serviceAreaArray);
  
  let series = [];
  
  for (let x of serviceAreaArray) {
    let point = {x: '', y: ''};
    point.x=x? x : "undefined",
    point.y=data.filter(z =>z.health_service_area === x).length;
    series.push(point);
  }
  
  series.sort(dynamicSort("y", "reverse"));
  numberCount = series;

  JSC.Chart('amountsOfCancerPerLocation', {
    type: 'horizontal column',
    series: [
       {
          points: numberCount
       }
    ]
  });
  
}

function genderPieChart(data)  {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let genderArray = [];
  for (let location of data) {
    if(genderArray.indexOf(location) === -1) {
      genderArray.push(location.gender);
    }
  }
  genderArray = reduceArrayToUniqueItems(genderArray);
  
  let series = [];
  
  for (let x of genderArray) {
    let point = {x: '', y: ''};
    point.x=x ? x : "undefined",
    point.y=data.filter(z =>z.gender === x).length;
    series.push(point);
  }
  
  series.sort(dynamicSort("y", "reverse"));
  numberCount = series;

  JSC.Chart('gender', { 
    debug: true, 
    title_position: 'center', 
    legend: { 
      template: 
        '%value {%percentOfTotal:n1}% %icon %name', 
      position: 'inside left bottom'
    }, 
    defaultSeries: { 
      type: 'pie', 
      pointSelection: true
    }, 
    defaultPoint_label_text: '<b>%name</b>', 
    title_label_text: 'Genders of Patients', 
    yAxis: { label_text: 'Gender', formatString: 'n' }, 
    series: [ 
      { 
        name: 'Patients', 
        points: numberCount
      } 
    ] 
  }); 
}

function racePieChart(data)  {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let raceArray = [];
  for (let location of data) {
    if(raceArray.indexOf(location) === -1) {
      raceArray.push(location.race);
    }
  }
  raceArray = reduceArrayToUniqueItems(raceArray);
  
  let series = [];
  
  for (let x of raceArray) {
    let point = {x: '', y: ''};
    point.x=x ? x : "undefined",
    point.y=data.filter(z =>z.race === x).length;
    series.push(point);
  }
  
  series.sort(dynamicSort("y", "reverse"));
  numberCount = series;

  JSC.Chart('race', { 
    debug: true, 
    title_position: 'center', 
    legend: { 
      template: 
        '%value {%percentOfTotal:n1}% %icon %name', 
      position: 'inside left bottom'
    }, 
    defaultSeries: { 
      type: 'pie', 
      pointSelection: true
    }, 
    defaultPoint_label_text: '<b>%name</b>', 
    title_label_text: 'Race of Patients', 
    yAxis: { label_text: 'Race', formatString: 'n' }, 
    series: [ 
      { 
        name: 'Patients', 
        points: numberCount
      } 
    ] 
  }); 
}

function severityPieChart(data)  {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let severityArray = [];
  for (let location of data) {
    if(severityArray.indexOf(location) === -1) {
      severityArray.push(location.apr_risk_of_mortality);
    }
  }
  severityArray = reduceArrayToUniqueItems(severityArray);
  
  let series = [];
  
  for (let x of severityArray) {
    let point = {x: '', y: ''};
    point.x=x ? x : "undefined",
    point.y=data.filter(z =>z.apr_risk_of_mortality === x).length;
    series.push(point);
  }
  
  series.sort(dynamicSort("y", "reverse"));
  numberCount = series;

  JSC.Chart('severity', { 
    debug: true, 
    title_position: 'center', 
    legend: { 
      template: 
        '%value {%percentOfTotal:n1}% %icon %name', 
      position: 'inside left bottom'
    }, 
    defaultSeries: { 
      type: 'pie', 
      pointSelection: true
    }, 
    defaultPoint_label_text: '<b>%name</b>', 
    title_label_text: 'Risk of Mortality of During Visit', 
    yAxis: { label_text: 'Severity', formatString: 'n' }, 
    series: [ 
      { 
        name: 'Patients', 
        points: numberCount
      } 
    ] 
  }); 
}

function reduceArrayToUniqueItems(array) {
  return array.filter((item, i, ar) => ar.indexOf(item) === i)
}

function dynamicSort(key, order) {
  var sortOrder = 1;
  if(key[0] === "-") {
    sortOrder = -1;
    key = key.substr(1);
  }
  if (order === "reverse") {
    return function (a,b) {
      var result = (a[key] > b[key]) ? -1 : (a[key] < b[key]) ? 1 : 0;
      return result * sortOrder;
    }
  }
  return function (a,b) {
    var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
    return result * sortOrder;
  }
}