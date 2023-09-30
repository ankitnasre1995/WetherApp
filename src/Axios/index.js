import axios from "axios";
import isEmpty from "../utils/isEmpty";

const apikey = '8e2851c6444defd967255246be56b886'

export async function getData(city,zipcode,contrycode, lat, lon) {
    var response;
    try{
        if(!isEmpty(city)){
            response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${apikey}`)
            console.log('City-->',city)
        }else if(!isEmpty(zipcode)){
            response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${contrycode}&units=Metric&appid=${apikey}`)
            console.log('zipcode-->',zipcode)
        }else{
            response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=Metric&appid=${apikey}`)
            console.log('Default-->','Hyderabad')
        }
        return response.data;
    }
    catch(err){
          return response
    }
}

export default {
    getData,
}

