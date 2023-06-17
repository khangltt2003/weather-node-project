const bodyParser = require('body-parser');
const express = require('express')
const https = require('https');
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({extended:true})); //used to parse data from form

const APIKey  = `41fd7e85e504fe468bb922c1f39500cc`;

app.get('/', (req, res) =>{
    res.sendFile(__dirname+"/index.html")
})

app.post("/",(req,res)=>{

    console.log(req.body.cityName);

    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&appid=${APIKey}&units=metric`
    https.get(URL,(response)=>{
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
            let weatherData = JSON.parse(data);

            let temp = weatherData.main.temp;
            let weatherDescription = weatherData.weather[0].description;
            let icon = weatherData.weather[0].icon;

            res.write(`<body style = "height: 100vh; background-color: black; display:flex; flex-direction: column; align-items: center; justify-content: center"></body>`)
            res.write(`<h1 style = "color:orange"> The temperature at ${weatherData.name} is ${temp} degree Celsius. </h1>`);
            res.write(`<h1 style = "color:blue"> The weather is currently ${weatherDescription}. </h1>`)
            res.write(`<img src = "https://openweathermap.org/img/wn/${icon}@2x.png" height = "200px"> `) 
            res.send();
        })
    })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))