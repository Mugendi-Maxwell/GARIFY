document.addEventListener("DOMContentLoaded", function () {
  // Fetch and display cars already available for sale
  fetch("http://localhost:3000/cars")
    .then((response) => response.json())
    .then((data) => displayData(data))
    .catch((error) => console.error("Error fetching car data:", error));

  // Add car button event listener
  document.getElementById('add-car-button').addEventListener('click', addNewCar);

  // Add search button event listener for searching a car image URL
  document.getElementById('search-car-image-button').addEventListener('click', searchCarImage);
});

// Function to display the list of cars available for sale
function displayData(carData) {
  const carList = document.getElementById("car-list");
  carList.innerHTML = ""; // Clear previous list

  carData.forEach((car) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${car.name} `;
    listItem.onclick = () => displayCarDetails(car);
    carList.appendChild(listItem);
  });
}

// Function to display car details when a car is clicked
function displayCarDetails(car) {
  const carInfoDiv = document.getElementById("car-info");

  carInfoDiv.innerHTML = `
    <h2>${car.name} (${car.year})</h2>
    <img src="${car.photo_url}" alt="${car.name}">
    <p><strong>Price:</strong> ${car.price}</p>
    <p><strong>Mileage:</strong> ${car.mileage}</p>
    <p><strong>Engine:</strong> ${car.engine}</p>
    <p><strong>Transmission:</strong> ${car.transmission}</p>
    <button id="buy-button">Buy</button>
    <button id="delete-button" style="margin-left: 10px;">Delete</button>
  `;

  // Buy button functionality
  const buyButton = document.getElementById("buy-button");
  buyButton.onclick = () => alert(`You have successfully bought the ${car.name}!`);

  // Delete button functionality
  const deleteButton = document.getElementById("delete-button");
  deleteButton.onclick = () => deleteCar(car.id);
}

// Function to handle adding a new car
function addNewCar() {
  // Get form values
  const name = document.getElementById("new-car-name").value;
  const mileage = document.getElementById("new-car-mileage").value;
  const year = document.getElementById("new-car-year").value;
  const price = document.getElementById("new-car-price").value;
  const engine = document.getElementById("new-car-engine").value;
  const transmission = document.getElementById("new-car-transmission").value;
  const photoUrl = document.getElementById("new-car-photo").value;

  // Create new car object
  const newCar = {
    name: name,
    mileage: mileage,
    year: parseInt(year),
    price: price,
    engine: engine,
    transmission: transmission,
    photo_url: photoUrl
  };

  // POST request to add the new car to the server
  fetch("http://localhost:3000/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newCar)
  })
    .then((response) => response.json())
    .then((addedCar) => {
      // Add the new car to the list dynamically
      const carList = document.getElementById("car-list");
      const listItem = document.createElement("li");
      listItem.textContent = `${addedCar.name} (${addedCar.year}) - $${addedCar.price}`;
      listItem.onclick = () => displayCarDetails(addedCar);
      carList.appendChild(listItem);

      // Clear the form inputs
      document.getElementById("new-car-name").value = "";
      document.getElementById("new-car-mileage").value = "";
      document.getElementById("new-car-year").value = "";
      document.getElementById("new-car-price").value = "";
      document.getElementById("new-car-engine").value = "";
      document.getElementById("new-car-transmission").value = "";
      document.getElementById("new-car-photo").value = "";

      // Optionally, show a success message
      alert('New car added for sale!');
    })
    .catch((error) => console.error("Error adding car:", error));
}

// Function to delete a car
function deleteCar(carId) {
  fetch(`http://localhost:3000/cars/${carId}`, {
    method: "DELETE"
  })
    .then(() => {
      // Remove the deleted car from the list
      const carList = document.getElementById("car-list");
      const listItems = carList.querySelectorAll("li");

      listItems.forEach((item) => {
        if (item.textContent.includes(carId)) {
          item.remove();
        }
      });

      // Optionally, show a success message
      alert('Car deleted successfully!');
    })
    .catch((error) => console.error("Error deleting car:", error));
}

// Function to search for car images
function searchCarImage() {
  const searchQuery = document.getElementById("search-car-image").value;
  const searchResultDiv = document.getElementById("search-result");

  // Replace 'YOUR_UNSPLASH_API_KEY' with your actual Unsplash API key
  fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=q51vsfDzWylhVSodBpQL0ixLZ7LTZq-5WRgRBIR4mKY`)
    .then((response) => response.json())
    .then((data) => {
      searchResultDiv.innerHTML = ''; // Clear previous results
      if (data.results.length > 0) {
        const imgUrl = data.results[0].urls.small;
        const imgElement = document.createElement('img');
        imgElement.src = imgUrl;
        imgElement.alt = searchQuery;
        imgElement.style = 'width: 100%; max-width: 400px; height: auto;';
        searchResultDiv.appendChild(imgElement);
      } else {
        searchResultDiv.textContent = 'No image found for your search query.';
      }
    })
    .catch((error) => {
      console.error("Error fetching image:", error);
      searchResultDiv.textContent = 'Error fetching image.';
    });
}






