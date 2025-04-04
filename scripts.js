/**
 * Author: Thomas Sihvola
 * Date: April 4, 2025
 * Program: Train Location Tracker
 * Description:
 * This program creates an interactive map using Leaflet.js to display real-time train locations in Finland.
 * It fetches train data from the Digitraffic API every 15 seconds and updates the map with markers
 * representing moving and stopped trains. Users can search for specific trains using a dropdown menu
 * and zoom in on their locations. The program also handles adding and removing train markers dynamically
 * based on the latest data.
 *
 * Features:
 * - Real-time train location updates with custom icons for moving and stopped trains.
 * - Dropdown menu for selecting and searching specific trains.
 * - Automatic removal of outdated train markers.
 * - Error handling for API requests and user interactions.
 *
 * Dependencies:
 * - Leaflet.js for map rendering.
 * - Digitraffic API for train location data.
 *
 * Usage:
 * - Open the HTML file containing this script in a browser.
 * - Ensure the required assets (e.g., trainMoving.png, trainStopped.png) are in the same directory.
 * - Interact with the map and dropdown menu to view train locations.
 */

let map;
let trainMarkersMap = new Map();

/**
 * Initializes the map and sets up event listeners.
 * Fetches train data periodically and updates the map.
 */
document.addEventListener("DOMContentLoaded", function () {
  // Create the map and set the initial view to Finland
  map = L.map("map").setView([63, 26], 6);

  // Add OpenStreetMap tiles to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Fetch train data every 15 seconds to keep the map updated
  setInterval(fetchData, 15000);
  console.log("Fetching train data every 15 seconds...");

  // Fetch initial train data when the page loads
  fetchData();

  // Add event listener for dropdown selection + search
  document
    .getElementById("trainSearchButton")
    .addEventListener("click", function () {
      const dropdownValue = document.getElementById("trainDropdown").value;

      if (dropdownValue) {
        searchTrain(dropdownValue);
      }
    });
});

// Define custom icons for moving and stopped trains
var trainMovingIcon = L.icon({
  iconUrl: "trainMoving.png",
  iconSize: [35, 35],
});

var trainStoppedIcon = L.icon({
  iconUrl: "trainStopped.png",
  iconSize: [35, 35],
});

/**
 * Fetches train data from the Digitraffic API and updates the map.
 * Adds, updates, or removes train markers based on the latest data.
 */
async function fetchData() {
  const newTrainNumbers = new Set(); // Set to track train numbers in the latest data

  try {
    const response = await fetch(
      "https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const geojson = await response.json();
    console.log("Train data: ", geojson);

    const currentTime = new Date().toLocaleTimeString();
    console.log(`Data updated at ${currentTime}`);

    // Process each train feature in the GeoJSON data
    geojson.features.forEach((feature) => {
      const coordinates = feature.geometry.coordinates;
      const lat = coordinates[1];
      const lon = coordinates[0];
      const trainNumber = feature.properties.trainNumber;
      const speed = feature.properties.speed;

      newTrainNumbers.add(trainNumber); // Track the train number

      // Determine the appropriate icon based on the train's speed
      const icon = speed === 0 ? trainStoppedIcon : trainMovingIcon;

      if (trainMarkersMap.has(trainNumber)) {
        // Update existing marker
        const marker = trainMarkersMap.get(trainNumber);
        marker.setLatLng([lat, lon]);
        marker.setPopupContent(
          `Train number: ${trainNumber}<br>Speed: ${speed} km/h<br>Location updated at ${currentTime}`
        );
        marker.setIcon(icon);
      } else {
        // Add a new marker for the train
        const marker = L.marker([lat, lon], { icon: icon })
          .addTo(map)
          .bindPopup(
            `Train number: ${trainNumber}<br>Speed: ${speed} km/h<br>Location updated at ${currentTime}`
          );
        trainMarkersMap.set(trainNumber, marker);
      }
    });

    // Remove markers for trains that are no longer in the latest data
    trainMarkersMap.forEach((marker, trainNumber) => {
      if (!newTrainNumbers.has(trainNumber)) {
        map.removeLayer(marker);
        trainMarkersMap.delete(trainNumber);
      }
    });
  } catch (error) {
    console.error("Error fetching train data:", error);
  }

  // Update the dropdown menu with the latest train numbers
  const dropdown = document.getElementById("trainDropdown");
  dropdown.innerHTML = "";

  const sortedTrainNumbers = Array.from(newTrainNumbers).sort((a, b) => a - b);

  // Add a default option to the dropdown
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "Select a train";
  dropdown.appendChild(defaultOption);

  // Add options for each train number
  sortedTrainNumbers.forEach((trainNumber) => {
    const option = document.createElement("option");
    option.value = trainNumber;
    option.text = trainNumber;
    dropdown.appendChild(option);
  });

  // Only add the search button listener once, after dropdown exists
  if (!document.getElementById("trainSearchButton").dataset.listenerAdded) {
    document
      .getElementById("trainSearchButton")
      .addEventListener("click", function () {
        const dropdown = document.getElementById("trainDropdown");

        // Prevent crashing if somehow elements still aren't there
        if (!dropdown) return;

        const dropdownValue = dropdown.value;
        const trainNumber = dropdownValue;

        if (trainNumber) {
          searchTrain(trainNumber);
        }
      });

    // Mark listener as added to avoid duplicates
    document.getElementById("trainSearchButton").dataset.listenerAdded = "true";
  }
}

/**
 * Search for a specific train by its number and zoom to its location
 */
async function searchTrain(trainNumber) {
  try {
    const response = await fetch(
      "https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const geojson = await response.json();

    // Find the train with the matching train number
    const train = geojson.features.find(
      (feature) => feature.properties.trainNumber.toString() === trainNumber
    );

    if (train) {
      const coordinates = train.geometry.coordinates; // Get train coordinates
      const lat = coordinates[1];
      const lon = coordinates[0];
      const speed = train.properties.speed; // Train speed

      // Determine the appropriate icon based on the train's speed
      const icon = speed === 0 ? trainStoppedIcon : trainMovingIcon;

      // Zoom in on the train's location
      map.setView([lat, lon], 12);

      // Add a popup for the train's location
      const popupContent = `Train number: ${trainNumber}<br>Speed: ${speed} km/h<br>Location updated at ${new Date().toLocaleTimeString()}`;
      L.popup().setLatLng([lat, lon]).setContent(popupContent).openOn(map);
    } else {
      alert(`Train number ${trainNumber} not found.`); // Show an alert if the train is not found
    }
  } catch (error) {
    console.error("Error searching for train:", error);
    alert("An error occurred while searching for the train.");
  }
}
