const socket = io();

const form = document.getElementById('form');
const messageInput = document.getElementById('input-message');
const userInput = document.getElementById('input-userMail')
const messages = document.getElementById('messages');


form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (messageInput.value) { 

    let data =  {
      message: messageInput.value,
      userMail: userInput.value
    };
    socket.emit('message', data); 
    messageInput.value = '';
  }
});

socket.on('message', (data) => {

  const userName = document.createElement('p')
  const item = document.createElement('li');
  userName.textContent = data.userMail;
  item.textContent = data.message;

  messages.appendChild(userName);
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});




