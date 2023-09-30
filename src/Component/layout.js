import React, { useState, useEffect } from "react"
import cloudy from '../utils/cloudy.png'
import rainy from '../utils/rain.png'
import sunny from '../utils/sun.png'
import fog from '../utils/fog.png'
import thunderstorm from '../utils/storm.png'
import snow from '../utils/snowing.png'
import { LuWind } from "react-icons/lu";
import { LuWaves } from "react-icons/lu";
import { CiTempHigh } from "react-icons/ci";
import { FaMountainSun } from "react-icons/fa6";
import Axios from '../Axios/index'
import isEmpty from "../utils/isEmpty";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Layout(props) {
    const [formData, setFormData] = useState({
        city: '',
        zipcode: '',
        countrycode: ''
    })
    const [temp, setTemp] = useState('')
    const [city, setCity] = useState('')
    const [wind, setWind] = useState('')
    const [humidity, setHumidity] = useState('')
    const [wether, setWether] = useState('')
    const [error, setError] = useState(false)
    const [zipError, setZipError] = useState(false)
    const [loader, setLoader] = useState(false)
    const [logo, setLogo] = useState(cloudy)
    const [toggle, setToggle] = useState(false)
    const [showCC, setShowCC] = useState(false)

    useEffect(() => {

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const { latitude, longitude } = position.coords;
                handleWether(latitude, longitude)
            });
        } else {
            alert('Geolocation is not available in your browser.');
        }

    }, [])

    const handleOnchange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => {
            return { ...prev, [name]: value }
        })
    }
    const handleWether = async (lat, long) => {
        setLoader(true)
        const response = await Axios.getData(formData.city, formData.zipcode, formData.countrycode, lat, long)
        if (!isEmpty(response)) {
            setLoader(false)
            setTemp(response.main.temp)
            setCity(response.name)
            setWind(response.wind.speed)
            setHumidity(response.main.humidity)
            setWether(response.weather[0].description)
            if (!isEmpty(response.weather[0].main)) {
                if (response.weather[0].main == 'Rain') {
                    setLogo(rainy)
                } else if (response.weather[0].main == 'Clouds') {
                    setLogo(cloudy)
                } else if (response.weather[0].main == 'Thunderstorm') {
                    setLogo(thunderstorm)
                } else if (response.weather[0].main == 'Snow') {
                    setLogo(snow)
                } else if (response.weather[0].main == 'Clear') {
                    setLogo(sunny)
                } else {
                    setLogo(fog)
                }
            }
        } else {
            setLoader(false)
            toast.error('Invalid Entry', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        console.log('resp==>', response)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        handleWether()
    }
    const handleToggle = async () => {
        setToggle(!toggle)
    }

    return (
        <>
            <ToastContainer />
            <div className="main">
                <div className="layout_box">
                    <form action="" onSubmit={handleSubmit}>
                        <div className='flex'>
                            <div>
                                <input
                                    name="city"
                                    value={formData.city}
                                    type="text"
                                    className="form-control"
                                    placeholder="City"
                                    onChange={handleOnchange}
                                    onFocus={() => {
                                        setShowCC(false)
                                        setFormData({
                                            ...formData,
                                            zipcode: '',
                                            countrycode: ''
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <input
                                    name="zipcode"
                                    value={formData.zipcode}
                                    type="number"
                                    className="form-control"
                                    placeholder="Zipcode"
                                    onChange={handleOnchange}
                                    onFocus={() => {
                                        setShowCC(true)
                                        setFormData({
                                            ...formData,
                                            city: ''
                                        })
                                    }}
                                />
                            </div>
                            {showCC && <div>
                                <input
                                required
                                    name="countrycode"
                                    value={formData.countrycode}
                                    type="text"
                                    className="form-control"
                                    placeholder="Country Code"
                                    onChange={handleOnchange}
                                />
                            </div>}
                            <div>
                                <button type="submit" className="btn btn-primary">
                                    {loader ?
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        :
                                        'Enter'
                                    }
                                </button>
                            </div>
                        </div>

                    </form>
                    <div className="text-center mt-4">
                        <h2 className="color_white">{city}</h2>
                        <img src={logo} alt="" className="imgs" />
                        <h2 className="pointer color_white m-2" onClick={handleToggle}><CiTempHigh />{!toggle ? `${temp}°C` : `${Math.floor((temp * 9 / 5) + 32)}°F`}</h2>
                        <h4 className="color_white"><FaMountainSun />  {wether}</h4>
                    </div>
                    <div className="row m-4">
                        <div className="col text-center">
                            <h4 className="color_white"><LuWind /></h4>
                            <p className="color_white">wind speed : {wind}km/h</p>
                        </div>
                        <div className="col text-center">
                            <h4 className="color_white"><LuWaves /></h4>
                            <p className="color_white">Humidity : {humidity}%</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};

