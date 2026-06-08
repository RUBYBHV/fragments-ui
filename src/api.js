// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const fragmentsUrl = new URL('/v1/fragments', apiUrl);
    const res = await fetch(fragmentsUrl, {
      // Generate headers with the proper Authorization bearer token to pass.
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
    return { error: err.message };
  }
}

export async function postFragment(user, fragmentData) {
  console.log('Posting user fragment data...');
  try {
    const fragmentsUrl = new URL('/v1/fragments', apiUrl);
    const res = await fetch(fragmentsUrl, {
      method: 'POST',
      headers: {
        ...user.authorizationHeaders(),
        'Content-Type': 'text/plain',
      },
      body: fragmentData,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully posted user fragment data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
    return { error: err.message };
  }
}
