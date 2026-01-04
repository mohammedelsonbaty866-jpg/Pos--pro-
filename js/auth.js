const auth = firebase.auth();

const phoneInput = document.getElementById("phone");
const codeInput = document.getElementById("code");
const sendBtn = document.getElementById("sendCode");
const verifyBtn = document.getElementById("verifyCode");
const loader = document.getElementById("loader");

window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
  'recaptcha-container',
  { size: 'invisible' }
);

sendBtn.onclick = () => {
  sendBtn.disabled = true;
  loader.style.display = "block";

  auth.signInWithPhoneNumber(phoneInput.value, window.recaptchaVerifier)
    .then(confirmationResult => {
      window.confirmationResult = confirmationResult;
      codeInput.disabled = false;
      verifyBtn.disabled = false;
      alert("تم إرسال الكود");
    })
    .catch(err => {
      alert(err.message);
      sendBtn.disabled = false;
    })
    .finally(() => loader.style.display = "none");
};

verifyBtn.onclick = () => {
  loader.style.display = "block";
  verifyBtn.disabled = true;

  window.confirmationResult.confirm(codeInput.value)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      alert("كود غير صحيح");
      verifyBtn.disabled = false;
    })
    .finally(() => loader.style.display = "none");
};

// 🔥 ده المهم
auth.onAuthStateChanged(user => {
  if (user) {
    window.location.href = "dashboard.html";
  }
});
