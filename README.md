#Weather Application
A responsive and user-friendly Weather Application built using HTML, CSS, and JavaScript. This project fetches real-time weather data from a third-party API and displays it in a clean, visually appealing interface.

Features
•	Get current weather by city name
•	Displays temperature, humidity, weather condition, wind speed, and more
•	Simple and attractive user interface
•	Responsive design for all screen sizes
•	Real-time data from OpenWeatherMap API

Technologies Used
•	HTML5 – Structure and markup
•	CSS3 – Styling and layout
•	JavaScript – Logic and API calls
•	OpenWeatherMap API – Weather data provider

Getting Started
1. Clone the Repository

git clone https://github.com/your-username/weather-app.git
cd weather-app

2. Open the Project
You can directly open index.html in your browser.

3. Replace API Key (if required)
If you have a personal OpenWeatherMap API key:
•	Open main.js
•	Replace 'YOUR_API_KEY' with your actual API key
const apiKey = "YOUR_API_KEY";

How It Works
1.	User enters a city name
2.	Application sends a request to the OpenWeatherMap API
3.	Receives and parses the weather data
4.	Dynamically updates the DOM to show:
o	City name and country
o	Temperature
o	Weather condition icon
o	Wind speed
o	Humidity

Project Structure

weather-app/
│
├── index.html         # Main HTML file
├── style.css          # Stylesheet
├── main.js          # JavaScript logic and API calls
└── README.md          # Project documentation

Future Enhancements
•	Add 5-day or hourly forecast
•	Add geolocation support to fetch weather of current location
•	Add dark/light theme toggle
•	Support for multiple languages











