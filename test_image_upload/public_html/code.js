/*
CSc 337
Finnley Hartz
This is the client js file for the final project.
*/

var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");

// this function gets called onlick and sends new user information 
// to the server through url.
function addUser() {
  let u = $('#username2').val();
  let p = $('#password2').val();
  console.log(u, p)
  $.get(
    '/account/create/' + u + '/' + encodeURIComponent(p),
    (data, status) => {
        console.log(data);
  });
  login()
  
}

function register(){
  x.style.left = "-400px";
  y.style.left = "50px";
  z.style.left = "110px";
}

function login(){
  x.style.left = "50px";
  y.style.left = "450px";
  z.style.left = "0px";
}

function addItem(data) {
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) { return false; }
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          console.log(httpRequest.responseText);
          displayPost()
        } else { alert('Response failure'); }
      }
    }
    let c = document.getElementById('caption').value;
    let url = '/app/create/item/'+ String(data) + '/' + c + '/' ;
    console.log(url)
    httpRequest.open('GET', url);
    httpRequest.send();
}

function displayPost() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        responseData = JSON.parse(httpRequest.responseText)
        console.log(responseData)
        results = ''
        for (var i in responseData) {
          let r = responseData[i]
          console.log(r.likes)
          results += 
            '<div class="post-container" id='+r._id+'>'+
              '<div class="post-row">'+
                '<div class="user-profile" class="profile-pic">'+
                  '<img src="img/blank-profile-picture-png.png">'+
                  '<div>'+
                    '<p>'+r.username+'</p>'+
                    '<span>'+r.timestamp+'</span>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<p class="post-text">'+r.caption+'</p>'+
              '<img src="./uploads/images/'+r.image+'" class="post-img">'+
              '<div class="post-row">'+
                '<div class="activity-icons">'+
                  '<div><img src="img/like.png">'+r.likes.length+'</div>'+
                  '<div><img src="img/comments.png">45</div>'+
                  '<div>'+
                    '<input type="text" class="input-field" id="'+r._id+'comment" placeholder="Add a comment">'+
                    '<button type="submit" class="submit-btn" onclick="addComment('+r._id+')">Send</button>'+
                    '<div id="newcomment"></div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'
          ;
        }
        document.getElementById('allposts').innerHTML =  results
      } else { alert('Response failure'); }
    }
  }
  let url = '/get/items/';
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
  
}

//this function logs the user in
function loginUser() {
  let u = $('#username').val();
  let p = $('#password').val();
  console.log(u, p)
  $.get(
    '/account/login/' + u + '/' + encodeURIComponent(p),
    (data, status) => {
        console.log(data);
        if (data == 'LOGIN') {
          window.location.href = 'home.html';
        } else {document.getElementById('issue').innerText = 'Issue logging in with that info';}

  });
}



function uploadImage() {
    var formData = new FormData();
    formData.append("image", document.getElementById('image').files[0]);
    $.ajax({
        url:"/app/upload/",
        method:"POST",
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        beforeSend:function(){
          $('#uploaded_image').html("<label class='text-success'>Image Uploading...</label>");
        },   
        success:function(data){
          $('#uploaded_image').html(data);
          addItem(data)
        }
    });
}



// sends a get request with a keyword in the url to the server and displays all
// users with that keyword on the webpage
function searchUsers() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        responseData = JSON.parse( httpRequest.responseText )
        results = ''
        for (var i in responseData) {
          let r = responseData[i]
          console.log(r.username)
          results += '<div onclick="viewUser('+"'"+r.username+"'"+')"><img src="/img/' + r.profile + '"><b>' +  r.username + '</b></div>';
        }
        console.log(results)
        document.getElementById('searchresults').innerHTML = results;
      } else { alert('Response failure'); }
    }
  }
  keyword = document.getElementById('search').value
  let url = '/app/search/users/' + keyword;
  httpRequest.open('GET', url);
  httpRequest.send();
}


function getUsername() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
      } else { alert('Response failure'); }
    }
  }
  let url = '/app/get/username/';
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
}

