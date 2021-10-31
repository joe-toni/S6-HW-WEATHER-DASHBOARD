//Establishing Global Variables and References
    var APIkey = "cd0c34537ffad5abb85b20f6c5cdf3cc";
    //This array saves the moment objects that will be used to display later on
    const calendarDates =
    [
    moment().format("(M/D/YYYY)"),
    moment().add(1, 'days').format("M/D/YYYY"),
    moment().add(2, 'days').format("M/D/YYYY"),
    moment().add(3, 'days').format("M/D/YYYY"),
    moment().add(4, 'days').format("M/D/YYYY"),
    moment().add(5, 'days').format("M/D/YYYY")
    ];
    //

    //This area query selects all the necessary elments from the document and converts them
    // into jquery objects for easier manipulation.
    const history = document.querySelectorAll(".slot");
    const jqHistory = [];
    history.forEach(element => jqHistory.push($(element)));

    const jqToday = $(".searchResults");

    const days = document.querySelectorAll(".dayDisplay");
    const jqDays = [];
    days.forEach(element => jqDays.push($(element)));
    //

    //This portion initiallizes an object that will hold all the neccisary values to be displayed for our city
    const currentCity =
    {
        name: "",
        date: calendarDates[0],
        icon: "",
        temperature: "",
        wind: "",
        humidity: "",
        uvIndex: ""
    }
    //

    //This is an array of objects that will hold the values for each upcomming forcast day with each 
    //individual object represening one day
    const forcast =
        [
        {
            date:calendarDates[1],
            icon: "",
            temperature: "",
            wind: "",
            humidity: ""
        },
        {
            date:calendarDates[2],
            icon: "",
            temperature: "",
            wind: "",
            humidity: ""
        },
        {
            date:calendarDates[3],
            icon: "",
            temperature: "",
            wind: "",
            humidity: ""
        },
        {
            date:calendarDates[4],
            icon: "",
            temperature: "",
            wind: "",
            humidity: ""
        },
        {
            date:calendarDates[5],
            icon: "",
            temperature: "",
            wind: "",
            humidity: ""
        }
        ]
    //
//spacing
   
//This is a place holder variable used to test the information retrieved by the API
var city = "los angeles";
getTheWeather();

//This is the main function and first aquires the coordinates of the searched city from an initial API call then uses that same information
//to make a new API call for the correct forcast information it then populates the global objects with the necessary information after the 
//data has been retrieved and uses the objects to run the display functions. It also catches if the given input does not result in a valid input
function getTheWeather()
{
    let lon = "";
    let lat = "";

    var firstQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
    fetch(firstQueryURL)
    .then(function(response){return response.json();})
    .then(function(data)
    {
        currentCity.name = data.name;   
        lon = data.coord.lon;
        lat = data.coord.lat
        
        let secondQueryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=imperial&appid=${APIkey}`;
        fetch(secondQueryURL)
        .then(function(response){return response.json();})
        .then(function(data)
        {
            currentCity.icon = data.current.weather[0].icon;
            currentCity.temperature = data.current.temp;
            currentCity.wind = data.current.wind_speed;
            currentCity.humidity = data.current.humidity;
            currentCity.uvIndex = data.current.uvi;
            displayResults(currentCity);

            for(i = 0; i < 5; i++)
            {
                forcast[i].icon = data.daily[i].weather[0].icon;
                forcast[i].temperature = data.daily[i].temp.day;
                forcast[i].wind = data.daily[i].wind_speed;
                forcast[i].humidity = data.daily[i].humidity; 
            }
            displayForcast(forcast);
        })
    })
    .catch(function(error)
    {
        alert("Invalid Input Please try Again");
    });

}

//Displaying Fetch Results
    //The following functions should correctly display the resulting data from our fetch request but should only
    //ever be called from inside the request to make sure the elments are only populating once the data is obtained.
      
        //This function takes our currentCity object and displays its values by adding them directly into the inner html
        //of our queried display element
         function displayResults(cityObject)
         {
             jqToday.html
             (
                 `<h3>${cityObject.name} ${cityObject.date} 
                 <img src= "http://openweathermap.org/img/wn/${cityObject.icon}@2x.png" height = "50">
                 </h3>
                 <p>Temp: ${cityObject.temperature} &deg F</p>
                 <p>wind: ${cityObject.wind} MPH</p>
                 <p>Humidity: ${cityObject.humidity}%</p>
                 <p> UV Index: ${cityObject.uvIndex}</p>`
             )
                
         };
        //

        //This function takes our forcast array and cycles through each object populating its 
        //values into its respective slot from our queried html elements. 
            function displayForcast(forcastObject)
            {
                for(let i = 0; i < days.length; i++)
                {
                    jqDays[i].html
                    (
                        `<h4>${forcastObject[i].date}<h4>
                        <img src= "http://openweathermap.org/img/wn/${forcastObject[i].icon}@2x.png" height = "30">
                        <p>Temp: ${forcastObject[i].temperature} &degF</p>
                        <p>wind: ${forcastObject[i].wind} MPH</p>
                        <p>Humidity: ${forcastObject[i].humidity} %</p>`
                    )
                } 
            }
        //
    //
//Section End