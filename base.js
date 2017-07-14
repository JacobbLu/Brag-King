var config = {
  authDomain: "luda.wilddog.com",
  syncURL: "https://luda.wilddogio.com"
};
wilddog.initializeApp(config);
//test
var ref = wilddog.sync().ref();
var odd = true;
var matching = false;
var gaming = false
var gameref;
var who = "unknow";
var cUserName = "someone";
var userref;
var roundnum = 1;
var round1result = false;
var round2result = false;
var round3result = false;
var judgeWaiting = true;
var His1 = true;
var His2 = true;
var His3 = true;
var havekey = false;
var NoSAfterGame = 0;
// function sleep(ms) {<-----solve this after chrome 55 released in Dec2016
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

function GoGoGo() {
  if (matching == false){
  //button moving
  matching = true;
  var ButtonAction = setInterval(function frame() {
    var superbutton = document.getElementById("the-button");
    if (gaming == true){
      clearInterval(ButtonAction);
    }
    if(odd&&gaming == false){
      superbutton.style.border = "30px solid #000";
      odd = !odd;
    }else if(gaming == false){
      superbutton.style.border = "15px solid #000";
      odd = !odd;
    }
  },200);

  // //<------------solve this after chrome 55 released
  // ref.child("key").on('value',function(snapshot){
  //   while(!havekey){
  //     console.info("Loop");
  //     if (snapshot.val() == "00000"){
  //       console.info("00000");
  //       snapshot.ref().set(wilddog.auth().currentUser.uid);
  //       sleep(1000);
  //       console.info("after 00000 1sec sleep");
        
  //       if (snapshot.val() ==  wilddog.auth().currentUser.uid){
  //         console.info("break");
  //         havekey = true;
  //       }else{
  //         snapshot.ref().set() = "00000";
  //         sleep(1500);
  //       }
  //     }else{
  //       sleep(1500);
  //     }
  //   }
  // });

  //matching
  ref.child("games").orderByKey().once('value',function(snapshot){
    var notingame = true;
    snapshot.forEach(function(snap){
      var  numofplayers = snap.numChildren() - 1;
      if (numofplayers < 3){
        if (numofplayers == 1) {
          snap.ref().set({
            "roundwin":"",
            "player1":{"id":snap.child("player1").child("id").val(),
                       "name":snap.child("player1").child("name").val(),
                       "round":0},
            "player2":{"id":wilddog.auth().currentUser.uid, "name":cUserName, "round":0}
          });
          who = "player2";
          notingame = false;
        }else if (numofplayers == 2) {
          snap.ref().set({
            "roundwin":"",
            "player1":{"id":snap.child("player1").child("id").val(),
                       "name":snap.child("player1").child("name").val(),
                       "round":0},
            "player2":{"id":snap.child("player2").child("id").val(),
                       "name":snap.child("player2").child("name").val(),
                       "round":0},
            "judge":{"id":wilddog.auth().currentUser.uid, "name":cUserName}
          });
          who = "judge";
          notingame = false;
        }
        gameref = snap.ref();
      }
    });
    if(notingame){
      gameref = snapshot.ref().push({
        "roundwin":"",
        "player1":{"id":wilddog.auth().currentUser.uid, "name":cUserName, "round":0}
      });
      who = "player1";
    }
    //check if the game begins
    gameref.on("value", function(snapshot){
      //loop it
      //display red border for round win
      if (snapshot.child("roundwin").val().length == 1&&roundnum == 1) {
        roundnum = 2;
        if(snapshot.child("roundwin").val().substring(0,1) == "1"){
          document.getElementById("IdeaHisDiv1").style.borderColor = "red";
        }else if(snapshot.child("roundwin").val().substring(0,1) == "2"){
          document.getElementById("IdeaHisDiv2").style.borderColor = "red";
        }
        if(who == "player1"||who == "player2"){
          var IdeaInput = document.getElementById("IdeaInput");
          IdeaInput.value = "";
          IdeaInput.disabled = false;

          document.getElementById("InputButton").innerHTML = "&#10140;";
        }
      }
      if (snapshot.child("roundwin").val().length == 2&&roundnum == 2) {
        roundnum = 3;
        if(snapshot.child("roundwin").val().substring(1,2) == "1"){
          document.getElementById("IdeaHisDiv3").style.borderColor = "red";
        }else if(snapshot.child("roundwin").val().substring(1,2) == "2"){
          document.getElementById("IdeaHisDiv4").style.borderColor = "red";
        }
        if(snapshot.child("roundwin").val().substring(0,1) == snapshot.child("roundwin").val().substring(1,2)){
          var Winner = "someone";
          if(snapshot.child("roundwin").val().substring(0,1) == "1"){
            Winner = "player1";
          }else{
            Winner = "player2";
          }
          var GameResultDiv = document.createElement('div');
          GameResultDiv.id = "GameResultDiv";
          var GameResultP = document.createElement('p');
          GameResultP.id = "GameResultP";
          var GameStarP = document.createElement('p');
          GameStarP.id = "GameStarP";
          var GameResultText;
          var GameStarText;
          if (who == Winner){
            GameResultText = document.createTextNode("Victory!!!");
            GameStarText = document.createTextNode("+ 1 star");
            userref.once("value",function(usersnapshot){
              NoSAfterGame = usersnapshot.child("NoS").val() + 1;
              usersnapshot.child("NoS").ref().set(NoSAfterGame);
            });
          }else if (who == "judge"){
            GameResultText = document.createTextNode("Good Game!");
            GameStarText = document.createTextNode("+ 0 star");
          }else{
            GameResultText = document.createTextNode("You Lose.");
            GameStarText = document.createTextNode("- 1 star");
            userref.once("value",function(usersnapshot){
              NoSAfterGame = usersnapshot.child("NoS").val() - 1;
              if (NoSAfterGame - 1 < 0){
                NoSAfterGame = 0;
              }
              usersnapshot.child("NoS").ref().set(NoSAfterGame);
            });
          }
          var ReloadButtonText = document.createTextNode("close");
          var ReloadButton = document.createElement('button');
          ReloadButton.onclick = function () {
            location.reload();
          }
          GameStarP.appendChild(GameStarText);
          GameResultDiv.appendChild(GameStarP);
          ReloadButton.id = "ReloadButton";
          GameResultP.appendChild(GameResultText);
          GameResultDiv.appendChild(GameResultP);
          ReloadButton.appendChild(ReloadButtonText);
          GameResultDiv.appendChild(ReloadButton);
          document.body.appendChild(GameResultDiv);
          gameref.off('value');
          if (who == "judge"){
            snapshot.ref().remove();
          }
        }
        else if(who == "player1"||who == "player2"){
          var IdeaInput = document.getElementById("IdeaInput");
          IdeaInput.value = "";
          IdeaInput.disabled = false;

          document.getElementById("InputButton").innerHTML = "&#10140;";
        }
      }
      if (snapshot.child("roundwin").val().length == 3&&roundnum == 3) {
        roundnum = 100;
        if(snapshot.child("roundwin").val().substring(2,3) == "1"){
          document.getElementById("IdeaHisDiv5").style.borderColor = "red";
        }else if(snapshot.child("roundwin").val().substring(2,3) == "2"){
          document.getElementById("IdeaHisDiv6").style.borderColor = "red";
        }
        //after this we get the winner
        //calculate the winner first
        var WinnerString = snapshot.child("roundwin").val();
        var player1point = 0;
        var player2point = 0;
        for(var i = 0;i<3;++i){
          if(WinnerString.substring(i,i+1) == "1"){
            player1point++;
          }else{
            player2point++;
          }
        }
        var Winner = "someone";
        if(player1point >= 2){
          Winner = "player1";
        }else{
          Winner = "player2"
        }
        var GameResultDiv = document.createElement('div');
        GameResultDiv.id = "GameResultDiv";
        var GameResultP = document.createElement('p');
        GameResultP.id = "GameResultP";
        var GameStarP = document.createElement('p');
        GameStarP.id = "GameStarP";
        var GameStarText;
        var GameResultText;
        if (who == Winner){
          GameResultText = document.createTextNode("Victory!!!");
          GameStarText = document.createTextNode("+ 1 star");
          userref.once("value",function(usersnapshot){
              NoSAfterGame = usersnapshot.child("NoS").val() + 1;
              usersnapshot.child("NoS").ref().set(NoSAfterGame);
          });
        }else if (who == "judge"){
          GameResultText = document.createTextNode("Good Game!");
          GameStarText = document.createTextNode("+ 0 star");
        }else{
          GameResultText = document.createTextNode("You Lose.");
          GameStarText = document.createTextNode("- 1 star");
          userref.once("value",function(usersnapshot){
              NoSAfterGame = usersnapshot.child("NoS").val() - 1;
              if (NoSAfterGame - 1 < 0){
                NoSAfterGame = 0;
              }
              usersnapshot.child("NoS").ref().set(NoSAfterGame);
          });
        }
        var ReloadButtonText = document.createTextNode("close");
        var ReloadButton = document.createElement('button');
        ReloadButton.onclick = function () {
          location.reload();
        }
        ReloadButton.id = "ReloadButton";
        GameStarP.appendChild(GameStarText);
        GameResultDiv.appendChild(GameStarP);
        GameResultP.appendChild(GameResultText);
        GameResultDiv.appendChild(GameResultP);
        ReloadButton.appendChild(ReloadButtonText);
        GameResultDiv.appendChild(ReloadButton);
        document.body.appendChild(GameResultDiv);
        gameref.off('value');
        if (who == "judge"){
          snapshot.ref().remove();
        }
      }
      //for idea 3 history display
      if (His3&&snapshot.child("player1").child("round").val() == 3&&
        snapshot.child("player2").child("round").val() == 3){
        var IdeaHisDiv5 = document.createElement('div');
        IdeaHisDiv5.id = 'IdeaHisDiv5';
        IdeaHisDiv5.className += ' IdeaHisDiv';
        var IdeaHisDiv5text = document.createTextNode(snapshot.child("player1").child("idea").val());
        IdeaHisDiv5.appendChild(IdeaHisDiv5text);
        document.body.appendChild(IdeaHisDiv5);
        if(who == "judge"){
          IdeaHisDiv5.addEventListener("click", function(){
            if(!round3result){
              IdeaHisDiv5.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "1");
              round3result = true;
            }
          });
        }
        var IdeaHisDiv6 = document.createElement('div');
        IdeaHisDiv6.id = 'IdeaHisDiv6';
        IdeaHisDiv6.className += ' IdeaHisDiv';
        var IdeaHisDiv6text = document.createTextNode(snapshot.child("player2").child("idea").val());
        IdeaHisDiv6.appendChild(IdeaHisDiv6text);
        document.body.appendChild(IdeaHisDiv6);
        if(who == "judge"){
          IdeaHisDiv6.addEventListener("click", function(){
            if(!round3result){
              IdeaHisDiv6.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "2");
              round3result = true;
            }
          });
        }
        His3 = false;
      }
      //for idea 2 history display
      if (His2&&snapshot.child("player1").child("round").val() == 2&&
        snapshot.child("player2").child("round").val() == 2){
        var IdeaHisDiv3 = document.createElement('div');
        IdeaHisDiv3.id = 'IdeaHisDiv3';
        IdeaHisDiv3.className += ' IdeaHisDiv';
        var IdeaHisDiv3text = document.createTextNode(snapshot.child("player1").child("idea").val());
        IdeaHisDiv3.appendChild(IdeaHisDiv3text);
        document.body.appendChild(IdeaHisDiv3);
        if(who == "judge"){
          IdeaHisDiv3.addEventListener("click", function(){
            if(!round2result){
              IdeaHisDiv3.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "1");
              round2result = true;
            }
          });
        }
        var IdeaHisDiv4 = document.createElement('div');
        IdeaHisDiv4.id = 'IdeaHisDiv4';
        IdeaHisDiv4.className += ' IdeaHisDiv';
        var IdeaHisDiv4text = document.createTextNode(snapshot.child("player2").child("idea").val());
        IdeaHisDiv4.appendChild(IdeaHisDiv4text);
        document.body.appendChild(IdeaHisDiv4);
        if(who == "judge"){
          IdeaHisDiv4.addEventListener("click", function(){
            if(!round2result){
              IdeaHisDiv4.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "2");
              round2result = true;
            }
          });
        }
        His2 = false;
      }
      //this for idea 1 history display
      if (His1&&snapshot.child("player2").child("round").val() == 1&&
        snapshot.child("player1").child("round").val() == 1){
        var IdeaHisDiv1 = document.createElement('div');
        IdeaHisDiv1.id = 'IdeaHisDiv1';
        IdeaHisDiv1.className += ' IdeaHisDiv';
        var IdeaHisDiv1text = document.createTextNode(snapshot.child("player1").child("idea").val());
        IdeaHisDiv1.appendChild(IdeaHisDiv1text);
        document.body.appendChild(IdeaHisDiv1);
        if(who == "judge"){
          IdeaHisDiv1.addEventListener("click", function(){
            if(!round1result){
              IdeaHisDiv1.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "1");
              round1result = true;
            }
          });
        }
        var IdeaHisDiv2 = document.createElement('div');
        IdeaHisDiv2.id = 'IdeaHisDiv2';
        IdeaHisDiv2.className += ' IdeaHisDiv';
        var IdeaHisDiv2text = document.createTextNode(snapshot.child("player2").child("idea").val());
        IdeaHisDiv2.appendChild(IdeaHisDiv2text);
        document.body.appendChild(IdeaHisDiv2);
        if (who == "judge"){
          IdeaHisDiv2.addEventListener("click", function(){
            if(!round1result){
              IdeaHisDiv2.style.borderColor = "red";
              snapshot.child("roundwin").ref().set(snapshot.child("roundwin").val() + "2");
              round1result = true;
            }
          });
        }
        His1 = false;
      }
      if (snapshot.numChildren() == 4){
        if(snapshot.child("player1").child("round").val()==snapshot.child("player2").child("round").val()&&
          snapshot.child("player1").child("round").val() != 0&&
          judgeWaiting){
          if(who=="judge"){
            var JudgeDivP1 = document.getElementById("JudgeDivP1");
            var JudgeDivP2 = document.getElementById("JudgeDivP2");

            var JudgeDivP1text = document.createTextNode(snapshot.child("player1").child("idea").val());
            JudgeDivP1.appendChild(JudgeDivP1text);
            var JudgeDivP2text = document.createTextNode(snapshot.child("player2").child("idea").val());
            JudgeDivP2.appendChild(JudgeDivP2text);

            judgeWaiting = false;
          }
        }
      }

      //1 time initial
      if (gaming == false&&snapshot.numChildren() == 4){
        //game begin
        gaming = true;
        console.info("game begin");
        matching = false;
        var bodyNode = document.body;
        while (bodyNode.firstChild) {
          bodyNode.removeChild(bodyNode.firstChild);
        }
        bodyNode.style.backgroundColor = "#efecec";
        var player1name = snapshot.child("player1").child("name").val();
        var player2name = snapshot.child("player2").child("name").val();
        var judgename = snapshot.child("judge").child("name").val();
        var gameinfoDiv = document.createElement('div');
        gameinfoDiv.id = "gameinfoDiv";
        var gameinfotext = document.createTextNode("judge: " + judgename);
        gameinfoDiv.appendChild(gameinfotext);
        bodyNode.appendChild(gameinfoDiv);

        var gameinfoDiv1 = document.createElement('div');
        gameinfoDiv1.id = "gameinfoDiv1";
        var gameinfotext1 = document.createTextNode("player1: " + player1name);
        gameinfoDiv1.appendChild(gameinfotext1);
        bodyNode.appendChild(gameinfoDiv1);

        var gameinfoDiv2 = document.createElement('div');
        gameinfoDiv2.id = "gameinfoDiv2";
        var gameinfotext2 = document.createTextNode("player2: " + player2name);
        gameinfoDiv2.appendChild(gameinfotext2);
        bodyNode.appendChild(gameinfoDiv2);

        var LeftGameDiv = document.createElement('div');
        LeftGameDiv.id = "LeftGameDiv";
        bodyNode.appendChild(LeftGameDiv);
        var RightGameDiv = document.createElement('div');
        RightGameDiv.id = "RightGameDiv";
        bodyNode.appendChild(RightGameDiv);

        console.info(who);
        if (who == "judge"){
          //create the judge divs
          var JudgeDiv = document.createElement('div');
          JudgeDiv.id = "JudgeDiv";
          document.body.appendChild(JudgeDiv);

          var JudgeDivP1 = document.createElement('div');
          JudgeDivP1.id = "JudgeDivP1";
          JudgeDiv.appendChild(JudgeDivP1);

          var JudgeDivP2 = document.createElement('div');
          JudgeDivP2.id = "JudgeDivP2";
          JudgeDiv.appendChild(JudgeDivP2);
        }
        //create input box and button
        if (who == "player1" || who == "player2"){
          var InputIdeaDiv = document.createElement('div');
          InputIdeaDiv.id = "InputIdeaDiv";
          bodyNode.appendChild(InputIdeaDiv);

          var IdeaInput = document.createElement('textarea');
          IdeaInput.id = "IdeaInput";
          IdeaInput.type = "text";
          IdeaInput.cols = "40";
          IdeaInput.rows = "5";
          IdeaInput.maxLength = "200";
          InputIdeaDiv.appendChild(IdeaInput);

          var InputButton = document.createElement('button');
          InputButton.id = "InputButton";
          InputButton.innerHTML = "&#10140;";
          InputIdeaDiv.appendChild(InputButton);
          //click button function
          InputButton.addEventListener("click", function(){
            //change '->'' to 'check'
            InputButton.innerHTML = "&#10004;";
            IdeaInput.disabled = true;
            var IdeaText = IdeaInput.value;
            if(who == "player1"){
              snapshot.child("player1").ref().set({
                "id":snapshot.child("player1").child("id").val(),
                "name":snapshot.child("player1").child("name").val(),
                "idea":IdeaText,
                "round":roundnum
              });
            }else if(who == "player2"){
              snapshot.child("player2").ref().set({
                "id":snapshot.child("player2").child("id").val(),
                "name":snapshot.child("player2").child("name").val(),
                "idea":IdeaText,
                "round":roundnum
              });
            }
          });
        }
      }
    });
  });
  }
} 


