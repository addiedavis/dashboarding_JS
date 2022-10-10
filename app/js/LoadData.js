JSC.Chart('chartDiv', {
  type: 'horizontal column',
  series: [
     {
        name:'Andy',
        points: [
           {x: 'Apples', y: 50},
           {x: 'Oranges', y: 32}
        ]
     },{
        name:'Anna',
        points: [
           {x: 'Apples', y: 30},
           {x: 'Oranges', y: 22}
        ]
     }
  ]
});

$.ajax({
  url: "https://health.data.ny.gov/resource/gnzp-ekau.json?$where=UPPER(ccs_diagnosis_description)%20like%20%27%25CANCER%25%27",
  type: "GET",
  data: {
    "$limit" : 5000,
    "$$app_token" : "iGaG5AYNvR6WFu9h88z86SQay"
  }
}).done(function(data) {
alert("Retrieved " + data.length + " records from the dataset!");
console.log(data);
});