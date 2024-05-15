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

const notifySuccess = (message) => {
  Toastify({
    text: message,
    position: "left",
    gravity: "bottom",
    style: {
      background: "#0eb039",
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

const handleErrors = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response.status === 409) {
      const formattedErrors = formatValidationErrors(error.response.data.error);
      return formattedErrors.forEach((errorMessage) => {
        notifyError(errorMessage);
      });
    }

    if ("cause" in error.response.data) {
      return notifyError(error.response.data.cause);
    }
  }
  return notifyError("Internal server error.");
};

const handleLogin = async () => {
  try {
    const formData = new FormData($loginForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const result = await axios.post("/api/auth/login", data);
    if(result.status === 200) {
      window.location.replace("/products")
    }
  } catch (error) {
    console.log(error);
    return handleErrors(error);
  }
};

const $loginForm = document.getElementById("loginForm");

$loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleLogin();
});
