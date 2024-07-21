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

const openContextMenu = (e) => {
  const $tdParent = e.target.closest("td");
  const $contextMenuTemplate = document.getElementById("contextMenu").content;
  $contextMenuTemplate.querySelector("button").dataset.id = e.target.dataset.id;
  let $clone = document.importNode($contextMenuTemplate, true);
  $tdParent.appendChild($clone);
};

const checkAndCloseContextMenu = () => {
  const $existingContextMenu = document.querySelector(".contextMenu");
  if ($existingContextMenu) {
    $existingContextMenu.remove();
  }
};

const getUserData = (id) => {
  const $data = document.querySelectorAll(`tr[data-id="${id}"] td`);
  return { email: $data[1].textContent, role: $data[2].textContent, id };
};

const openChangeRoleModal = (e) => {
  const $template = document.getElementById("changeRoleModalTemplate").content;
  const userData = getUserData(e.target.dataset.id);
  const newRole = userData.role === "premium" ? "user" : "premium";
  $template.querySelector(
    "p"
  ).textContent = `By clicking on the button you will change the role of the user with id: ${userData.id} and email address: ${userData.email} to ${newRole}`;
  $template.querySelector("button").dataset.id = userData.id;
  let $clone = document.importNode($template, true);
  document.body.appendChild($clone);
};

const updateRoleInUI = (id) => {
  const $currentRole = document.querySelectorAll(`tr[data-id="${id}"] td`)[2];
  const newRole = $currentRole.textContent === "premium" ? "user" : "premium";
  $currentRole.textContent = newRole;
};

const closeChangeRoleModal = () => {
  document.getElementById("changeRoleModal").remove();
};

const handleChangeRole = async (e) => {
  try {
    const res = await axios.post(`/api/auth/premium/${e.target.dataset.id}`);
    updateRoleInUI(e.target.dataset.id);
    notifySuccess(res.data.message);
  } catch (error) {
    handleErrors(error);
  } finally {
    closeChangeRoleModal();
  }
};

document.addEventListener("click", async (e) => {
  if (e.target.matches(".ellipsisBtn")) {
    checkAndCloseContextMenu();
    openContextMenu(e);
  } else if (e.target.matches(".changeRoleBtn")) {
    checkAndCloseContextMenu();
    openChangeRoleModal(e);
  } else if (e.target.matches("#changeRole")) {
    await handleChangeRole(e);
  } else {
    checkAndCloseContextMenu();
  }
});
