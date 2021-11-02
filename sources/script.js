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

    //This area query selects all the necessary elments from the document for easier manipulation later on
        const jqHistory = $(".searchHistory");
        const jqToday = $(".searchResults");

        const days = document.querySelectorAll(".dayDisplay");
        const jqDays = [];
        days.forEach(element => jqDays.push($(element)));
    //

    //This portion initiallizes an object that will hold all the neccisary values to be displayed for our searched city
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

    //This is an array of objects that will hold the values for each upcomming forcast day with each object represening one day
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
    
    //This variable will be given the city name for use by the main getWeather function
        var city = "";
    //This array will be given the city names saved to localStorage as well as any newly searched results
        var searchedCities = [];
//spacing
   
//This portion obtains the form resposible for user input and adds an event listener that gets the input
//prevents form default behavior and runs the get weather fucntion with the newly set city name
    const userEntry = $(".searchInput");
    const cityInput = $(".searchField");
    userEntry.on("submit", function()
    {
        event.preventDefault();
        city = cityInput.val();
        cityInput.val("");
        getTheWeather();
    });
//

//These two initial function calls make sure the necessary local storage object exists and is pulled before
//either running a preset weather API call or one determined by the most recent search histoy result
initialSetup();
startingPageSetup();

//This function checks to see if a local storage item exists setting one up if not and simply
//pulling and populating the information if  it does.
    function initialSetup()
    {
        if(localStorage.getItem("searchHistory")===null)
        {
            localStorage.setItem("searchHistory", JSON.stringify(searchedCities));
        };
        let storagePull = JSON.parse(localStorage.getItem("searchHistory"));
        for( let i = 0; i < storagePull.length; i++)
        {
            searchedCities.push(storagePull[i]);
        } 
    };
//

//This function will run an example city if it is the users first time running the site or loading
// the most recent searched city if one is found in local storage after settup.
    function startingPageSetup()
    {
        if(searchedCities.length === 0 )
        {
            city = "Atlanta";
            getTheWeather();
        }
        else
        {
            let mostRecent = searchedCities.length-1;
            city = searchedCities[mostRecent];
            getTheWeather();
        }
    }
//

//This function will display the search history saved in the local varaible by appending new html elements
//directly to the existing div, after clearing the existing ones to avoid repeating lists.
    function displaySearchHistory()
    {
        jqHistory.html("");
        if(searchedCities.length > 0)
        {
           let  index = searchedCities.length - 1;
            while(index >= 0)
            {
                jqHistory.append(`<p class = "savedCity" onclick = "getClickedWeather()">${searchedCities[index]}</p>`)
                index--;
            }
        }
    };
//

//This function sets the city value according to whats contained in the clicked html element and 
//runs the get weather function with the newly set information.
    function getClickedWeather()
    {
        city = event.target.innerHTML;
        getTheWeather();
    };
//

//Calling the API & Setting Data
    //This is the main function and first aquires the coordinates of the searched city from an initial API call then uses that same information
    //to make a new API call for the correct forcast information it then populates the global objects with the necessary information after the 
    //data has been retrieved and uses the objects to run the display functions. It also catches if the given input does not result in a valid input
        function getTheWeather()
        {
            let lon = "";
            let lat = "";
        
            var firstQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIkey;
            fetch(firstQueryURL)
            .then(function(response){return response.json();})
            .then(function(data)
            {
                currentCity.name = data.name;  

                lon = data.coord.lon;
                lat = data.coord.lat;

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
                    adjustSearchHistory();
                })
            })
            .catch(function(error)
            {
                alert("Invalid Input Please try Again");
            });
        }
//Section End

//This function will check if the current searched city is already saved in the search history array pushing it to the
//front of the list if so or simply adding it in if not then calling the displaySearchHistory function to refresh the display
    function adjustSearchHistory()
    {
        if(searchedCities.includes(currentCity.name))
        {
            let index = searchedCities.indexOf(currentCity.name);
            while (index != searchedCities.length-1)
            {
                let temporary = searchedCities[index];
                searchedCities[index] = searchedCities[index + 1];
                searchedCities[index + 1] = temporary;
                index++;
            }
        }
        else
        {
            searchedCities.push(currentCity.name);
        };
        localStorage.setItem("searchHistory", JSON.stringify(searchedCities));
        displaySearchHistory();
    };
//

 //Displaying Fetch Results
    //The following functions should correctly display the resulting data from our fetch request but should only
    //ever be called from inside the request to make sure the elments are only populating once the data is obtained.
      
        //This function takes our currentCity object and displays its values by adding them directly into the inner html
        //of our queried display element it also checks the value of the uvIndex to add the designated class
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
                 <p> UV Index: <span>${cityObject.uvIndex}</span></p>`
             )
             let uvIndex = $("span");
             if(cityObject.uvIndex < 0.5)
             {uvIndex.addClass("favorable");}   
             else if (cityObject.uvIndex<0.8)
             {uvIndex.addClass("moderate");}
             else
             {uvIndex.addClass("severe");}          
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
