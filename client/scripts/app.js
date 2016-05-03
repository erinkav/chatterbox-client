// YOUR CODE HERE:
var username; 
var currentRoomname = 'home';

var friends = {};

$(document).ready( function() {
  refresh();
  $('.sendMessage').on('click', function () {
    var messageObj = {};
    messageObj.username = username;
    messageObj.text = $('.userMessage').val();
    messageObj.roomname = 'fred fan club'; 
    sendMessage(messageObj); 
  });
  $('.getMessages').on('click', function () {
    refresh(); 
  });
  $('.submitName').on('click', function () {
    nameChange($('.updatedName').val()); 
  }); 

  $('select').change(function() {
    changeRoom($('select option:selected').val()); 
    refresh(); 
  }); 

  $('.home').on('click', function () {
    currentRoomname = 'home';
    refresh(); 
  });

  $('.makeNewRoom').on('click', () => {
    changeRoom($('.roomName').val()); 
    refresh();  
  });

  $(document).on('click', '.username', function () {
    friends[$(this).text()] = $(this).text();
    refresh(); 
  }); 
}); 

var refresh = function() {
  //$('option').remove();
  $('p').remove();
  getMessages(); 
};
// var message = {
//   username: 'shawndrost',
//   text: 'trololo',
//   roomname: '4chan'
// };

var nameChange = function (name) {
  username = name; 
}; 

var changeRoom = function(room) {
  currentRoomname = room; 
}; 
var rooms = {}; 
var updateBody = function(data) {
  try {
    _.each(data, function (val) {
      if (!(val.roomname in rooms)) {
        rooms[val.roomname] = val.roomname;
        if (escapeString(val.roomname) !== undefined) {
          $('.rooms').append('<option>' + escapeString(val.roomname) + '</option>'); 
        }
      }

      var P;
      if (val.username in friends) {
        P = "<p style='font-weight:bold'> <span class='username'>" + escapeString(val.username) + '</span>' + ': ' + '<span class="message">' + escapeString(val.text) + '</span></p>';
      } else {
        P = "<p> <span class='username'>" + escapeString(val.username) + '</span>' + ': ' + '<span class="message">' + escapeString(val.text) + '</span></p>';
      }

      if (currentRoomname === 'home') {
        $('#chats').append(P);
        
      } else if (val.roomname === currentRoomname) {
        $('#chats').append(P);
      }

      // if (val.username in friends) {
      //   $('p:contains(' + val.username + ')').css('font-weight', 'bold'); 
      // }
    }); 
  } catch (e) {
    console.dir(e);
  }
};

var sendMessage = function(message) { 
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (message) {
      console.log('chatterbox: Message sent');
    },
    error: function (message) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

var getMessages = function() {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log(data.results); 
      updateBody(data.results); 
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
//Escaping &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ] is almost enough
var escapeString = function(string) {
  console.log(string);
  try {
    if (string === null || string === undefined) {
      return undefined; 
    } else {
      string = string.replace('<', '');
      string = string.replace('>', '');
      string = string.replace('\"', '');
      string = string.replace('\'', '');
      string = string.replace('$', '');
      string = string.replace('=', '');
      string = string.replace('{', '');
      string = string.replace('@', '');
      string = string.replace('(', '');
      string = string.replace('`', '');
      return string;
    }
  } catch (e) {
    console.log(string);
    console.log(e);
  }
};
