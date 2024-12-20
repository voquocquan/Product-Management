import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MSG
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if(content) {
      socket.emit("CLIENT_SEND_MSG", content)
      e.target.elements.content.value = ""
    }        
  });
}
// END CLIENT SEND MSG

// SERVER_RETURN_MSG
socket.on("SERVER_RETURN_MSG", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  let htmlFullName = "";

  if(myId == data.userId){
    div.classList.add("inner-outcoming");
  } else{
    htmlFullName=`<div class="inner-name">${data.fullName}</div>`
    div.classList.add("inner-incoming");
  }
  div.classList.add("inner-incoming");
  div.innerHTML= `
    ${htmlFullName}
    <div class="inner-content"> ${data.content}</div>
  `;

  body.appendChild(div); 
  body.scrollTop = body.scrollHeight;


})
// END SERVER_RETURN_MSG

//Scroll Chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if(bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

//End Scroll Chat to bottom

//Show Icon Chat
const buttonIcon = document.querySelector(".button-icon");
if(buttonIcon){
  const button = document.querySelector('button-icon')
  const tooltip = document.querySelector('.tooltip')
  Popper.createPopper(buttonIcon, tooltip)

  buttonIcon.onclick = () => {
    tooltip.classList.toggle('shown')
  }
}
//End Show Icon Chat

// show popup - insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  })
}

// end show popup