
function getUser() {
	fetch('http://localhost:8080/postbook/webapi/twitter/tweets/getAllTweet')
		.then(resp => resp.json())
		.then(data => console.log(data))
}


var userid;
var tweets = [];
var tweetid;
var useremail;
// -------Sign In-------
function SignUp() {

	console.log("function Start...")
	const users = {
		// username: document.getElementById('username').value,
		// useremail: document.getElementById('useremail').value,
		// password: document.getElementById('password').value,
		userName: document.getElementById("username").value,
		userEmail: document.getElementById("useremail").value,
		userPassword: document.getElementById("userpassword").value,
	}

	console.log("UserObj")

	fetch("http://localhost:8080/postbook/webapi/twitter/users/add", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(users)
	})
		.then((res) => {
			res.json()
			console.log("json res")
		})
		.then((data) => {
			console.log(data);
			alert("Sign Up Sucess...");
			userid = data.userId;
			enableTab();
		});

}


// -----Login---------
function SignIn() {


	const userLogin = {
		userEmail: document.getElementById("useremaillogin").value,
		userPassword: document.getElementById("userpasswordlogin").value,
	}

	fetch("http://localhost:8080/postbook/webapi/twitter/users/login", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(userLogin)
	})
		.then((res) => res.json())
		.then((data) => {
			//console.log(data)
			//profilePage(data)
			
			userid = data.userId;
			useremail=data.userEmail;
			console.log(userid);
			console.log(useremail);
			alert("Login Sucess....");
			enableTab();
			
			//------------------------------Profile page-------------------------
			
			
			
		})
		.catch((err) => {
			console.log("Error" + err);
		});

}


//-------Enable tab-------
function enableTab() {
	document.getElementById("feed-tab").removeAttribute('disabled');
	document.getElementById("profile-tab").removeAttribute('disabled');
	document.getElementById("my-tweets-tab").removeAttribute('disabled');

	//document.getElementById("feed-tab-pane").show();
}


//---------------FEED TAB------------------


// ADD TWEET START----------
function addNewTweet() {


	const tweetData = {
		tweetBody: document.getElementById("tweetinput").value,

		user: {
			userId: userid,
		}
	}

	fetch("http://localhost:8080/postbook/webapi/twitter/tweets/add", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(tweetData)
	})
		.then((res) => { tweetList(); res.json() })
		.then(data => {
			console.log(data)
			tweetid = data.tweetId;
			alert("Tweet ADD.")

		});

}

// ADD TWEET END-------

// TWEET LIST----------------
function tweetList() {


	//

	fetch("http://localhost:8080/postbook/webapi/twitter/tweets/getAllTweet", {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(resp => resp.json())
		.then(data => mapTweet(data))

}

function mapTweet(tweets) {
	var listString = "";

	for (let i = 0; i < tweets.length; i++) {
		listString += `  <div class="container mt-5">
        <div class="card border-0 shadow">
            <div class="card-body">
                <div class="media">
                    <img src="${tweets[i].user.userAvatar}" class="mr-3 rounded-circle" alt="Profile Image" style="width: 50px;">
                    <div class="media-body">
                        <h5 class="mt-0 d-flex justify-content-between align-items-center">
                            <span>${tweets[i].user.userName}
                            <i class="fas fa-check-circle text-primary"></i>
                            </span>
                            <i class="bi bi-badge-check text-primary"></i>
                        </h5>
                        <p class="text-right">${tweets[i].tweetBody}</p>
                        <button type="button" class="btn btn-link text-danger" onClick="likeTweet(${tweets[i].tweetId})"><i class="bi bi-heart"></i>${tweets[i].tweetLikes}</button>
                    	<i class="bi bi-share" style="margin-right: 10px;"></i>
                    	<i class="bi bi-chat"></i>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>

`
	}

	document.getElementById('tweetsList').innerHTML = listString;
}


// ------------ My Tweets --------------
function myTweets() {
	//var url = "http://localhost:8080/postbook/webapi/twitter/users/getUser";


	fetch(`http://localhost:8080/postbook/webapi/twitter/tweets/myTweet/${userid}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(resp => resp.json())
		.then(data => {
			console.log(data);
			myTweet(data)
		})

}


//------------My Tweets ---------------

function myTweet(tweets) {
	var listString = "";


	for (let i = 0; i < tweets.length; i++) {
		listString += `<div class="container mt-5">
        <div class="card border-0 shadow">
            <div class="card-body">
                <div class="media">
                    <img src="${tweets[i].user.userAvatar}" class="mr-3 rounded-circle" alt="Profile Image" style="width: 50px;">
                    <div class="media-body">
                        <h5 class="mt-0 d-flex justify-content-between align-items-center">
                            <span>${tweets[i].user.userName}</span>
                            <i class="bi bi-badge-check text-primary"></i>
                        </h5>
                        <p class="text-right">${tweets[i].tweetBody}</p>
                        <button type="button" class="btn btn-danger" onClick="deleteTweet(${tweets[i].tweetId})"><i class="bi bi-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

`
	}

	document.getElementById('mytweet').innerHTML = listString;

}


//--------------------Like Function ----------------------------------

function likeTweet(tweetId) {

	fetch(`http://localhost:8080/postbook/webapi/twitter/tweets/likes/${tweetId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then((resp) => {
			tweetList();
			resp.json()
		})
		.them((data) => console.log(data))
}



//-----------Function for Delete Tweet----------

function deleteTweet(tweetId){
	fetch(`http://localhost:8080/postbook/webapi/twitter/tweets/deleteTweet/${tweetId}`,{
		method:'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then((resp)=>{
		myTweets();
		resp.json()
	}).then((data)=>console.log(data))
}


//--------------- Function Profile -----------------






