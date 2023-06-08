// Weather Application
// we have to start off by grabbing our packages
//crerate a variable for your packeages

const express = require("express"); //includes the express package from node
const app = express(); //creates a express application
const bodyParser = require("body-parser");
const https = require("https"); //include the https package from node
const { json } = require("stream/consumers");

//Here we are creating our roiute for URL to page.html
app.use(bodyParser.urlencoded({ extended: true })); // allows us to parse our url code
app.get("/", function (req, res) {
  //we are aceessing the html file and creating a function for a request
  res.sendFile(__dirname + "/index.html");
});

//Here we will implement our API CALL to our URL

app.post("/", function (req, res) {
  const cityName = req.body.cityName;
  const state = req.body.state;
  const geourl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${state},US&limit=&appid=6f2bf6bc02e6516623a137168eb8a433`;
  https.get(geourl, function (response) {
    response.on("data", function (data) {
      const geodata = JSON.parse(data)[0];
      console.log(geodata);

      const lat = geodata.lat;
      const long = geodata.lon;
      const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=6f2bf6bc02e6516623a137168eb8a433&units=imperial`;
      https.get(weatherurl, function (weatherResponse) {
        weatherResponse.on("data", function (weatherdata) {
          const weatherJson = JSON.parse(weatherdata);
          console.log(weatherJson);
          const temp = weatherJson.main.temp;
          const des = weatherJson.weather[0].description;
          const icon = weatherJson.weather[0].icon;
          const imageurl =
            "http://openweathermap.org/img/wn/" + icon + "@2x.png";
          res.write(
            //inline css is the only way
            `<div>
            <head> <link rel="stylesheet" href="index.css" /> <title>Weather Application Data</title> </head>
            <h1>The temp in  ${cityName}, ${geodata.state} is ${temp}</h1>
            <p id = "description" >The weather description is ${des}</p>
            <img src ="${imageurl}">
            </div>
            `
          );
          res.send();
        });
      });
    });
  });
});
//MIME
app.get("/index.css", function (req, res) {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(__dirname + "/index.css");
});

app.listen(9000);
