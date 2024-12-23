const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');

switchToSignup.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
});

switchToLogin.addEventListener('click', () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Event listener for login
// document.getElementById('login').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const email = document.getElementById('loginEmail').value;
//   const password = document.getElementById('loginPassword').value;

//   const response = await fetch('/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password })
//   });

//   const result = await response.json();
//   if (result.success) {
//     alert('Login successful');
//   } else {
//     alert('Login failed');
//   }
// });


// Assuming your form has an id="loginForm"
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    // Send login request
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await response.json();
  
    // Check if login is successful
    if (data.success) {
      // Redirect to the complaint page on successful login
      window.location.href = '/complaint.html';
    } else {
      // Show error message
      alert(data.message);
    }
  });
  

// Event listener for signup
document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  const response = await fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });

  const result = await response.json();
  if (result.success) {
    alert('Signup successful');
  } else {
    alert('Signup failed');
  }
});
