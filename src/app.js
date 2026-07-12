import { signIn, signOut, getUser } from './auth';
import { getUserFragments, postFragment } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const getFragmentsBtn = document.querySelector('#get-fragments');
  const postFragmentBtn = document.querySelector('#post-fragment');
  const fragmentDataInput = document.querySelector('#fragment-data');
  const fragmentTypeSelect = document.querySelector('#fragment-type');
  const fragmentsContainer = document.querySelector('#fragments-container');

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

  postFragmentBtn.onclick = async () => {
    const data = fragmentDataInput.value;
    if (!data) {
      alert('Please enter some text for your fragment first!');
      return;
    }
    
    postFragmentBtn.disabled = true;
    postFragmentBtn.innerText = 'Posting...';
    
    try {
      const type = fragmentTypeSelect.value;
      const res = await postFragment(user, data, type);
      if (res.error) {
        alert('Error posting fragment: ' + res.error);
      } else {
        fragmentDataInput.value = '';
        // refresh the fragments list
        getFragmentsBtn.click();
      }
    } finally {
      postFragmentBtn.disabled = false;
      postFragmentBtn.innerText = 'POST Fragment';
    }
  };

  getFragmentsBtn.onclick = async () => {
    // Clear previous results
    fragmentsContainer.innerHTML = '';
    
    // Do an authenticated request to the fragments API server and log the result
    const response = await getUserFragments(user);
    const fragments = response.fragments || [];

    if (fragments.length === 0) {
      fragmentsContainer.innerHTML = '<div class="empty-state">No fragments found. Create one to get started!</div>';
      return;
    }

    fragments.forEach(fragment => {
      const card = document.createElement('div');
      card.className = 'fragment-card';
      
      const dateUpdated = new Date(fragment.updated).toLocaleString();
      
      card.innerHTML = `
        <div class="fragment-type">${fragment.type}</div>
        <div class="fragment-id">ID: ${fragment.id}</div>
        <div class="fragment-meta">
          <span>Size: ${fragment.size} bytes</span>
          <span>${dateUpdated}</span>
        </div>
      `;
      
      fragmentsContainer.appendChild(card);
    });
  };
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);
