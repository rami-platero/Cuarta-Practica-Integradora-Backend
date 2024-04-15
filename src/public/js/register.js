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

    if ("message" in error.response.data) {
      return notifyError(error.response.data.message);
    }
  }
  return notifyError("Internal server error.");
};

const handleRegister = async () => {
  try {
    const formData = new FormData($registerForm);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    const result = await axios.post("/api/auth/register", data);
    if(result.status === 201) {
      window.location.replace("/products")
    }
  } catch (error) {
    console.log(error);
    return handleErrors(error);
  }
};

const $registerForm = document.getElementById("registerForm");

$registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await handleRegister();
});
