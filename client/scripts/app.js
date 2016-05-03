// YOUR CODE HERE:
// let username; 
// let currentRoomname = 'home';

// let friends = {};
let [username, currentRoomname, friends] = [undefined, 'home', {}]; 

console.log(username, currentRoomname, friends); 

$(document).ready(function() {
  refresh();
  $('.sendMessage').on('click', () => {
    const messageObj = {};
    messageObj.username = username;
    messageObj.text = $('.userMessage').val();
    messageObj.roomname = 'fred fan club'; 
    sendMessage(messageObj); 
  });
  $('.getMessages').on('click', () => {
    refresh(); 
  });
  $('.submitName').on('click', () => {
    nameChange($('.updatedName').val()); 
  }); 

  $('select').change(() => { 
    changeRoom($('select option:selected').val()); 
    refresh(); 
  }); 

  $('.home').on('click', () => {
    currentRoomname = 'home';
    refresh(); 
  });

  $('.makeNewRoom').on('click', () => {
    changeRoom($('.roomName').val()); 
    refresh();  
  });

  $(document).on('click', '.username', () => {
    friends[$(this).text()] = $(this).text();
    refresh(); 
  }); 
}); 

const refresh = () => { 
  $('p').remove();
  getMessages(); 
};

const nameChange = (name) => {
  username = name; 
}; 

const changeRoom = (room) =>{
  currentRoomname = room; 
};

const rooms = {}; 

const updateBody = (data) => {
  try {
    _.each(data, (val) => {
      if (!(val.roomname in rooms)) {
        rooms[val.roomname] = val.roomname;
        if (escapeString(val.roomname) !== undefined) {
          $('.rooms').append('<option>' + escapeString(val.roomname) + '</option>'); 
        }
      }

      let P;
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
    }); 
  } catch (e) {
    console.dir(e);
  }
};

const sendMessage = (message) => { 
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success:  (message) => {
      console.log('chatterbox: Message sent');
    },
    error:  (message) => {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

const getMessages = () => {
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success:  (data) => {
      updateBody(data.results); 
    },
    error:  (data) => {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
//Escaping &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ] is almost enough
const escapeString = (string) => {
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
    console.log(e);
  }
};
