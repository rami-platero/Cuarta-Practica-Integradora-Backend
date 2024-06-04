const $form = document.getElementById("resetPasswordForm");

const resetPassword = async () => {
  try {
    const formData = new FormData($form);
    const data = { confirmPassword, password, token };
    formData.forEach((value, key) => {
      data[key] = value;
    });
    await axios.post(`/api/auth/reset-password/${data.token}`, data);
  } catch (error) {
    console.log(error);
  }
};

$form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await resetPassword();
});
