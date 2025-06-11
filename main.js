const apiKey = '1f4c597377f4da67d7b8cde7dbb1ebf1'; 
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');
const cityInput = document.getElementById('cityInput');

// Set default background image on page load
updateBackground('default');

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    console.log('Fetching current weather data for:', city);
    console.log('API request URL:', currentWeatherUrl.replace(apiKey, 'YOUR_API_KEY'));

    try {
        const response = await fetch(currentWeatherUrl);
        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error response body:', errorText);
            if (response.status === 401) {
                throw new Error('Invalid API key. Please generate a new key at https://home.openweathermap.org/api_keys and ensure it is active (may take up to 2 hours).');
            } else if (response.status === 404) {
                throw new Error('City not found. Please check the city name or try including the country code (e.g., London,UK).');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Your account may be temporarily blocked. Please try again later or contact OpenWeatherMap support.');
            } else {
                throw new Error(`Failed to fetch weather data. Status: ${response.status}. Error: ${errorText}`);
            }
        }

        const currentData = await response.json();
        console.log('Current weather data received:', currentData);
        
        // Fetch 5-day forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data.');
        }
        const forecastData = await forecastResponse.json();
        console.log('Forecast data received:', forecastData);

        // Display current weather and forecast
        displayWeather(currentData);
        displayForecast(forecastData);
        updateBackground(currentData.weather[0].main);
        error.style.display = 'none';
        weatherInfo.classList.add('show');
    } catch (err) {
        console.error('Error fetching weather:', err.message);
        weatherInfo.classList.remove('show');
        showError(err.message);
    }
}

function displayWeather(data) {
    const { main, weather, wind, name } = data;
    document.getElementById('temperature').textContent = `${Math.round(main.temp)}°C`;
    document.getElementById('description').textContent = weather[0].description;
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = main.humidity;
    document.getElementById('wind').textContent = (wind.speed * 3.6).toFixed(1);
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    document.getElementById('cityName').textContent = `Weather in ${name}`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous forecast

    // Group forecast data by day (take one entry per day, e.g., at 12:00)
    const dailyData = {};
    data.list.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const hour = date.getHours();
        if (hour === 12) { // Take the 12:00 forecast for each day
            dailyData[day] = entry;
        }
    });

    // Display up to 5 days
    const days = Object.keys(dailyData).slice(0, 5);
    days.forEach(day => {
        const entry = dailyData[day];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <div>${day}</div>
            <img src="http://openweathermap.org/img/wn/${entry.weather[0].icon}.png" alt="Weather Icon">
            <div>${Math.round(entry.main.temp_max)}/${Math.round(entry.main.temp_min)}</div>
        `;
        forecastContainer.appendChild(forecastItem);
    });
}

function updateBackground(weatherCondition) {
    let imageUrl;
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            imageUrl = 'https://source.unsplash.com/1600x900/?sunny';
            break;
        case 'clouds':
            imageUrl = 'https://source.unsplash.com/1600x900/?cloudy';
            break;
        case 'rain':
        case 'drizzle':
            imageUrl = 'https://source.unsplash.com/1600x900/?rain';
            break;
        case 'thunderstorm':
            imageUrl = 'https://source.unsplash.com/1600x900/?thunderstorm';
            break;
        case 'snow':
            imageUrl = 'https://source.unsplash.com/1600x900/?snow';
            break;
        case 'mist':
        case 'fog':
            imageUrl = 'https://source.unsplash.com/1600x900/?fog';
            break;
        default:
            imageUrl = 'https://source.unsplash.com/1600x900/?weather';
            break;
    }
    console.log('Setting background image to:', imageUrl);
    document.body.style.backgroundImage = `url('${imageUrl}')`;

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => console.log('Background image loaded successfully:', imageUrl);
    img.onerror = () => {
        console.error('Failed to load background image:', imageUrl);
        console.log('Falling back to alternative image');
        document.body.style.backgroundImage = `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=1600&h=900')`;
    };
}

function showError(message) {
    error.textContent = message;
    error.style.display = 'block';
}

// Allow pressing Enter to search
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getWeather();
});
