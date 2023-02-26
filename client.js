const socket = io("http://localhost:8000");

// Get Dom Elements in respective JS Variables
const form = document.getElementById("send-form");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".messageContainer");
const audio = new Audio("/public/Audio/Ting Sound Effect.mp3");

// function which will append event info to the messageContainer
const append = (message, position) => {
  const msgElem = document.createElement("div");
  msgElem.innerText = message;
  msgElem.classList.add(
    "message"
    // "badge",
    // "badge-success",
    // "shadow",
    // "text-center",
    // "p-2",
    // "mt-3"
  );
  msgElem.classList.add(position);
  messageContainer.append(msgElem);
  if (position == "left") {
    audio.play();
  }
};

// Ask new User for his/her Name and let the server know
const Name = prompt("Enter Your Name");
socket.emit("new-user-joined", Name);

// if a New User joins, receive his/her name from server 
socket.on("user-joined", (name) => {
  append(`${name} Joined the Chat`, "right");
});

// server send message, receive it
socket.on("receive", (data) => {
  append(`${data.name} : ${data.message}`, "left");
});

// // if User leave, append the info to the messageContainer
socket.on("left", (name) => {
  append(`${name} Left the Chat`, "right");
});

// if the form gets submitted, send server messege
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`you : ${message}`, "right");
    messageInput.value = "";
    socket.emit("send", message);
  });