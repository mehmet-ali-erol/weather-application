import React, {useState, useEffect} from "react";
import axios from "axios";
import "antd/dist/antd.css";
import { Select, Input } from 'antd';
import Cities from './components/cities.json';
import './components/weather-icons.min.css'

function App() {
  const { Option } = Select;
  const { Search } = Input;

  const [data,setData] = useState({})
  const [city,setCity] = useState("Athens")
  const [api,setApi] = useState(sessionStorage.getItem("api"))

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}&units=metric`
  const options = Cities.map((c) => <Option key={c.name}>{c.name}</Option>);
  
  // if api and city is selected gets the weather data
  useEffect(() => {
    api && city && getWeatherData(city,api)
    
    if(!data.main)
    {
      document.getElementById("container").classList.add("fadeout");
      document.getElementById("selectCity").classList.add("fadeout");
    }

  }, [api, city]);

  const getWeatherData = async (city, api) => {
    try 
    {
      // gets weather data from axios
      await axios.get(url).then((response) => 
      {
        setData(response.data)
      })

      // displays city selection
      sessionStorage.setItem("api", api)
      document.getElementById("textbox").classList.add("fadeout");
      document.getElementById("selectCity").classList.remove("fadeout");

      if (city !== "Athens")
        document.getElementById("container").classList.remove("fadeout");

    } 
    // displays an alert if API key is not valid
    catch 
    {
      alert("Could not contact API services. Either there are connection issues or your API key is not valid.")
    }
  };

  return (
    <div className="app">
      <div id="textbox" className="textbox">
        <Search 
          placeholder="Please enter the API key"
          enterButton 
          size="large"
          onSearch={value => setApi(value)} 
          style={{ 
            width: 350 
          }}
        />
      </div>
      <div id="selectCity" className="selectCity">
        <Select
          showSearch
          placeholder="Select a city"
          optionFilterProp="cities"
          onChange={value => setCity(value)}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
          style={{ 
            width: 200,
          }}
        >
          {options}
        </Select>
      </div>
      <div id ="container" className="container">
        <div className="top">
          <br />
          <div className="city">
            <h2><b>{data.name}</b></h2>
          </div>
          <div className="temparature">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="weather">
            <i className={data.weather ? `wi wi-owm-${data.weather[0].id} weather-icon` : null} />
            <br />
            <br />
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>

        <div className="bottom">
          <br />
          <div className="feels">
            {data.main ? <p><b>Feels Like:</b> {data.main.feels_like.toFixed()}°C</p> : null}
          </div>
          <hr />
          <br />
          <div className="humidity">
            {data.main ? <p><b>Humidity:</b> %{data.main.humidity}</p> : null}
          </div>
          <hr />
          <br />
          <div className="wind">
            {data.wind ? <p><b>Windspeed:</b> {data.wind.speed.toFixed()} km/h</p> : null}
          </div>
          <hr />
          <br />
          <div className="windDirection">
            {data.main ? <p><b>Wind Direction:</b> {data.wind.deg}°</p> : null}
          </div>
          <hr />
          <br />
          <div className="visibility">
            {data.main ? <p><b>Pressure:</b> {data.main.pressure} hPa</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
