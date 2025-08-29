const usernames = ['ApeLincoln', 'TheNotoriousP.I.G.', 'Brieoncé'];

document.getElementById('search-btn').addEventListener('click', () => {
  let input = document.getElementById('username-input').value.trim().toLowerCase();
  let found = false;

  for (let i = 0; i < usernames.length; i++) {
    let current = usernames[i].toLowerCase();
    if (current === input) {
      found = true;
      break;
    }
  }

  document.getElementById('search-result').textContent = found
    ? 'Username found!'
    : 'Username not found.';
});