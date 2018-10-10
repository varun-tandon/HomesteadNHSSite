/**
* Listen to scroll to change header opacity class
*/
function checkScroll(){
  var startY = $('.navbar').height() * 2; //The point where the navbar changes in px

  if($(window).scrollTop() > startY){
    $('.navbar').addClass("scrolled");
    $('#navigation .navbar-nav.navbar-right li').addClass('scrolledText');
    $('#nav_logo').attr('src', "images/logo.png");

  }else{
    $('.navbar').removeClass("scrolled");
    $('#navigation .navbar-nav.navbar-right li').removeClass('scrolledText');
    $('#nav_logo').attr('src', "images/white_logo.png");

  }
}

function createEvent(){
    var user = firebase.auth().currentUser;
    var file = document.getElementById('fileInput').files[0];
    var storageRef = firebase.storage().ref();
     var metadata = {
        'contentType': file.type
      };
     storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log(snapshot.metadata);
        var url = snapshot.downloadURL;
        console.log('File available at', url);
        eventName = $('#eventName').val();
    maxSpots = $('#numSpots').val();
    description = $('#message').val();
    eventType = $('#eventType').val();
    date = $('#date').val();
    normDate = date.replace(/\W/g, '');
    console.log(normDate);
    numHours = $('#numHours').val();
    var participants = []
    participants.push("Event Leader: " + user.displayName)
    var database = firebase.database();
    firebase.database().ref('/events/' + eventName + normDate).set({
        eventName: eventName,
        maxSpots: parseInt(maxSpots),
        description: description,
        eventType: eventType,
        date: date,
        spotsRemaining: parseInt(maxSpots),
        numHours: parseInt(numHours),
        url: url, 
        participants: participants
    }).then(function(){
      alert('Event Created! You may now navigate back to the homepage.');
        navigateHome();
    });
        
        // [START_EXCLUDE]
        // [END_EXCLUDE]
      }).catch(function(error) {
        // [START onfailure]
        alert('Something went wrong...')
        console.error('Upload failed:', error);
        // [END onfailure]
      });

   

     
    // var hasUpdated = false;
    // while(!hasUpdated) {
    //     firebase.database().ref('/events/' + eventName).once('value').then(function (snapshot) {
    //         if(snapshot.val().eventName != null){
    //             hasUpdated = true;
    //         }
    //     });
    // }
}
function navigateHome(){
    document.location.href = "index.html"
}
function resetPassword(){
  var auth = firebase.auth();
  alert(auth);
  var emailAddress = $('#forgotPasswordEmail').val() + "";
  alert(emailAddress);
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    alert("AHHHH")
  }, function(error) {
    alert(error)
  });
}

function signUpEvent(eventID){
    var makeSure = confirm("Are you sure you want to sign up for this event?");
    if(makeSure){
       user = firebase.auth().currentUser;
       console.log(user.email);
    firebase.database().ref('/events/' + eventID).once('value').then(function(snapshot) {
          eventInfo = snapshot.val();
          numSpots = eventInfo.spotsRemaining;
          if(eventInfo.participants.includes(user.displayName)){
            alert('You have already signed up for this event.');
            return;
          }
          if(eventInfo.spotsRemaining <= 0){
            alert('Sorry, no spots remain.');
            return;
          }
          if(user == null){
            alert('Please sign in to continue.');
            return;
          }
          console.log(eventID);
        firebase.database().ref('/users/' + user.email.replace(/\W/g, '')).once('value').then(function(snapshot) {
              userInformation = snapshot.val();
              temp = userInformation.userEvents;
              temp.push(eventID);
              firebase.database().ref('/users/' + user.email.replace(/\W/g, '')).update({
                    userEvents: temp
                });
          });
        var participants = eventInfo.participants
        participants.push(user.displayName)
        firebase.database().ref('/events/' + eventID).update({
                    spotsRemaining: (numSpots - 1),
                    participants: participants
                });
        alert("Signed Up!")

    });
    }else{

    }
   
}

