// Global Variables
let authToken;

/*******************************
*          DOM Elements
*******************************/
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const homeButton = document.getElementById('homeButton');
const aiEmailButton = document.getElementById('aiEmailButton');
const chatBotButton = document.getElementById('chatBotButton');
const jobDescriptionButton = document.getElementById('jobDescriptionButton');
const importEmailsButton = document.getElementById('importEmailsButton');

/*******************************
*     ChatBot DOM Elements
*******************************/
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatHistory = document.getElementById('chatHistory');
const emailSequencerButton = document.getElementById('emailSequencerButton');


/*******************************
*      Screen Containers
*******************************/
const welcomeScreen = document.getElementById('welcomeScreen');
const aiEmailResponder = document.getElementById('aiEmailResponder');
const chatBotContainer = document.getElementById('chatBotContainer');
const aiResponderContainer = document.getElementById('aiResponderContainer');
const salesInformationContainer = document.getElementById('salesInformationContainer');
const jobDescriptionContainer = document.getElementById('jobDescriptionContainer');
const emailSequencerContainer = document.getElementById('emailSequencerContainer');

// Group all containers for easy manipulation
const allContainers = [welcomeScreen, aiEmailResponder, chatBotContainer, aiResponderContainer, salesInformationContainer, jobDescriptionContainer, emailSequencerContainer];

/*******************************
*      Container Functions
*******************************/
// Function to hide all containers
function hideAllContainers() {
    allContainers.forEach(container => container.style.display = 'none');
}
// Function to show a container
function showContainer(container) {
    container.style.display = 'block';
}

/*******************************
*     NAVIGATION Event Listeners
*******************************/
// Event Listener for Home Button
homeButton.addEventListener('click', () => {
    hideAllContainers();
    showContainer(welcomeScreen);
});

// Event Listener for AI Email Button
aiEmailButton.addEventListener('click', () => {
  hideAllContainers();
  showContainer(emailSequencerContainer);
});

// Event Listener for job description button
jobDescriptionButton.addEventListener('click', () => {
  hideAllContainers();
  showContainer(jobDescriptionContainer);
});
// Event Listener for Chat Bot Button
chatBotButton.addEventListener('click', () => {
  hideAllContainers();
  showContainer(chatBotContainer);
});

// Event Listener for Email Sequencer Button
emailSequencerButton.addEventListener('click', () => {
  hideAllContainers();
  showContainer(emailSequencerContainer);
});

importEmailsButton.addEventListener('click', () => {
  importEmails();
});


/*******************************
*      BUTTON EVENT Listeners
*******************************/

// Event Listener for Import Emails Button
importEmailsButton.addEventListener('click', () => {
  // TODO: Write the function to import emails
});


// Event Listener for AI CHATBOT send Button
sendButton.addEventListener('click', async () => {
  const userMessage = chatInput.value;
  chatInput.value = '';

  chatHistory.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  
  const systemRole = "You are friendly assistant that responds to every message with a deep texan accent.";
  const aiResponse = await chatGPT(userMessage, systemRole);
  chatHistory.innerHTML += `<p><strong>AI:</strong> ${aiResponse}</p>`;
});

// Event Listener for Login Button
loginButton.addEventListener('click', () => handleAuth(true));

// Event Listener for Logout Button
logoutButton.addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://accounts.google.com/o/oauth2/revoke?token=${authToken}`);
    xhr.onload = function() {
        chrome.identity.removeCachedAuthToken({ token: authToken }, function() {
            loginButton.style.display = 'block';
            logoutButton.style.display = 'none';
            authToken = null;
        });
    };
    xhr.send();
});

/*
 ********************************************************
 *                     AI FUNCTIONS                     *
 *                                                      *
 *               I'm a friendly AI Robot!               *
 *                  __     __                           *
 *                 |  \~~~/  |                          *
 *                 |-._-._-_|                           *
 *                 | o     o ||                         *
 *                 \_________/                          *
 *                  _|     |_                           *
 *                                                      *
 ********************************************************
*/


