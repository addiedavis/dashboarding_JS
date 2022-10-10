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
  cancerTypeAndAgeGroupHeatMap(data);
  numberOfCancer(data);
};

function numberOfCancer(data) {
  // need x and y in points
  // x css_diagnosis_discription
  // y counts of that type of cancer 

  let cssDiagnosisArray = [];
  for (let diagnosis of data) {
    if(cssDiagnosisArray.indexOf(diagnosis) === -1) {
      cssDiagnosisArray.push(diagnosis.ccs_diagnosis_description);
    }
  }

  cssDiagnosisArray = cssDiagnosisArray.filter((item, i, ar) => ar.indexOf(item) === i);
  let series = [];
  
  for (let x of cssDiagnosisArray) {
    let point = {x: '', y: ''};
    point.x=x,
    point.y=data.filter(z =>z.ccs_diagnosis_description === x).length;
    series.push(point);
  }

  numberCount = series;

  JSC.Chart('chartDiv', {
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
  ageArray = ageArray.filter((item, i, ar) => ar.indexOf(item) === i);
  cssDiagnosisArray = cssDiagnosisArray.filter((item, i, ar) => ar.indexOf(item) === i);
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
  series.sort(dynamicSort("x"));

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

function dynamicSort(key) {
  var sortOrder = 1;
  if(key[0] === "-") {
    sortOrder = -1;
    key = key.substr(1);
  }
  return function (a,b) {
    var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
    return result * sortOrder;
  }
}