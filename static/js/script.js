// information de de l'API OpenCage
const openCageApi = "https://api.opencagedata.com/geocode/v1/json"
const openCageApiKey = "293bcf3f36084e62a756e845836fdf76"

// information de de l'API OpenWeather
const openWeatherApi = 'https://api.openweathermap.org/data/2.5/onecall'
const openWeatherKey = 'b9dd77b98aa0ec8d9d5fb15748e206b0'


let divAfficherMeteo = document.getElementById('meteo')
let hourCurrent = new Date().getHours()
// let hourCurrent = 22
// console.log('hourCurrent', hourCurrent)
let color = 'linear-gradient(45deg, #1068b6, #ec60a6)'




let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" ,"Saturday"]
let day = new Date()
// console.log(day)
let options = {weekday:'long'}
let currentDay = day.toLocaleDateString('en-EN', options)
// console.log(currentDay)
let orderDays = daysOfWeek.slice(daysOfWeek.indexOf(currentDay)).concat(daysOfWeek.slice(0, 
    daysOfWeek.indexOf(currentDay)))
// console.log(orderDays)


// fonction pour afficher les 5 jour
function numberDisplayDays(numberDay){
    for(let k = 0; k < numberDay; k++){
      let div = document.createElement('div')
      let divImage = document.createElement('div')
      divImage.setAttribute('class', 'divMeteo')
      let h2Jour = document.createElement('h2')
      div.appendChild(h2Jour)
      div.appendChild(divImage)
      divAfficherMeteo.appendChild(div)
      // h2Jour[k].innerText = orderDays[k]
      h2Jour.textContent = orderDays[k]
    }
}



// fonction pour gérer l'evenment sur le btn submit
$('#btnSubmit').click(function(e){
        e.preventDefault()
        divAfficherMeteo.innerHTML = ''
        let city = document.getElementById("inputCity").value
        // console.log(city)
        httpsGetOpenCage(city)
    
        // selectionner le nombre de jour choisi
        numberDisplayDays(getNumberDays())
        // displayDayOrNeight(hourCurrent)

        // pour changer la couleur de body
        if(hourCurrent <= 6 || hourCurrent > 21){
            color = 'linear-gradient(45deg, #03233f, #470426)'
            changeBackground(color)
            document.body.style.color = '#f1f1f1'

            }
})


// fountion pour changer le fond d'ecron entre le jour et la nuit
function changeBackground(color) {
    document.body.style.background = color;
 
 }
changeBackground(color)


// fonction pour recuperer le nombre de jour à afficher
function getNumberDays(){
    let numberDays = document.forms[0].selectSection.value;
    // console.log('numberDays', numberDays) 
    return numberDays   
}

// fonction pour recuper le nom de la ville à partir du formulaire
function httpsGetOpenCage(city){
    $.get(openCageApi + '?key=' + openCageApiKey + '&q='+ city , function(data) {
        // console.log("data ok" , data)
        displayData(data)
    })
}

// fonction pour recuperer la localisation à partie de nom de ville
function displayData(data){
    const lat = data.results[0].geometry.lat
    const lng = data.results[0].geometry.lng
    // console.log('lat', lat)
    // console.log('lng', lng)
    httpGetOpenWeather(lat, lng)
}

// fonction pour recuperer infos méteo et dt de jour courrent 
function httpGetOpenWeather(lat, lng){
    $.get(openWeatherApi + '?lat='+ lat+'&lon='+lng+'&appid='+ openWeatherKey,
            function(data2) {
        console.log("data2", data2)
        let Sunrise = data2.current.sunrise
        console.log('Sunrise', Sunrise)
        let Sunset = data2.current.sunset
        console.log('Sunset', Sunset)

        let dt = data2.current.dt
        // console.log('dt : ', dt)
        displayDataWeather(data2)
    })
} 

// fonction pour recuperer infos sue la méteo
function displayDataWeather(data3){
    // console.log('ok4',data3)
    let number = +getNumberDays()
    // console.log('number', number)
    // console.log(typeof(number))

    // list pour stocker infos météo
    let myAllData = []

    // recuperer infos méteo de jour courrent et l'ajouter au list
    let cloudsCurrent = data3.current.clouds
    // console.log(cloudsCurrent)
    let mainCurrent = data3.current.weather[0]['main']
    // console.log(mainCurrent)
    myAllData = [
        { clouds: data3.current.clouds , main: data3.current.weather[0]['main'] }
    ]

    // recuperer les info méteo de 4 jour et les ajouter au list
    for(let j = 1 ; j <= +number-1; j++){
        // myAllData.push({clouds: data3.hourly[j].clouds , main: data3.hourly[j].weather[0]['main']})
        myAllData.push({clouds: data3.daily[j].clouds , main: data3.daily[j].weather[0]['main']})
    }
    // console.log( 'myAllData' ,myAllData)
    weatherIcon(myAllData)
} 

// fonction pour afficher l'icone méteo
function weatherIcon(myAllData){
    for(let f = 0; f < myAllData.length; f++){
        weather = myAllData[f]['main']
        clouds = myAllData[f]['clouds']
        // console.log('weater : ', weather)
        // console.log('clouds : ', clouds)
        afficherWeather(weather, clouds, f)
    }
}

// fonction pour afficher l'etat du méteo
function afficherWeather(weather, clouds, f){
    divImage = document.getElementsByClassName('divMeteo')
    // console.log('divImage', divImage)
    if (weather == "Clear" || weather == "Clouds" || weather == "Snow"){
      if (weather == "Clear"){
        divImage[f].innerHTML = '<img src="./static/images/sun.svg"/ class="iconMet">';
      }
      if (weather == "Clouds" && clouds >= 0 && clouds <= 50){
        divImage[f].innerHTML = '<img src="./static/images/cloudy.svg"/>';
      }
      if (weather == "Clouds" && clouds > 50){
        divImage[f].innerHTML = '<img src="./static/images/clouds.svg"/>';
      }
      if (weather == "Snow" ){
        divImage[f].innerHTML = '<img src="./static/images/snow.svg"/>';
      }
    }else{
        divImage[f].innerHTML = '<img src="./static/images/rain.svg"/>';
    }
  }