// chatGPT function
const chatGPT = async (prompt, systemRole, model = 'gpt-4', maxTokens = 2550, temperature = 0.8) => {
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  const API_KEY = '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';

  const messages = [
      { role: 'system', content: systemRole },
      { role: 'user', content: prompt },
  ];

  const requestData = {
      model: model,
      messages,
      max_tokens: maxTokens,
      temperature: temperature,
  };

  try {
      const response = await fetch(
          API_URL,
          {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData)
          }
      );

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
          return data.choices[0].message.content; // Return the generated message content
      } else {
          // Handle the case where no message content is returned
          throw new Error('No message content generated.');
      }
  } catch (error) {
      // Handle errors
      console.error('Error with OpenAI API:', error);
  }
};


/*
 ********************************
 *  JOB DESCRIPTION GENERATOR   *
 ********************************
*/

// Get the input fields
const jobTitleInput = document.getElementById('jobTitle');
const jobResponsibilitiesInput = document.getElementById('jobResponsibilities');
const requiredSkillsInput = document.getElementById('requiredSkills');
const requiredEducationInput = document.getElementById('requiredEducation');
const companyCultureInput = document.getElementById('companyCulture');
const salaryRangeInput = document.getElementById('salaryRange');
const jobLocationInput = document.getElementById('jobLocation');

// Get the output textarea
const jobDescriptionOutput = document.getElementById('jobDescriptionOutput');

// Add event listener for the "Generate Job Description" button
document.getElementById('generateJobDescription').addEventListener('click', async () => {
  // Construct the prompt in a more conversational style
  const prompt = `
    I need you to generate a job description for a position. Here are the details:
    The job title is ${jobTitleInput.value}.
    The responsibilities of the job are ${jobResponsibilitiesInput.value}.
    The required skills for this job are ${requiredSkillsInput.value}.
    The required education for this job is ${requiredEducationInput.value}.
    Our company culture can be described as ${companyCultureInput.value}.
    The salary range for this job is ${salaryRangeInput.value}.
    The location of the job is ${jobLocationInput.value}.
  `;

  // Call the chatGPT function with a specific system role for job descriptions
  const jobDescription = await chatGPT(prompt, 'You are a helpful assistant that specializes in generating job descriptions.', 'gpt-3.5-turbo', 1000);

  // Display the generated job description
  jobDescriptionOutput.value = jobDescription;
});
/*
 ***************************************
 *  JOB POSTING SCHEMA GENERATOR        *
 *                                       *
 *    ____  ____  ____  ____  ____       *
 *   ||J ||||O ||||B ||||P ||||S ||      *
 *   ||__||||__||||__||      *
 *   |/__\||/__\||/__\||/__\||/__\|      *
 *                                       *
 ***************************************
*/

// Add event listener for the "Generate Job Posting Schema" button
document.getElementById('generateJobPostingSchema').addEventListener('click', async () => {
  // Construct the prompt in a more conversational style
  const prompt = `
    I need you to generate a job posting schema for a position. Here are the details:
    The job description is ${jobDescriptionOutput.value}.
  `;

  // Call the chatGPT function with a specific system role for job posting schema
const jobPostingSchema = await chatGPT(prompt, 'You are a helpful assistant that specializes in generating job posting schema in JSON-LD.', 'gpt-3.5-turbo', 1000);

  // Display the generated job posting schema
  document.getElementById('jobPostingSchemaOutput').value = jobPostingSchema;
});


/********************************
 *  AI EMAIL GENERATOR FUNCTIONS *
 ********************************
*/


// AI EMAIL GENERATOR BASED ON SUMMARY OF PRODUCT OR JUST PROMPT AND STANDARD AI PROMPT
document.querySelector('#generateEmailProposal').addEventListener('click', async () => {
  const customPrompt = document.querySelector('#customPrompt').value;
  const systemRole = 'You are a helpful assistant that specializes in crafting effective sales emails.'; // Customize this as needed
  const aiResponse = await chatGPT(customPrompt, 2550, 0.8, systemRole);
  document.querySelector('#aiOutput').value = aiResponse;
});


/***************************************************
 * 
*  AI PERSONALITY SUMMARY OR CLIENT AND BUSINESS
TO DO *
***************************************************
*/