//x close dialog
document.getElementById("xdiv").addEventListener('click', CloseDialog);
function CloseDialog () {
  document.getElementById("dialog").style.display = "none";
}

//auth
wilddog.auth().onAuthStateChanged(function (userInfo) {
    if(userInfo) {
	    console.info('user login', wilddog.auth().currrentUser);
      var myNode = document.getElementById("accountdiv");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
      //add sign out button
      var button1 = document.createElement("BUTTON");
      button1.setAttribute("class", "log-button");
      var text1 = document.createTextNode("Logout");
      button1.appendChild(text1);
      document.getElementById("accountdiv").appendChild(button1);
      button1.addEventListener('click', LogUserOut)
      //get user name
      var ref = wilddog.sync().ref("/users");
      ref.once("value",function(snapshot){
        snapshot.forEach(function(snap){
          if(snap.child("id").val()==wilddog.auth().currentUser.uid){
            console.log("username: ",snap.child("username").val());
            //add username view
            var Nameview = document.createElement("P");
            Nameview.setAttribute("id", "nameview");
            cUserName = snap.child("username").val();
            userref = snap.ref();
            var name = document.createTextNode(snap.child("username").val());
            Nameview.appendChild(name);
            document.getElementById("accountdiv").appendChild(Nameview);
            //add user ranking view
            var RankingView = document.createElement("P");
            RankingView.setAttribute("id", "RankingView");
            var RankingViewText = document.createTextNode("Number of star: "+snap.child("NoS").val());
            RankingView.appendChild(RankingViewText);
            document.getElementById("accountdiv").appendChild(RankingView);
          }
        });
      });
    }else {
      console.info('user logout');
      //remove all element in account div
      var myNode = document.getElementById("accountdiv");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
      //add signup button
	    var button1 = document.createElement("BUTTON");
      button1.setAttribute("class", "log-button");
	    var text1 = document.createTextNode("Sign Up");
	    button1.appendChild(text1);
	    document.getElementById("accountdiv").appendChild(button1);
      button1.addEventListener('click', SignUserUp);
      //add login button
      var button2 = document.createElement("BUTTON");
      button2.setAttribute("class", "log-button");
      var text2 = document.createTextNode("Login");
      button2.appendChild(text2);
      document.getElementById("accountdiv").appendChild(button2);
      button2.addEventListener('click', LogUserIn);
    }
});
//SignUp box
function SignUserUp () {
  var warning = document.getElementById("accountwarning");
  warning.innerHTML = '';
  var dialogdiv = document.getElementById("dialog");
  dialogdiv.style.display = "block";
  var loginContent = document.getElementById("LogInDiv");
  loginContent.style.display = "none";
  var signupContent = document.getElementById("SignUpDiv");
  signupContent.style.display = "block";
  var triggerbutton = document.getElementById("SUB");
  triggerbutton.addEventListener('click', SignUpGo);
}
//SignUp!
function SignUpGo () {
  var email = document.getElementById("SUE").value;
  var pwd = document.getElementById("SUP").value;
  var rpwd = document.getElementById("SUR").value;
  var username = document.getElementById("SUU").value;
  var warning = document.getElementById("accountwarning")
  warning.innerHTML = '';
  //check username
  var validname = true;
  var i = username.length;
  while (i--) {
    if(!(('A'<=username[i]&&username[i]<='Z')||
         ('0'<=username[i]&&username[i]<='9')||
         ('a'<=username[i]&&username[i]<='z'))){
      validname = false;
      break;
    }
  }
  if (i > 10){
    warning.innerHTML = 'Invalid username. No more then 10 characters';
  }
  else if(!validname){
    warning.innerHTML = 'Invalid username. Only A-Z, a-z, 0-9 allowed.';
  }
  else if(pwd.length < 6||pwd.length > 32){
    warning.innerHTML = 'Password length should be 6-32.';
  }
  //check password matching
  else if (pwd != rpwd){
    warning.innerHTML = 'Re-entered password is wrong. Please try again.';
  }else if (validname && pwd == rpwd && i <= 10){
    wilddog.auth().createUserWithEmailAndPassword(email,pwd).then(function (user) {
      console.info("user created.", user);
      ref.child("users").push({
        "username": username,
        "id": wilddog.auth().currentUser.uid,
        "email": email,
        "NoS": 0
      });
      var dialogdiv = document.getElementById("dialog").style.display = "none";
    }).catch(function (err) {
      console.info("create user failed.", err);
      if (err == 'Error: The email address is already in use by another account.'){
        warning.innerHTML = 'The email has been used.';
      }else{
        warning.innerHTML = 'There is an error. Please contact support.';
      }
    });
  }
}
//login box
function LogUserIn() {
  var warning = document.getElementById("accountwarning2");
  warning.innerHTML = '';
  var dialogdiv = document.getElementById("dialog");
  dialogdiv.style.display = "block";
  var loginContent = document.getElementById("LogInDiv");
  loginContent.style.display = "block";
  var signupContent = document.getElementById("SignUpDiv");
  signupContent.style.display = "none";
  var triggerbutton = document.getElementById("SIB");
  triggerbutton.addEventListener('click', SignInGo);
}
//SignIn!
function SignInGo () {
  var email = document.getElementById("SIE").value;
  var pwd = document.getElementById("SIP").value;
  var warning = document.getElementById("accountwarning2")
  warning.innerHTML = '';
  wilddog.auth().signInWithEmailAndPassword(email, pwd)
    .then(function () {
        console.info("login success, currentUser->",  wilddog.auth().currentUser);
        var dialogdiv = document.getElementById("dialog").style.display = "none";
    }).catch(function (err) {
        console.info('login failed ->',err);
        warning.innerHTML = 'Email or password is incorrect. Please try again.';
    });
}
//Simple Sign Out
function LogUserOut() {
  wilddog.auth().signOut().then(function () {
    console.info("user sign out.");
  });
}
