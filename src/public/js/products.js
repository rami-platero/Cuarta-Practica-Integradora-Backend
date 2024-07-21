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

const addProductToCart = async (pid,cid) => {
  try {
    await axios.post(`/api/carts/${cid}/products/${pid}`);
    return notifySuccess("Product added to cart successfully.");
  } catch (error) {
    return handleErrors(error)
  }
};

const handleLogout = async () => {
  try {
    const result = await axios.post("/api/auth/logout")
    if(result.status === 200){
      window.location.replace("/login")
    }
  } catch (error) {
    return handleErrors(error)
  }
}

document.addEventListener("click", async (e) => {
  if (e.target.matches(".addToCart")) {
    await addProductToCart(e.target.dataset.id,e.target.dataset.cartid);
  }
  if(e.target.matches("#logout")){
    await handleLogout()
  }
});
