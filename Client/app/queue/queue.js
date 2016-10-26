//Queue controller

angular.module('app.queue', [])

.controller('QueueController', ['$scope', 'Tickets', 'Auth', '$interval', function($scope, Tickets, Auth, $interval){

  $scope.data = {};
  var SVGpulse;
  var SVGdot;

  socket.on('ticketChange', () =>{
    initializeQueue();
  });

  var initializeQueue = function() {
    //retrieve tickets from database
    Tickets.getTickets()
      .then(function(results){

        SVGpulse = document.getElementsByClassName('pulse');
        SVGdot = document.getElementsByClassName('dot');

        //add tickets to the scope
        $scope.data.tickets = results.data.tickets;
        //iterate through all tickets
        for (var ticket of $scope.data.tickets) {
          //if the userId of the ticket matches the current session user
          if (ticket.userId === results.data.userID) {
            //add and set isMine attribute to true
            ticket.ismine = true;
          } else {
            ticket.ismine = false;
          }
        }

        //set claims to the scope
        $scope.data.claims = results.data.claims;

        //iterate through all claims
        for (var claim of $scope.data.claims) {
          //if the helpee (user) id of the claim matches the current session user
          if (claim.helpeeId === results.data.userID) {
            //alert the helpee and include the name of the user who claimed the ticket
            alert(claim.user.displayname + ' is on their way!');

            for (var ticket of $scope.data.tickets) {
              //if the ticket's claimed attribute is true and the user of the claimed ticket matches the current session user
                //set the ticket's preSolved state to true
              if (ticket.claimed && ticket.userId === results.data.userID) {
                ticket.preSolved = true;
              }
            }
            //Delete the claim from the database
            Tickets.eraseClaim(claim)
            .then(function () {
              //wipe out client-side claims object
               $scope.data.claims = {};
            })
          }
        }
      })
      .catch(function(error){
        console.error(error);
      })
  }

  $scope.ticket = {};

  $scope.addTicket = function () {
    
  //assign random color for each ticket's dot
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split(''),
        color = '#';
    for(var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  $scope.ticket.color =  getRandomColor();

  if ($scope.ticket.location === 'Lecture Hall') {
    $scope.ticket.x = Math.random() * 165 + 25;
    $scope.ticket.y = Math.random() * 50 + 50;

  } else if ($scope.ticket.location === 'Pairing Station') {
    $scope.ticket.x = Math.random() * 165 + 25;
    $scope.ticket.y = Math.random() * 70 + 140;

  } else if ($scope.ticket.location === 'Kitchen') {
    $scope.ticket.x = Math.random() * 165 + 25;
    $scope.ticket.y = Math.random() * 80 + 240;

  } else if ($scope.ticket.location === 'Couch') {
    $scope.ticket.x = Math.random() * 120 + 250;
    $scope.ticket.y = Math.random() * 95 + 230;

  } else if ($scope.ticket.location === 'Senior Zone') {
    $scope.ticket.x = Math.random() * 100 + 270;
    $scope.ticket.y = Math.random() * 240 + 370;

  } else if ($scope.ticket.location === 'The Hopper') {
    $scope.ticket.x = Math.random() * 135 + 25;
    $scope.ticket.y = Math.random() * 80 + 470;

  } else if ($scope.ticket.location === 'The Dijkstra') {
    $scope.ticket.x = Math.random() * 135 + 25;
    $scope.ticket.y = Math.random() * 65 + 590;

  } else if ($scope.ticket.location === 'The Ada') {
    $scope.ticket.x = Math.random() * 80 + 290;
    $scope.ticket.y = Math.random() * 105 + 655;

  } else if ($scope.ticket.location === 'Entrance Hall') {
    $scope.ticket.x = Math.random() * 235 + 25;
    $scope.ticket.y = Math.random() * 70 + 690;
  }

  //retrieve new ticket from html form, pass to add Ticket function
  Tickets.addTicket($scope.ticket)
    .then(function () {
      $scope.ticket = {};
      initializeQueue();
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  $scope.signout = function () {
    Auth.signout();
  }

  $scope.claimTicket = function (ticket) {

    //once 'claim' has been clicked'
      //pass the claimed ticket to claim Ticket service
    Tickets.claimTicket(ticket)
      .then(function () {
        initializeQueue();
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  $scope.solveTicket = function (ticket) {

    //if 'Solved' has been clicked on the ticket, pass that ticket into solveTicket service
     Tickets.solveTicket(ticket)
       .then(function () {
         initializeQueue();
       })
       .catch(function (err) {
         console.log(err);
       });
  }


  $scope.unsolveTicket = function (ticket) {

    //if 'Not Solved' is clicked, pass the ticket to unsolveTicket service
     Tickets.unsolveTicket(ticket)
      .then(function () {
        initializeQueue();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  initializeQueue();

  //place initialize queue in an interval so new tickets can be loaded continuously every 3 seconds
  // var interval = $interval(initializeQueue, 3000);
  // var isRunning = true;


  //functionality: on hover of ticket, hide all dots that do not match ticket's x and y coordinates
  $scope.showDot = function (ticketX, ticketY) {
    // $interval.cancel(interval);
    // isRunning = false;

    //iterate through all dots
    for (var i = 0; i < SVGdot.length; i++) {
      //find each dot's x and y coordinates
      var x = SVGdot[i].parentElement.parentElement.getAttribute('x');
      var y = SVGdot[i].parentElement.parentElement.getAttribute('y');

      //given the x and y coordinates of the ticket (ticketX, ticketY, if the dot and the ticket coordinates do NOT match, add class 'hidden' to dot.
      if (x !== ticketX.toString() && y !== ticketY.toString()) {
        SVGpulse[i].setAttribute('class', 'pulse hiddenPulse');
        SVGdot[i].setAttribute('class', 'dot hiddenDot');
      }
    }
  }

  //renews interval if it has not been running already when hover event is over 
  // $scope.renew = function () {
  //   if (!isRunning) {
  //     initializeQueue();
  //     interval = $interval(initializeQueue, 3000);
  //     isRunning = true;
  //   }
  // };
}])
