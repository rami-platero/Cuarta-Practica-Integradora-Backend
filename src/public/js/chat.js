let user;

Swal.fire({
  icon: "info",
  title: "Enter your username",
  input: "text",
  text: "Enter your username to start chatting",
  color: "#716add",
  inputValidator: (value) => {
    if (!value) {
      return "You must enter a username to continue";
    } else {
      socket.emit("user_connection", { user: value });
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  const $title = document.getElementById("title");
  $title.innerHTML = `Welcome to the chat, <span>${user}</span>!`;
});

const $form = document.getElementById("chatForm");
const socket = io();

const notifyError = (message) => {
  Toastify({
    text: `ERROR: ${message}`,
    position: "left",
    gravity: "bottom",
    style: {
      background: "#ff383f",
    },
  }).showToast();
};

const formatValidationErrors = (errors) => {
  let formattedErrors = [];

  errors.forEach((error) => {
    formattedErrors.push(error.message);
  });

  return formattedErrors;
};

const createMessage = async () => {
  try {
    const formData = new FormData($form);
    const data = { user };
    formData.forEach((value, key) => {
      data[key] = value;
    });
    await axios.post("/api/messages", data);
    $form.reset();
    $chatBox.scrollTop = $chatBox.scrollHeight;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response.status === 409) {
        // validation error
        const formattedErrors = formatValidationErrors(
          error.response.data.error
        );
        formattedErrors.forEach((errorMessage) => {
          notifyError(errorMessage);
        });
      }
      if(error.response.status === 401){
        notifyError(error.response.data.message);
      }
    } else {
      notifyError("Internal server error.");
    }
  }
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createMessage();
});

const $messageInput = document.getElementById("messageInput");

$messageInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    await createMessage();
  }
});

const $chatBox = document.getElementById("chatBox");

socket.on("new_message", (newMessage) => {
  const $template = document.getElementById("message-template").content;
  const $container = document.getElementById("chatBox");
  const $fragment = document.createDocumentFragment();

  $template.querySelector(".user").textContent = newMessage.user;
  $template.querySelector(".message").textContent = newMessage.message;

  let $clone = document.importNode($template, true);
  $fragment.appendChild($clone);

  $container.appendChild($fragment);
});
