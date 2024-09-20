const email1 = "nha..nh@gm.com"
const email2 = "fff.zz@d.css"
const password1 = "1abcS@()ccc"
const password2 = "@fcc1()"

function emailValidation(email) {
  const emailRegex = /^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  console.log(email, "is", emailRegex.test(email), "mail")
}

function passwordValidation(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>?~`]).{8,}$/
  console.log(password,"is",passwordRegex.test(password), "password")
}
emailValidation(email1);
emailValidation(email2);
passwordValidation(password1);
passwordValidation(password2);

