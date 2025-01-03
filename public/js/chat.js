import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// CLIENT_SEND_MSG
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    if(content) {
      socket.emit("CLIENT_SEND_MSG", content)
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }        
  });
}
// END CLIENT SEND MSG

// SERVER_RETURN_MSG
socket.on("SERVER_RETURN_MSG", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

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

  body.insertBefore(div, boxTyping); 
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

// Show Typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 2000);
}

// ENd Show Typing

// show popup - insert icon to input
const emojiPicker = document.querySelector("emoji-picker");
if(emojiPicker) {
  const inputChat = document.querySelector(".chat .inner-form input[name='content']");
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;

    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();

    showTyping();
  });
  //Input keyup - typing

  inputChat.addEventListener("keyup", () => {
    showTyping();
    
  });
};

// end show popup

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if(elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    console.log(data);
    if(data.type == "show") {
      const bodyChat = document.querySelector(".chat .inner-body");
      const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if(!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId)

        boxTyping.innerHTML = `
          <div class="inner-name"> ${data.fullName} </div>
          <div class="inner-dots">  
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        elementListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
      if(boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  })
}

// END SERVER_RETURN_TYPING