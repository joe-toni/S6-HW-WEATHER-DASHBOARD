//Initial fetch request settup tucked away for when the app is ready to use it
    /*
    var APIkey = "cd0c34537ffad5abb85b20f6c5cdf3cc";
    var city = "arizona";


    var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + APIkey;
    //console.log(queryURL);

    fetch(queryURL)
    .then(function(response){return response.json();})
    .then(function(data){console.log(data)});
    */
//spacing

const currentDate = moment().format("(m/d/YYYY)")

const history = document.querySelectorAll(".slot");
const jqHistory = [];
history.forEach(element => jqHistory.push($(element)));

const today = document.querySelectorAll(".result");
const jqToday = [];
today.forEach(element =>jqToday.push($(element)));

const days = document.querySelectorAll(".dayDisplay");
const jqDays = [];
days.forEach(element => jqDays.push($(element)));

const sampleCity =
{
    name: "Arizona",
    date: currentDate,
    temperature: "74&degC",
    wind: "6.67mph",
    humidity: "52%",
    uvIndex: "some value"
}


console.log(jqToday);
