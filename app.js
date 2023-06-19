const bodyParser = require('body-parser');
const express = require('express')
const https = require('https');
const app = express()
const port = 3000

app.use(express.static("public"), bodyParser.urlencoded({extended:true})); //used to parse data from form

const APIKey  = `41fd7e85e504fe468bb922c1f39500cc`;

app.get('/', (req, res) =>{
    res.sendFile(__dirname+"/index.html") //send html file to web
})

app.post("/",(req,res)=>{  //req = data from form

    console.log(req.body.cityName); //city from form

    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${req.body.cityName}&appid=${APIKey}&units=metric`

    //get api using https
    https.get(URL,(response)=>{
        response.on("data", (data)=>{
            console.log(data); // data sent back in form of hex buffer
            let weatherData = JSON.parse(data); // use JSON.parse to convert data to json
            console.log(weatherData);
            
            if(weatherData.cod === 200){
                //get data from api
                let temp = weatherData.main.temp;
                let weatherDescription = weatherData.weather[0].description;
                let icon = weatherData.weather[0].icon;
    
                //post
                res.write(`<body style = "height: 100vh; background-color: black; display:flex; flex-direction: column; align-items: center; justify-content: center"></body>`)
                res.write(`<h1 style = "color:orange"> The temperature at ${weatherData.name} is ${temp} degree Celsius. </h1>`);
                res.write(`<h1 style = "color:blue"> The weather is currently ${weatherDescription}. </h1>`)
                res.write(`<img src = "https://openweathermap.org/img/wn/${icon}@2x.png" height = "200px"> `) 
                res.send();
            }
            else{
                res.write(`<body style = "height: 100vh; background-color: black; display:flex; flex-direction: column; align-items: center; justify-content: center"></body>`)
                res.write(`<h1 style = "color:orange"> Cannot find city name "${req.body.cityName}" </h1>`);
                res.end();
            }
            
        })
    })
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))