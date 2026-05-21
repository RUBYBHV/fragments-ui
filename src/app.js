import { signIn, signOut, getUser } from './auth';
import { getUserFragments } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const getFragmentsBtn = document.querySelector('#get-fragments');
  const fragmentsData = document.querySelector('#fragments-data');

  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects)
    signIn();
  };

  logoutBtn.onclick = () => {
    signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    return;
  }

  // Update the UI to welcome the user
  userSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button and show Logout button
  loginBtn.disabled = true;
  loginBtn.hidden = true;
  logoutBtn.hidden = false;

  getFragmentsBtn.onclick = async () => {
    // Do an authenticated request to the fragments API server and log the result
    const userFragments = await getUserFragments(user);
    fragmentsData.innerText = JSON.stringify(userFragments, null, 2);
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
