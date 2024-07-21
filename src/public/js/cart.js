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

const handlePurchase = async (cid) => {
  try {
    await axios.post(`/api/carts/${cid}/purchase`);
    return (window.location.href = "/products");
  } catch (error) {
    return handleErrors(error)
  }
};

document.addEventListener("click", async (e) => {
  if (e.target.matches(".purchaseBtn")) {
    await handlePurchase(e.target.dataset.cid);
  }
});