// AI SECTION TO CREATE PROFILE AND SUMMMARY OF PERSON BUSINESS PRODUCT
document.querySelector('#generateSummary').addEventListener('click', async () => {
  const businessInfo = document.querySelector('#businessInfo').value;
  const product = document.querySelector('#product').value;
  const aboutProduct = document.querySelector('#aboutProduct').value;
  const problem = document.querySelector('#problem').value;
  const solution = document.querySelector('#solution').value;

  const additionalPrompt = "Please provide a detailed summary of the following information:";  // This could come from anywhere in your code
  const customPrompt = generatePrompt(businessInfo, product, aboutProduct, problem, solution, additionalPrompt);

  const aiResponse = await chatGPT(customPrompt);

  document.querySelector('#aiSalesSummary').value = aiResponse;
});

const generatePrompt = (businessInfo, product, aboutProduct, problem, solution, additionalPrompt) => {
  let customPrompt = `Business Info: ${businessInfo}\nProduct to be Sold: ${product}\nAbout Product: ${aboutProduct}\nClient Problem: ${problem}\nProposed Solution: ${solution}`;
  
  if (additionalPrompt) {
    customPrompt += '\n' + additionalPrompt;
  }
  
  return customPrompt;
}



/*
 ****************************
 *  AI IMPORT EMAIL TEST      *
 ****************************
*/


////IMPORT EMAIL AI
// Function for API call in Import Email container
const importEmailAPI = async (emailContent) => {
  try {
    const prompt = emailContent; // Set the email content as the prompt for the API call

    // Set the API URL and API key
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const API_KEY = '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';

    // Prepare the messages object for the API request
    const messages = [
      { role: 'system', content: 'You specialist in API call success. Matches requests to answers' },
      { role: 'user', content: "Create a list in the text box of interesting things that can be extracted from the Gmail API plug in"},
    ];

    // Prepare the functions object for the API request
    const functions = [
      {
        name: 'get_total_emails_last_year',
        description: 'Get the total number of emails received last year',
        parameters: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'The user ID or email address of the Gmail account',
            },
          },
          required: ['userId'],
        },
      },
    ];

    // Prepare the request data object
    const requestData = {
      model: 'gpt-4-0613',
      messages,
      functions,
      function_call: 'auto', // Allow the model to decide whether to call the function
    };

    // Make the API call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const generatedMessage = data.choices[0].message.content;
      document.getElementById('largeTextBox').value = generatedMessage; // Set the generated message in the text box
    } else {
      // Handle the case where no message content is returned
      throw new Error('No message content generated.');
    }
  } catch (error) {
    // Handle errors
    console.error('Error with OpenAI API:', error);
  }
};




/*
 ********************************************
 *            Email Scheduler               *
 *                                          *
 *     Hi, I'm an AI, here to assist you!   *
 *            ____     ____                 *
 *           | o  \ _ /  o |                *
 *           | .-.   .-.  |                *
 *           | |_|   |_|  |                *
 *            \___/\___/                  *
 *            (_|     |_)                  *
 *                                          *
 ********************************************
*/



// Initialize the Gmail API client
function initClient() {
  gapi.client.init({
    'apiKey': 'AIzaSyA4C1t2JPOWyPxENRyTtbupTIH1EZHINiU',
    'clientId': '1055963763899-fgnubtl1rpgrsv4e3iidpuameig9opa5.apps.googleusercontent.com',
    'scope': 'https://www.googleapis.com/auth/gmail.metadata',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest']
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

// Update the UI based on the user's sign-in status
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    // The user is signed in, so we can make API calls
    listMessagesWithLabel('me', 'Label_1', displayMessages);
  } else {
    // The user is not signed in, so we should prompt them to do so
    gapi.auth2.getAuthInstance().signIn();
  }
}

// List messages with a specific label
function listMessagesWithLabel(userId, label, callback) {
  var request = gapi.client.gmail.users.messages.list({
    'userId': userId,
    'q': 'label:' + label
  });

  request.execute(callback);
}

// Get a specific message and display its metadata
function getMessage(userId, messageId, callback) {
  var request = gapi.client.gmail.users.messages.get({
    'userId': userId,
    'id': messageId,
    'metadataHeaders': ['To', 'Date', 'Subject']
  });

  request.execute(callback);
}

// Callback function for displaying messages
function displayMessages(response) {
  var messages = response.messages;
  var emailBox = document.getElementById('emailBox'); // Get the email box from the DOM
  
  if (messages) {
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      
      // Get the message and display its metadata
      getMessage('me', message.id, function(message) {
        var headers = message.payload.headers;
        
        var to = headers.find(header => header.name === 'To').value;
        var date = headers.find(header => header.name === 'Date').value;
        var subject = headers.find(header => header.name === 'Subject').value;
        
        // Create a new element for the email, and add it to the email box
        var emailElement = document.createElement('div');
        emailElement.innerHTML = '<p><strong>To:</strong> ' + to + '</p>' +
                                 '<p><strong>Date:</strong> ' + date + '</p>' +
                                 '<p><strong>Subject:</strong> ' + subject + '</p>';
        emailBox.appendChild(emailElement);
      });
    }
  } else {
    console.log('No new messages.');
  }
}