function getProfile() {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        resData = JSON.parse(httpRequest.responseText);
        r = resData[0];
        console.log(r);
        document.getElementById('user1').innerText = r.username;
        document.getElementById('user2').innerText = r.username;
        document.getElementById('user3').innerText = r.username;
        document.getElementById('user4').innerText = 'Followers ' + String(r.followers.length) + ' - Following ' + String(r.following.length);
        //document.getElementById('profile-pic1').value = '<img src="img/'+r.profile+'"></img>';
        //document.getElementById('profile-pic2').value = '<img src="img/'+r.profile+'"></img>';
        //document.getElementsByClassName('profile-pic').innerHTML='<img src="img/'+r.profile+'">'
      } else { alert('Response failure'); }
    }
  }
  let url = '/app/get/profile/';
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
}

function viewUser(u) {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        document.getElementById('searchresults').innerHTML = ''
        document.getElementById('search').value = ''
        responseData = JSON.parse(httpRequest.responseText)
        console.log(responseData)
        results = '<div class="profile-container">'+
                    '<div class="profile-details">'+
                      '<div class="pd-left">'+
                        '<div class="pd-row" id="profile-pic2">'+
                          '<img src="img/blank-profile-picture-png.png" class="pd-image">'+
                          '<div>'+
                            '<h3 id="user1"></h3>'+
                            '<p id="user4"></p>'+
                            '<img src="img/member-1.png">'+
                            '<img src="img/member-2.png">'+
                            '<img src="img/member-3.png">'+
                            '<img src="img/member-4.png">'+
                          '</div>'+
                      '</div>'+
                    '</div>'+
                      '<div class="pd-right">'+
                        '<button type="button" onclick="viewFriends()"> <img src="img/friends.png">Friends</button>'+
                        '<button type="button" onclick="getMessenger()"><img src="img/inbox.png">Message</button>'+
                        '<br>'+
                        '<a href=""><img src="img/more.png"></a>'+
                    '</div>'+
                  '</div>'
        for (var i in responseData) {
          let r = responseData[i]
          results += 
            '<div class="post-container" id='+r._id+'>'+
              '<div class="post-row">'+
                '<div class="user-profile" class="profile-pic">'+
                  '<img src="img/blank-profile-picture-png.png">'+
                  '<div>'+
                    '<p>'+r.username+'</p>'+
                    '<span>'+r.timestamp+'</span>'+
                  '</div>'+
                '</div>'+
              '</div>'+
              '<p class="post-text">'+r.caption+'</p>'+
              '<img src="./uploads/images/'+r.image+'" class="post-img">'+
              '<div class="post-row">'+
                '<div class="activity-icons">'+
                  '<div><img src="img/like-blue.png" onclick="like('+r.id+')">'+r.likes.length+'</div>'+
                  '<div><img src="img/comments.png">45</div>'+
                  '<div>'+
                    '<input type="text" class="input-field" id="'+r._id+'comment" placeholder="Add a comment">'+
                    '<button type="submit" class="submit-btn" onclick="addComment('+r._id+')">Send</button>'+
                    '<div id="newcomment"></div>'+
                  '</div>'+
                '</div>'+
              '</div>'+
            '</div>'
          ;
        }
        document.getElementById('allposts').innerHTML =  results
      } else { alert('Response failure'); }
    }
  }
  console.log(u)
  let url = '/get/items/' + u + '/';
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
  
}

function addComment(postId) {
  console.log(postId)
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
        cId = httpRequest.responseText;
        document.getElementById('newcomment') = '<div>'+
        '<input type="text" class="input-field" id="'+cId+'comment" placeholder="Add a comment">'+
        '<button type="submit" class="submit-btn" onclick="addCommentComment('+cId+')">Send</button>'+
        '<div id="'+cId+'newcomment"></div>'+
        '</div>';
      } else { alert('Response failure'); }
    }
  }
  console.log(postId+'comment')
  let c = document.getElementById(postId+'comment').value;
  let url = '/app/create/comment/'+ postId + '/' + c + '/' ;
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
}



function like(postId) {
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) { return false; }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log(httpRequest.responseText);
      } else { alert('Response failure'); }
    }
  }
  let url = '/app/like/' + postId + '/';
  console.log(url)
  httpRequest.open('GET', url);
  httpRequest.send();
}