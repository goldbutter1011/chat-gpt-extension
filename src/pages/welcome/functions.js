
function fetchEmailList(token) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10&fields=messages(id,threadId)');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onload = function () {
        var data = JSON.parse(this.responseText).messages;
        data.forEach(function(email) {
            fetchEmailData(token, email.id);
        });
    };
    xhr.send();
  }
   function fetchEmailData(token, messageId) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messageId + '?fields=id,snippet,payload/headers');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = function () {
          var emailData = JSON.parse(this.responseText);
          var emailId = emailData.id;
          var emailSnippet = emailData.snippet;
           if (emailData.payload && emailData.payload.headers) {
              var headers = emailData.payload.headers;
              var from = headers.find(header => header.name === 'From')?.value || 'No Sender Info';
              var subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';
          } else {
              var from = 'No Sender Info';
              var subject = 'No Subject';
          }
           fetchedEmails.set(messageId, {emailId, from, subject, emailSnippet});
      };
      xhr.send();
  }
   document.getElementById('exportButton').addEventListener('click', function() {
      const checkboxes = document.querySelectorAll('#emailList input[type="checkbox"]');
      const selectedEmails = Array.from(checkboxes).filter(checkbox => checkbox.checked);
       selectedEmails.forEach(email => {
        let emailData = fetchedEmails.get(email.value);
        if (emailData) {
          exportToSheet(authToken, emailData.emailId, emailData.emailSnippet, emailData.from, emailData.subject);
        }
      });
  });
  
  
   function fetchEmailDataWithThread(token, messageId) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.googleapis.com/gmail/v1/users/me/messages/' + messageId);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = function () {
          var emailData = JSON.parse(this.responseText);
          var emailId = emailData.id;
          var threadId = emailData.threadId;
          var emailSnippet = emailData.snippet;
          var labels = emailData.labelIds;
           var xhrThread = new XMLHttpRequest();
          xhrThread.open('GET', 'https://www.googleapis.com/gmail/v1/users/me/threads/' + threadId);
          xhrThread.setRequestHeader('Authorization', 'Bearer ' + token);
          xhrThread.onload = function () {
              var threadData = JSON.parse(this.responseText);
              var numEmails = threadData.messages.length;
              exportToSheet(token, emailId, threadId, emailSnippet, labels.join(', '), numEmails);
          };
          xhrThread.send();
      };
      xhr.send();
  }
   function exportToSheet(token, emailId, emailSnippet, from, subject) {
      var xhr = new XMLHttpRequest();
      var spreadsheetId = '11tOB-jFoCB8pU00CYvTxvfM4ScM1v2ZyKggZFNTNfRY';
      var range = 'Sheet1!A2';
      var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
       xhr.open('POST', url);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
          if (this.status == 200) {
              console.log('Data appended successfully');
          } else {
              console.log('Failed to append data');
          }
      };
      var data = {
          "range": range,
          "majorDimension": "ROWS",
          "values": [
              [emailId, from, subject, emailSnippet]
          ],
      };
      xhr.send(JSON.stringify(data));
  }
   function fetchEmailList(token) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=10&fields=messages(id,threadId)');
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.onload = function () {
          var data = JSON.parse(this.responseText).messages;
          data.forEach(function(email) {
              fetchEmailDataForList(token, email.id);
          });
      };
      xhr.send();
  }
  function fetchEmailDataForList(token, messageId) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "https://www.googleapis.com/gmail/v1/users/me/messages/" + messageId + "?fields=id,snippet");
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.onload = function () {
          var emailData = JSON.parse(this.responseText);
          var emailSnippet = emailData.snippet;
           var li = document.createElement("li");
          li.className = 'email-item';
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.value = messageId;
          li.appendChild(checkbox);
          li.appendChild(document.createTextNode(emailSnippet));
          li.onclick = function () {
              fetchEmailData(token, messageId);
          };
           document.getElementById("emailList").appendChild(li);
      };
      xhr.send();
  }