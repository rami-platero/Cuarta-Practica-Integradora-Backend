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

const $form = document.getElementById("form");

const formatValidationErrors = (errors) => {
  let formattedErrors = [];

  errors.forEach((error) => {
    formattedErrors.push(error.message);
  });

  return formattedErrors;
};

const createProduct = async () => {
  try {
    const formData = new FormData($form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    await axios.post("/api/products", data);
    $form.reset();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response.status === 409) {
        // validation error
        const formattedErrors = formatValidationErrors(
          error.response.data.error
        );
        return formattedErrors.forEach((errorMessage) => {
          notifyError(errorMessage);
        });
      }
    } else {
      return notifyError(error.response.data.message);
    }
    if ("cause" in error) {
      return notifyError(error.cause);
    }
  }
};

const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/products/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return notifyError(error.response.data.message);
    }
  }
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await createProduct();
});

socket.on("add_product", (newProduct) => {
  const $template = document.getElementById("product-template").content;
  const $container = document.getElementById("products");
  const $fragment = document.createDocumentFragment();

  $template.querySelector(".title").textContent = newProduct.title;
  const formattedPrice = `$ ${newProduct.price}.00`;
  $template.querySelector(".price").textContent = formattedPrice;
  $template.querySelector("div").dataset.id = newProduct._id;
  $template.querySelector(".deleteBtn").dataset.deleteid = newProduct._id;
  let $clone = document.importNode($template, true);
  $fragment.appendChild($clone);

  $container.appendChild($fragment);
});

document.addEventListener("click", async (e) => {
  if (e.target.matches(".deleteBtn")) {
    await deleteProduct(e.target.dataset.deleteid);
  }
});

socket.on("delete_product", (id) => {
  const $foundProduct = document.querySelector(`div [data-id="${id}"]`);

  $foundProduct.remove();
});