function signInUser(){
  email = $("#exampleInputEmail2").val();
  password = $("#exampleInputPassword2").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // alert(firebase.auth().currentUser.toString());

    // console.log(errorMessage);
    // console.log(errorCode);
    alert(errorMessage)


    // ...
  });

  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  // .then(function() {
  //   // Existing and future Auth states are now persisted in the current
  //   // session only. Closing the window would clear any existing state even
  //   // if a user forgets to sign out.
  //   // ...
  //   // New sign-in will be persisted with session persistence.
  //   return firebase.auth().signInWithEmailAndPassword(email, password);
  // })
  // .catch(function(error) {
  //   // Handle Errors here.
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  //   console.log(errorCode)
  // });

  //document.location.href="index.html";

}

function onload(){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if (user.displayName == null) {
            document.location.href = "create_user.html"
        }
      $("#loginDropdown").remove();

      $(".nav").append("<li id = \"dropdownAdded\"class=\"dropdown scroll\" ><a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">"+user.displayName+"<span class=\"caret\"></span></a><ul id=\"logoutDropdown\"class=\"dropdown-menu\"><button type=\"href\" id=\"accountButton\"class=\"btn login_button btn-primary btn-block\" onclick=\"window.location.href = 'account.html'\">Account</button><button type=\"submit\" id=\"logoutButton\"class=\"btn login_button btn-primary btn-block\" onclick=\"signOutUser()\">Sign Out</button></ul></li>")
      if(!document.location.href.includes('index.html')){
            $("#dropdownAdded").addClass('scrolledText');
      }
      // $(".nav").append("<li class=\"scroll\"><a href=\"userInformationPage.html\">"+ user.displayName +"</a></li>");
      // $(".nav").append(
      //   "<li class=\"dropdown\" id = \"signOutDropdown\">" +
      // "<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">" + user.displayName+ "<span class=\"caret\"></span></a>" +
      // "<ul id=\"login-dp\" class=\"dropdown-menu\">"+
      // "<li>"+ "<div class=\"row\">" + "
      //         <div class=\"col-md-12\">" +
      //         "<form class=\"form\" role=\"form\" action='javascript:signOutUser()'accept-charset=\"UTF-8\" id=\"login-nav\">"+
      //         "<div class=\"form-group\">" +
      //         "<button type=\"submit\" class=\"btn login_button btn-primary btn-block\" onclick=\"signInUser()\">Sign Out</button>" +
      //         "</div></form></div></div></li></ul></li>");
    } else {
      // No user is signed in.
    }
  });
}
function  signOutUser() {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
    document.location.href = "index.html"
}
function setupUser(){

  idNumber = $("#studentIDInput").val();
  full_name = $("#FullName").val();
  grade = $("#gradeInput").val();
  user = firebase.auth().currentUser;
  if(user == null || user.displayName != null){

    alert("ACCESS DENIED");

    document.location.href="index.html";
  }else{
    user.updateProfile({
      displayName: full_name,
    }).then(function() {
      var temp = ['Init']
      firebase.database().ref('/users/' + user.email.replace(/\W/g, '')).set({
                      displayName: full_name,
                      userEvents: temp,
                      deductions: 0,
                      regularEventHours: 0,
                      projectEventHours: 0,
                      socialEventHours:0,
                      idNumber: idNumber,
                      grade: grade,
                      isAdmin: false
                  }).then(function(){
                     document.location.href="index.html";
                   });

    }, function(error) {
      // An error happened.
      // alert(error);
    });



  }
}
function loadAccountPage(){


    // User is signed in.
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (user.displayName == null) {
                document.location.href = "create_user.html"
            }else{
                firebase.database().ref('/users/' + user.email.replace(/\W/g, '')).once('value').then(function(snapshot) {
                    userInformation = snapshot.val();
                    var projectHours = userInformation.projectEventHours;
                    var regularHours = userInformation.regularEventHours;
                    var socialHours = userInformation.socialEventHours;
                    var deductions = userInformation.deductions;
                    var totalHours = projectHours + regularHours + socialHours - deductions;
                    var totalHoursPercent = ((projectHours + regularHours + socialHours - deductions)/16.0)*100;
                    var projectHoursPercent = (projectHours/4.0)*100;
                    var socialHoursPercent = (socialHours/2.0)*100;
                    var regularHoursPercent = (regularHours/10.0)*100;
                    var deductionsPercent = (deductions/(totalHours + 0.0) )*100;
                    var allPercents = [totalHoursPercent, projectHoursPercent, socialHoursPercent, regularHoursPercent, deductionsPercent];
                    for(i = 0; i < allPercents.length; i++){
                        if(allPercents[i] > 100){
                            allPercents[i] = 100
                        }
                    }

                    var loadbarhtml = '<h3>Hours</h3><p>You must meet the requirements for project, social, and total hours to complete your hours.</p>'+
                        '         <div class="skill-bar">'+
                        '           <div class="skillbar clearfix " id = "totalHoursBar" data-percent="' + totalHoursPercent + '%">'+
                        '             <div class="skillbar-title">'+
                        '               <span>Total</span>'+
                        '             </div>'+
                        '             <div class="skillbar-bar" style="width: ' + allPercents[0] + '%;"></div>'+
                        '             <div class="skill-bar-percent" id = "totalHoursText">' + totalHours + '</div>'+
                        '           </div> <!-- End Skill Bar -->'+
                        '           <div class="skillbar clearfix" id = "regularHoursBar" data-percent="' + regularHoursPercent + '">'+
                        '             <div class="skillbar-title"><span>Regular Event</span></div>'+
                        '             <div class="skillbar-bar" style="width: ' + allPercents[3] + '%;"></div>'+
                        '             <div class="skill-bar-percent" id = "regularHoursText">' + regularHours + '</div>'+
                        '           </div> <!-- End Skill Bar -->'+
                        '           <div class="skillbar clearfix " id = "projectHoursBar" data-percent="' + projectHoursPercent + '">'+
                        '             <div class="skillbar-title"><span>Project</span></div>'+
                        '             <div class="skillbar-bar" style="width:' + allPercents[1] + '%;"></div>'+
                        '             <div class="skill-bar-percent" id = "projectHoursText">' + projectHours + '</div>'+
                        '           </div> <!-- End Skill Bar -->'+
                        '           <div class="skillbar clearfix " id = "socialHoursBar" data-percent="' + socialHoursPercent + '">'+
                        '             <div class="skillbar-title"><span>Social</span></div>'+
                        '             <div class="skillbar-bar" style="width: ' + allPercents[2] + '%;"></div>'+
                        '             <div class="skill-bar-percent" id = "socialHoursText" >' + socialHours + '</div>'+
                        '           </div> <!-- End Skill Bar -->'+
                        '           <div class="skillbar clearfix " id = "deductionsBar" data-percent="' + deductionsPercent + '">'+
                        '             <div class="skillbar-title"><span>Deductions</span></div>'+
                        '             <div class="skillbar-bar" style="width: ' + allPercents[4] + '%;"></div>'+
                        '             <div class="skill-bar-percent" id = "deductionsText" >' + deductions + '</div>'+
                        '           </div> <!-- End Skill Bar -->'+
                        '           </div>'+
                        '         </div>'+
                        '       </div>';
                    $('#skillbarsArea').append(loadbarhtml);

                    $("#totalHoursText").attr('data-percent', totalHours)

                    $("#regularHoursBar").attr('data-percent', regularHoursPercent)
                    $("#regularHoursText").attr('data-percent', regularHours)

                    $("#projectHoursBar").attr('data-percent', projectHoursPercent)
                    $("#projectHoursText").attr('data-percent', projectHours)

                    $("#socialHoursBar").attr('data-percent', socialHoursPercent)
                    $("#socialHoursText").attr('data-percent', socialHours)

                    $("#displayNameHere").text("Name: " + user.displayName)
                    $("#gradeHere").text("Grade: " + userInformation.grade)
                    $("#idNumberHere").text("ID Number: " + userInformation.idNumber)
                    if(userInformation.isAdmin){
                    $(".nav").append('<li class="scroll scrolledText"><a href="create_event.html">Create Event</a></li>');
                    }

                });
            }
        } else {
            console.log('no user')
        }
    });

  
    
  

                // user = firebase.auth().currentUser;


}
function loadEventsPage(){
    firebase.database().ref('/events/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            eventInfo = childSnapshot.val();
            var fish = eventInfo.url;
            var id = eventInfo.eventName.replace(/\W/g, '')
            var normDate = eventInfo.date.replace(/\W/g, '');
            var param = "" + String(eventInfo.eventName) + String(normDate);
            $("#events-row").append('<div class="col-sm-4">\n' +
                '            <div class="single-blog">\n' +
                '                <img src=" ' + fish + '" alt="">\n' +
                '                <h2>' + eventInfo.eventName +'</h2>\n' +
                '                <ul class="post-meta">\n' +
                '                    <li><i class="fa fa-clock-o"></i><strong> Hours:</strong> '+ eventInfo.numHours +'</li>\n' +
                '                    <li><i class="fa fa-calendar"></i><strong> Event On:</strong> ' + eventInfo.date+'</li>\n' +
                '                </ul>\n' +
                '                <div class="blog-content">\n' +
                '                    <p> Remaining Spots: ' + eventInfo.spotsRemaining +'</p>\n' +
                '                </div>\n' +
                '                <a href="" class="btn btn-primary" data-toggle="modal" data-target="#'+ id + '">Read More</a>\n' +
                '            </div>\n' +
                '            <div class="modal fade blog-detail" id="' + id +'" tabindex="-1" role="dialog" aria-hidden="true">\n' +
                '                <div class="modal-dialog">\n' +
                '                    <div class="modal-content">\n' +
                '                        <div class="modal-body">\n' +
                '                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\n' +
                '                            <img src=" ' + fish + '" alt="">\n' +
                '                            <h2>'+ eventInfo.eventName +'</h2>\n' +
                '                            <p>'+ eventInfo.description +'</p>\n' +
                ' <button id = "eventSignUpButton' + id + '"> Sign Up </button><br><br><br><div id = "partics' + id + '"></div>' +
                '                        </div>\n' +
                '                    </div>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>')
            $('#eventSignUpButton' + id).attr('onclick', 'signUpEvent("' + param + '")');
            participants = eventInfo.participants
            for (i = 0; i < participants.length; i++) { 
              $('#partics' + id).append('<p>' + participants[i] +'</p>')
              }
          
        });
    });

}
// Initialize Firebase
function submitBlog(){

  var eventName = $('#eventName').val();
    var date = $('#date').val();
    var normDate = date.replace(/\W/g, '');
    var blog_post = $('#message').val();
    var user = firebase.auth().currentUser;


    firebase.database().ref('/blog/' + user.displayName + normDate).set({
                    eventName: eventName,
                    date: date,
                    post: blog_post,
                    visible: false
                }).then(function(){
                  alert('Post Submitted!');
                  document.location.href="index.html";
                });
}
function adminLock(){
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            firebase.database().ref('/users/' + user.email.replace(/\W/g, '')).once('value').then(function(snapshot) {
                userInformation = snapshot.val()
                if(!userInformation.isAdmin){
                    alert("Access Denied");
                    document.location.href='index.html'
                }
            });
        }else{
            alert("Access Denied");
            document.location.href='index.html'
        }
    });
}
function submitBugReport(param) {
    var report = $("#bugReport").val();
    firebase.database().ref('/bugs/' + Date.now()).update({
        report: report
    }).then(function () {
        document.location.href = "index.html";
    });

}

