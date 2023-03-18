// Function takes two objects, that contain coordinates to a starting and destination location.
export default getDistance = (startingCoords, destinationCoords) => {
  let startingLat = degreesToRadians(startingCoords.latitude);
  let startingLong = degreesToRadians(startingCoords.longitude);
  let destinationLat = degreesToRadians(destinationCoords.latitude);
  let destinationLong = degreesToRadians(destinationCoords.longitude);

  // Radius of the Earth in kilometers
  let radius = 6571;
  console.log(startingCoords, destinationCoords, 'cvbcbcvbcv');

  // Haversine equation
  let distanceInKilometers =
    Math.acos(
      Math.sin(startingLat) * Math.sin(destinationLat) +
        Math.cos(startingLat) *
          Math.cos(destinationLat) *
          Math.cos(startingLong - destinationLong),
    ) * radius;

  return distanceInKilometers * 1000;
};

// Convert from degrees to radians
function degreesToRadians(degrees) {
  var radians = (degrees * Math.PI) / 180;
  return radians;
}
