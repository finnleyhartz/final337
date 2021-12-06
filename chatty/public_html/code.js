/*
Csc 337
Finnley hartz
This file conatins the client side code for the chatty project.
*/

// send message to sever when the 'Send Message' button is clicked
function sendMessage() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      return false;
    }
    
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
          console.log('message sent');
        } else { 
          alert('ERROR');
        }
      }
    }
    
    words = document.getElementById('message').value;
    document.getElementById('message').value = ''
    words = words.split(' ');
    wordString = words.join('+');
    alias = document.getElementById('alias').value;
    let url = '/create/list/' + alias + '/' + wordString;
    httpRequest.open('POST', url);
    httpRequest.send(url);
    
}

// load messages from server and display on webpage
function getList() {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
  
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          document.getElementById('chat').innerHTML = httpRequest.responseText;
        } else { alert('Response failure'); }
      }
    }
  
    let url = '/list';
    httpRequest.open('GET', url);
    httpRequest.send();
}

// load messages every second from server
setInterval(getList, 1000);