function loadBlog(){
  firebase.database().ref('/blog/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
              blogInfo = childSnapshot.val();
              if(blogInfo.visible){
var myvar = '<div class="col-sm-4">'+
'       <div class="single-blog">'+
'         <h2>' +blogInfo.date + ": " + blogInfo.eventName + '</h2>'+
'         <ul class="post-meta">'+
'           <li><i class="fa fa-pencil-square-o"></i><strong> Posted By:</strong> ' + blogInfo.writer + '</li>'+
'           <li><i class="fa fa-clock-o"></i><strong> Posted On:</strong> ' + blogInfo.date + ' </li>'+
'         </ul>'+
'         <div class="blog-content">'+
'           <p>'+ blogInfo.post.substring(0,100) + '</p>'+
'         </div>'+
'         <a href="" class="btn btn-primary" data-toggle="modal" data-target="#blog-detail">Read More</a>'+
'       </div>'+
'       <div class="modal fade" id="blog-detail" tabindex="-1" role="dialog" aria-hidden="true">'+
'         <div class="modal-dialog">'+
'           <div class="modal-content">'+
'             <div class="modal-body">'+
'               <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
'               <h2>'+ blogInfo.date + ": " + blogInfo.eventName + '</h2>'+
'               <p>' +  blogInfo.post + '</p>'+
'             </div> '+
'           </div>'+
'         </div>'+
'       </div>'+
'     </div>'+
'     '+
'   </div>';
    $('#blogListDiv').append(myvar);
  }
        });
      });
}