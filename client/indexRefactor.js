// let username; 
// let currentRoomname = 'home';

// let friends = {};
let [username, currentRoomname, friends] = [undefined, 'home', {}]; 

// $(document).ready(function() {
  var app = {
    sendMessage: (message) => { 
      $.ajax({
        url: 'https://api.parse.com/1/classes/messages',
        type: 'POST',
        data: JSON.stringify(message),
        contentType: 'application/json',
        success:  (message) => {
          console.log('chatterbox: Message sent');
        },
        error:  (message) => {
          console.error('chatterbox: Failed to send message', data);
        }, 
        click: () => $('.sendMessage').on('click', () => {
          const messageObj = {};
          messageObj.username = username;
          messageObj.text = $('.userMessage').val();
          messageObj.roomname = 'fred fan club'; 
          sendMessage(messageObj); 
        })
      }); 
    }, 

    refresh: () => { 
      $('p').remove();
      app.getMessages(); 
    },  

    nameChange: (name) => {
      username = name; 
    },

    changeRoom: (room) => {
      currentRoomname = room; 
    },

    updateBody: (data) => {
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
    },
    getMessages: () => {
      $.ajax({
        url: 'https://api.parse.com/1/classes/messages',
        type: 'GET',
        contentType: 'application/json',
        success:  (data) => {
          app.updateBody(data.results); 
        },
        error:  (data) => {
          console.error('chatterbox: Failed to send message', data);
        }
      });
    },
  }; 

  $('.getMessages').on('click', () => {
    app.refresh(); 
  });

  $('.submitName').on('click', () => {
    app.nameChange($('.updatedName').val()); 
  }); 

  $('select').change(() => { 
    app.changeRoom($('select option:selected').val()); 
    app.refresh(); 
  }); 

  $('.home').on('click', () => {
    app.currentRoomname = 'home';
    app.refresh(); 
  });

  $('.makeNewRoom').on('click', () => {
    app.changeRoom($('.roomName').val()); 
    app.refresh();  
  });

  $(document).on('click', '.username', () => {
    friends[$(this).text()] = $(this).text();
    app.refresh(); 
  }); 
// }); 

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