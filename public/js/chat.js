import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

//Upload images : file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
  maxFileCount: 5,
  multiple: true,
});
//End upload images

//Chat cơ bản
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  const input = formSendData.querySelector("[name='content']");
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = input.value;
    const images = upload.cachedFileArray || [];
    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images
      });
      socket.emit("CLIENT_SEND_TYPING", "hidden");
      input.value = "";
      upload.resetPreviewPanel(); // clear all selected images
    }
  })
}
//End Chat cơ bản

//Socket.io
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const elementListTyping = document.querySelector(".chat .inner-list-typing");
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]");
  const userId = myId.getAttribute('my-id');
  const div = document.createElement("div");
  let userName = "";
  let images = "<div class='inner-images'>";
  if ((userId != data.account_send && data.account_send !== "") || (data.account_receive == userId && data.account_send === "")) {
    div.classList.add("inner-incoming");
    userName = `${data.fullName}`;
  } else {
    div.classList.add("inner-outgoing");
  }
  for (const image of data.images) {
    images += `<img src = '${image}'></div>`
  }
  images += "</div>"

  let content = "";
  if (data.content.length > 0) {
    content = `<div class="inner-content">${data.content}</div>`;
  }

  div.innerHTML = `
  ${userName}
  ${content}
  ${images}
  `;

  body.insertBefore(div, elementListTyping)

  bodyChat.scrollTop = bodyChat.scrollHeight;

  const gallery = new Viewer(div);
})
//End Socket.io

//Scoll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//End Scoll chat to bottom

//Function CLIENT_SEND_TYPING
var removeTimeout;
const sendTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(removeTimeout);

  removeTimeout = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 8000)
}
//ENd Function CLIENT_SEND_TYPING

//Icon : emoji-picker-element
const buttonIcon = document.querySelector(".button-icon");
const toolTip = document.querySelector(".tooltip");
if (buttonIcon) {
  Popper.createPopper(buttonIcon, toolTip);
  buttonIcon.addEventListener("click", () => {
    toolTip.classList.toggle("shown");
  })
}

var index;
const input = formSendData.querySelector("[name='content']");

input.addEventListener("click", (e) => {
  index = e.target.selectionStart;
  console.log(index);
})

const icon = document.querySelector("emoji-picker");
if (icon) {
  icon.addEventListener("emoji-click", (e) => {
    const iconValue = e.detail.unicode;
    input.value = input.value.slice(0, index) + iconValue + input.value.slice(index, input.value.length);
    index += 2;
    input.setSelectionRange(index, index);
    input.focus();
    sendTyping();
  })

}
//End Icon

//Typing
if (input) {
  input.addEventListener("keyup", (e) => {
    index = input.value.length;
    sendTyping();
  })
}

const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (user) => {
    if (user.type == "show") {
      const boxTypingExists = elementListTyping.querySelector("[data-id]");
      if (!boxTypingExists) {
        const div = document.createElement("div");
        div.classList.add("box-typing");
        div.setAttribute("data-id", user.userId);
        div.innerHTML = `
        <div class="inner-name">${user.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `
        elementListTyping.appendChild(div);
        const body = document.querySelector(".chat .inner-body");
        body.scrollTop = body.scrollHeight;

      }
    } else {
      const boxTypingExists = elementListTyping.querySelector("[data-id]");
      if (boxTypingExists) {
        elementListTyping.removeChild(boxTypingExists);
      }
    }
  })
}
//End Typing

//Full screen image 
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
console.log(bodyChatPreviewImage);
const gallery = new Viewer(bodyChatPreviewImage);
//End full screen image
