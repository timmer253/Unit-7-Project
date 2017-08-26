 "use strict";
 // intialize variables and node modules
const express = require("express");
const pug = require("pug");
const twit = require("twit");
const config = require("./config");
var myApp = new express();
var myContent = {
  myTweets:[],
  myFollowersUserName:[],
  myFollowersRealName:[],
  myFollowersAvatar:[],
  myMessages:[],
  myMessageClass:[],
  sendersImage:[], 
  myAvatarImage:"",
  myBannerImage:"",
  myUserName:"",
  myRealName:""
}
const myhttps = require("https");
const timeLineTarget = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=TimmerDota&count=5";
const followersTarget = "https://api.twitter.com/1.1/followers/list.json?cursor=-1&screen_name=TimmerDota&skip_status=true&include_user_entities=false";
const messagesTarget = "https://api.twitter.com/1.1/direct_messages.json?count=5";
var myTwit = new twit(config); 
myApp.use(express.static(__dirname + '/public'));
//---------------------------------------------------------------------
// Main program logic
// get tweets 
 myTwit.get(timeLineTarget,function(err,data,res){
    for(var x=0; x<=4; x++){
      myContent.myTweets[x] = data[x].text;
    }
  myContent.myAvatarImage = 'background-image: url('+ data[0].user.profile_image_url_https +')';
  myContent.myUserName = data[0].user.screen_name;
  myContent.myRealName = data[0].user.name;
 });

// get followers
myTwit.get(followersTarget,function(err,data,res){
  for (var x=0; x<=4; x++){
    myContent.myFollowersRealName[x] = data.users[x].name;
    myContent.myFollowersUserName[x] = data.users[x].screen_name;
    myContent.myFollowersAvatar[x] = 'background-image: url('+ data.users[x].profile_image_url_https +')';
  }
});

//get direct messages
myTwit.get(messagesTarget,function(err,data,res){
  var theEnd = data.length
  for (var x = 0; x < theEnd; x++){
    if (data[x].sender.sender_screen_name == myContent.myUserName){
      myContent.myMessageClass[x] = "app--message--me";
    } else {myContent.myMessageClass[x] = "app--message"}
    console.log(data[x].text);
    myContent.myMessages[x] = data[x].text;
    myContent.sendersImage[x] = 'background-image: url(' + data[x].sender.profile_image_url + ')'; 
  }
}); 

//start server and render
myApp.listen(3000, function (){
console.log('front-end app listening on port 3000!');
});
myApp.set("view engine", "pug");
myApp.set("views", __dirname + "/views"); 
myApp.get("/",function(req,res){
  res.render("index",myContent);
});