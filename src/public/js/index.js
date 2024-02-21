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

// validations
const validateFields = (data) => {
  const allowedFields = {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    code: {
      type: "string",
      required: true,
    },
    stock: {
      type: "number",
      required: true,
    },
    price: {
      type: "number",
      required: true,
    },
    category: {
      type: "string",
      required: true,
    },
  };

  const dataKeys = Object.keys(data);
  const allowedKeys = Object.keys(allowedFields);

  for (const dataKey of dataKeys) {
    if (!allowedKeys.includes(dataKey)) {
      throw new AppError(400, { message: `${dataKey} is not a valid field.` });
    }
    // parse data with type number
    if (allowedFields[dataKey].type === "number" && !isNaN(data[dataKey])) {
      data[dataKey] = Number(data[dataKey]);
    }
  }

  for (const key of allowedKeys) {
    if (!dataKeys.includes(key) && allowedFields[key].required) {
      throw new AppError(400, { message: `${key} field is missing.` });
    }
  }

  return data;
};

const addProduct = async () => {
  try {
    const formData = new FormData($form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const parsedData = validateFields(data);
    await axios.post("/api/products", parsedData);
    $form.reset();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return notifyError(error.response.data.message);
    }
    if ("message" in error) {
      return notifyError(error.message);
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
  await addProduct();
});

socket.on("add_product", (newProduct) => {
  const $template = document.getElementById("product-template").content;
  const $container = document.getElementById("products");
  const $fragment = document.createDocumentFragment();

  $template.querySelector(".title").textContent = newProduct.title;
  const formattedPrice = `$ ${newProduct.price}.00`;
  $template.querySelector(".price").textContent = formattedPrice;
  $template.querySelector("div").dataset.id = newProduct.id;
  $template.querySelector(".deleteBtn").dataset.deleteid = newProduct.id;
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