/*
 ************************
 *  OLD EMAIL FUNCTIONS  *
 ************************
*/
// Initial auth token check
handleAuth(false);

// Function to retrieve email ID
function retrieveEmailId() {
  chrome.storage.local.get(['emailId'], function(result) {
    console.log('Value currently is ' + result.emailId);
    // Here you can use the retrieved emailId as result.emailId
    // For example, you could pass it to another function:
    // anotherFunction(result.emailId);
  });
}

// EMAIL ID Event listener
document.getElementById("import").addEventListener("click", function() {
  chrome.storage.local.get(['emailId'], function(result) {
    if (result.emailId === undefined) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        if (url.includes("mail.google.com")) {  // Check if URL contains "mail.google.com"
          var lastSegment = url.split("/").pop();  // Split the URL by '/' and take the last segment
          console.log(lastSegment);

          // Save the last segment (email ID) in chrome.storage.local
          chrome.storage.local.set({'emailId': lastSegment}, function() {
            console.log('Value is set to ' + lastSegment);
            document.getElementById("EmailID").textContent = lastSegment;
          });
        }
      });
    } else {
      console.log('Value currently is ' + result.emailId);
      document.getElementById("EmailID").textContent = result.emailId;
    }
  });
});

function getGmailMessageDetails(emailId, authToken) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}`);
  xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var message = JSON.parse(xhr.responseText);
      var headers = message.payload.headers;

      // Extract the 'From' header
      var fromHeader = headers.find(header => header.name === 'From');
      var from = fromHeader ? fromHeader.value : 'Unknown';

      // Extract the 'Subject' header
      var subjectHeader = headers.find(header => header.name === 'Subject');
      var subject = subjectHeader ? subjectHeader.value : 'No subject';

      // Set the fields in the UI
      document.getElementById('From').textContent = from;
      document.getElementById('snippet').textContent = subject;

      // Insert the JSON response into 'jsonContainer'
      document.getElementById('jsonContainer').textContent = JSON.stringify(message, null, 2);
    } else {
      console.log('Failed to get message details');
    }
  };
  xhr.send();
}

/*
 ************************
 *  EMAIL GET BY ID  *
 ************************
*/


document.getElementById("import").addEventListener("click", function() {
  chrome.storage.local.get(['emailId'], function(result) {
    if (result.emailId === undefined) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var url = tabs[0].url;
        if (url.includes("mail.google.com")) {
          var lastSegment = url.split("/").pop();
          console.log(lastSegment);

          chrome.storage.local.set({'emailId': lastSegment}, function() {
            console.log('Value is set to ' + lastSegment);
            document.getElementById("EmailID").textContent = lastSegment;
          });
        }
      });
    } else {
      console.log('Value currently is ' + result.emailId);
      document.getElementById("EmailID").textContent = result.emailId;
      
      // Now that we have the email ID, we can get the email details
      chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        console.log(token);  // Log the token to the console for debugging
        // Now use the token in your XHR request
        getGmailMessageDetails(result.emailId, token);
      });
    }
  });
});


/*
 ************************************
 *            AUTHENTICATION        *
 *                                  *
 *                 ___              *
 *           ( ___/'._.)            *
 *           /'._.--,_'             *
 *          /'_.'\   `\             *
 *                                  *
 ************************************
*/


// Function to handle authentication
function handleAuth(interactive) {
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {
      console.log('It was not possible to get a token programmatically.');
    } else if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else if (token) {
      // The user is already authenticated
      authToken = token;
      loginButton.style.display = 'none';
      logoutButton.style.display = 'block';
    } else {
      // The user is not authenticated
      console.log('The OAuth Token was null');
    }
  });
}

// Event Listener for Login Button
loginButton.addEventListener('click', () => handleAuth(true));
