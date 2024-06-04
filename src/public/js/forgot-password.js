const $form = document.getElementById("forgotPasswordForm");

const sendResetLink = async () => {
  try {
    const formData = new FormData($form);
    const data = { email };
    formData.forEach((value, key) => {
      data[key] = value;
    });
    await axios.post("/api/auth/forgot-password", data);
  } catch (error) {
    console.log(error);
  }
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await sendResetLink();
});
