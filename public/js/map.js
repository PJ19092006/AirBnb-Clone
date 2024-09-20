// Initialize the map centered on the default location (Delhi)
var map = L.map("map").setView([28.6139, 77.209], 10);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

var marker;
