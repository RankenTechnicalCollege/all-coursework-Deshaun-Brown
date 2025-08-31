// userProfile.js

// Define the user profile object
const userProfile = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  isOnline: false
};

window.fetchUserProfile = async function() {
  
  return userProfile;
}

// Async function to display profile info
async function displayProfile() {
  const profile = await fetchUserProfile();
  const profileDiv = document.getElementById('profileDisplay');
  profileDiv.innerHTML = `
    <p><strong>Name:</strong> ${profile.name}</p>
    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>Status:</strong> ${profile.isOnline ? "Online" : "Offline"}</p>
  `;
}

// Async function to update email
async function updateEmail(newEmail) {
  userProfile.email = newEmail;
  await displayProfile(); // Re-render after update
}

// DOMContentLoaded setup
document.addEventListener('DOMContentLoaded', async () => {
  await displayProfile();

  const updateBtn = document.getElementById('updateBtn');
  updateBtn.addEventListener('click', async () => {
    const newEmail = document.getElementById('emailInput').value.trim();
    if (newEmail) {
      await updateEmail(newEmail);
    }
  });
});