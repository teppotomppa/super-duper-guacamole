# Train Location Tracker Documentation

## 1. Project Overview

### Project Name: Train Location Tracker

### Description:

The Train Location Tracker is a web application that retrieves real-time train location data from the DigiTraffic API and displays the train locations on an interactive map. The map updates automatically every 15 seconds to show the current positions of the trains in Finland. Users can view detailed information about each train by clicking on the map markers.

### Key Features:

- Fetches real-time train location data from the DigiTraffic API.
- Displays train locations on a dynamic, interactive map.
- Automatically updates the map every 15 seconds.
- Shows train information (e.g., train number, speed) on click.
- Simple, user-friendly interface for tracking train locations.

---

## 2. Technologies Used

- **HTML**: For the structure of the webpage.
- **CSS**: For styling the webpage.
- **JavaScript**: For fetching data from the DigiTraffic API, handling map functionality, and displaying train information.
- **Leaflet.js**: A JavaScript library for creating interactive maps and adding markers.
- **Fetch API**: Used to make HTTP requests to the DigiTraffic API asynchronously and handle the data.
- **OpenStreetMap**: Used as the map tile provider to display the map.

---

## 3. Installation and Setup

To run this project locally, follow these steps:

### Prerequisites:

- A web browser (e.g., Google Chrome, Mozilla Firefox, etc.).

### Steps

#### **Option 1: Clone the repository (with Git)**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/teppotomppa/super-duper-guacamole
   cd super-duper-guacamole
   ```

2. **Set up the files:** Ensure that you have the following files in the root directory:

   - `index.html`
   - `styles.css`
   - `scripts.js`

3. **Open the project:** Open the `index.html` file in your preferred web browser:

   - Right-click on the `index.html` file and select **Open with** > **[Your Browser]**.

4. **Enjoy:** The map should now display train locations that are automatically updated every 15 seconds.

---

#### **Option 2: Download as ZIP (Without Git)**

1. **Download the ZIP file:**

   - Go to the GitHub repository: [https://github.com/teppotomppa/super-duper-guacamole](https://github.com/teppotomppa/super-duper-guacamole)
   - Click the **Code** button (green button near the top right).
   - From the dropdown menu, click **Download ZIP**.

2. **Unzip the downloaded file:**

   - Once the ZIP file is downloaded, unzip it to a folder of your choice.

3. **Set up the files:** Ensure that you have the following files in the root directory after unzipping:

   - `index.html`
   - `styles.css`
   - `scripts.js`

4. **Open the project:** Open the `index.html` file in your preferred web browser:

   - Right-click on the `index.html` file and select **Open with** > **[Your Browser]**.

5. **Enjoy:** The map should now display train locations that are automatically updated every 15 seconds.

---

## 4. Project Structure

Here is the breakdown of the files and directories used in this project:

- **index.html**: Contains the structure of the webpage, including the map container and the train information section.
- **styles.css**: Contains the styles for the webpage, including the layout for the map and the information sidebar.
- **scripts.js**: Contains the logic to fetch train location data from the DigiTraffic API, update the map with the train markers, and display additional information when a marker is clicked.
- **trainMoving.png & trainStopped.png**: Images that are used in the application.

---

## 5. API Integration

This project uses the DigiTraffic API to fetch real-time train location data. Here's how it's integrated into the project:

### API Endpoint:

The data is fetched from the following API endpoint:

```
https://rata.digitraffic.fi/api/v1/train-locations.geojson/latest/
```

This endpoint returns the latest train location data in GeoJSON format. The features in the GeoJSON response include the train number, location coordinates, speed, and more.

### How Data is Used:

1. **Fetching Data**: The `fetchData()` function sends a GET request to the API to retrieve the latest train location data.
2. **Updating Map**: The train location data is parsed and used to update the position of markers on the map. Each marker represents a train and its current location.
3. **Automatic Updates**: The map is automatically updated every 15 seconds to reflect the latest train locations by calling `fetchData()` using `setInterval()`.

---

## 6. Functionality

Here are the key functions in the project:

- **fetchData()**:

  - Fetches the latest train location data from the DigiTraffic API.
  - Adds new markers to the map for each train.
  - Updates existing markers with new coordinates if the train has moved.
  - Removes markers for trains that are no longer in the API response.

- **displayTrainInfo(trainNumber)**:

  - Displays detailed information about a selected train when its marker is clicked on the map.
  - The information displayed includes the train number, speed, and the last time the location was updated.

- **Map Update**:
  - The map is automatically refreshed every 15 seconds to reflect new train locations.

---

## 7. User Interface Design

### Map UI:

- The map is displayed using Leaflet.js and centered on Finland.
- Each train’s location is represented by a clickable marker.
- Clicking on a marker will display additional information about the train.

### Information Panel:

- When a user clicks on a train’s marker, an information panel appears on top of the clicked train and shows the train number, speed, and time of the last location update.

### Automatic Updates:

- The map automatically refreshes every 15 seconds, ensuring the train locations are always up to date.

---

## 8. Challenges and Solutions

- **Challenge**: Automatically updating the train markers on the map without performance issues.

  - **Solution**: Used `setInterval()` to fetch updated train data every 15 seconds. Old markers were efficiently removed, and new ones added to reflect real-time locations.

- **Challenge**: Adding a search feature to locate specific trains.
  - **Solution**: Implemented a `<select>` dropdown menu in the HTML to list all active train numbers. When a user selects a train, the program fetches its location and zooms in on the map to highlight it.

---

## 9. Future Improvements

- **More Detailed Train Information**: Include additional details such as departure station, destination, current city, and estimated arrival at the next station.
- **Train Type Indicator**: Show whether the train is a passenger train or a cargo train.
- **Enhanced Error Handling**: Add better user-facing error messages and fallback options in case the API fails or data is unavailable.

---

## 10. Conclusion

The Train Location Tracker is a simple yet powerful web application for tracking trains in real-time. With the integration of the DigiTraffic API and Leaflet.js, users can view up-to-date information on train locations across Finland. The automatic updates every 15 seconds ensure that the map always reflects the current status of the trains, and the clear, responsive UI enhances the user experience.
