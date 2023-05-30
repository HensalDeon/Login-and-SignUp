
const fs = require("fs");
const path = require("path");

// Function to add user details to the JSON file
function addUser(user) {
  const filePath = path.join(__dirname, "../data/users.json");

  try {
    // Read the existing data from the JSON file
    let data = fs.readFileSync(filePath, "utf8");

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    // Check if the user already exists
    const userExists = users.some((existingUser) => existingUser.email === user.email);

    if (!userExists) {
      // Add the new user to the array
      users.push(user);

      // Write the updated data back to the JSON file
      fs.writeFileSync(filePath, JSON.stringify(users));

      console.log("User added successfully");
    } else {
      console.log("User already exists");
    }
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
  }
}

// Function to check if the user already exists in the JSON file
function checkUserExists(user) {
  const filePath = path.join(__dirname, "../data/users.json");

  try {
    // Read the existing data from the JSON file
    let data = fs.readFileSync(filePath, "utf8");

    let users = [];
    if (data) {
      users = JSON.parse(data);
    }

    // Check if the user already exists
    const userExists = users.some((existingUser) => existingUser.email === user.email);

    return userExists;
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return false;
  }
}

module.exports = { addUser, checkUserExists };

