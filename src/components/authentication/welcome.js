//NOT IN USE
// Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdGZJB4ezq6nLXJF6mYQedY9vPCAlnxgU",
  authDomain: "askmarkchromeextension.firebaseapp.com",
  projectId: "askmarkchromeextension",
  storageBucket: "askmarkchromeextension.appspot.com",
  messagingSenderId: "845163707320",
  appId: "1:845163707320:web:ff1507307bbb7a2e262d4d",
  measurementId: "G-BWSLC1PXWX",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = firebase.auth();

// Configure Google provider
const provider = new firebase.auth.GoogleAuthProvider();

// Get the login button
const loginButton = document.getElementById('login-button');
// Get the Google login button
const googleLoginButton = document.getElement

// Add a click event listener to the login button
loginButton.addEventListener('click', () => {
  console.log('Login button clicked!');
});

// Remove the existing click event listener for the Google login button and implement Firebase Google login
googleLoginButton.addEventListener("click", () => {
  signInWithGoogle();
});

function signInWithGoogle() {
  auth.signInWithPopup(provider)
    .then((result) => {
      console.log("User signed in with Google:", result.user);
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);
    });
}