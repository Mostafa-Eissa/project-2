// get the date now
let date = new Date().toDateString();





// api of open weather to only US
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";

// api key 
const apikey = ",&appid=b9ff423d5fa54a425bfcd92037d9c693&units=metric";

// my server 
const server = "http://localhost:8888";

//function to genetrat data
//contain value of zip
// controll get and post to server
// update them;

const generateWeatherData = function () {
    let zipCode = document.getElementById("zip").value;
    let feelings = document.getElementById("feelings").value;
    getWeather(zipCode).then(function (data) {
        if (data) {
            const { main: { temp }, name: city, sys: { sunrise , sunset} , timezone: timezone } = data;
            // dedect the time of sunrise and sun set
            let x = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('HH:mm a');
            let y = moment.utc(sunset, 'X').add(timezone, 'seconds').format('HH:mm a');
            //post data to server
            postData(server + "/addData", { date, temp: Math.round(temp), city , feelings , sunrise , sunset, timezone , x , y } );
            getData();
            // trun background from day to night;
            backdroundImage(datenow, x, y);
        };
    });
    
}

document.getElementById("generate").addEventListener("click", generateWeatherData);

// function to get api data;
const getWeather = async function (zipCode) {
    try {
        const data = await (await fetch(baseURL + zipCode + apikey)).json();
        if (data.cod != 200) {
            popUp();
      }
        return data;
    } catch {
        console.log("erroe")
    }
}

// fucton post data server

const postData = async ( url = '', info = {})=>{

    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(info),
    });

    try {
        const newData = await response.json();
        return newData;
    }catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

// function to get data and update them
const getData = async function () {
    const respone = await fetch("/all");
    try {
        const serverData = await respone.json();
        document.getElementById("date").innerHTML = `Date: ${serverData.date}`;
        document.getElementById("temp").innerHTML = `Temperature: ${serverData.temp + '&degC'}`;
        document.getElementById("sunrise").innerHTML = `Sunrise: ${serverData.x}`;
        document.getElementById("sunset").innerHTML =`Sunset: ${serverData.y}` ;
        document.getElementById("city").innerHTML = `City:${serverData.city}`;
        document.getElementById("content").innerHTML = `Fleeing: ${serverData.feelings}`;
        // to remove all value to add new zip code
        document.getElementById("zip").value = "";
        document.getElementById("feelings").value = "";
        // add style to enentry
        document.querySelectorAll(".allWeatherStyle").forEach((e) => {
            e.style.cssText = "padding: 15px;transition: .3s;-webkit-transition: .3s;-moz-transition: .3s;-ms-transition: .3s;-o-transition: .3s;background-color: white;color: #3b4a6b;";
        });

    } catch {
        console.log("error");
    }
}

// function to trun the backdround from day to night
let d = new Date().toString();
let datenow = d.split(" ")[4];
function backdroundImage(dateNow, sunrise, sunset) {
    if (dateNow >= sunrise && dateNow < sunset) {
        document.body.style.backgroundImage = 'url("background.jpg")';
    } else {
        document.body.style.backgroundImage = 'url("background2.jpg")';
    }
}

// function to show popup when any thing rong;
function popUp() {
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.appendChild(document.createTextNode("Please enter valid Zip code"));
    let cancel = document.createElement("div");
    cancel.appendChild(document.createTextNode("cancel"));

    // style of popup
    div.style.cssText = "position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);background-color: #3b4a6b;color: white;padding: 10px;width: 300px;height: 150px;border-radius: 15px;display: flex;flex-direction: column;align-items: center;";

    p.style.cssText = "margin-top: 40px;";

    cancel.style.cssText = "margin-top: 25px;background-color: white;color: #3b4a6b;padding: 5px 10px;border-radius: 8px;cursor: pointer;";
    //add listen event;
    cancel.addEventListener("click", () => {
        div.remove();
        // to remove all value to add new zip code
        document.getElementById("zip").value = "";
        document.getElementById("feelings").value = "";
    });
    // append to html
    div.appendChild(p);
    div.appendChild(cancel);

    const entry = document.querySelector(".entry");
    entry.after(div);
}