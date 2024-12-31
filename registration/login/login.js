import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import { firebaseConfig } from "../../config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

const auth = getAuth(app);

let inputs = document.querySelectorAll(".container input");
let loginBtn = document.getElementById("loginBtn");
let email = document.getElementById("email");
let password = document.getElementById("password");

// error handling each input has empty value when register

(function () {
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    inputs.forEach((input) => {
      if (input.value == "") {
        input.nextElementSibling.innerHTML = "fill this input please";
      }
    });

    let mailFun = validationEmail();
    let passFun = validationPassword();

    if (mailFun && passFun) {
      signInWithEmailAndPassword(auth, mailFun, passFun)
        .then(async (userCredential) => {
          // Signed in
          const user = await userCredential.user;

          let userIdFirebase = await user.uid;

          // redirectUser(userIdFirebase);
          console.log(userIdFirebase);

          let productsRef = ref(db, `users/${userIdFirebase}`);
          get(productsRef).then((snapshot) => {
            if (snapshot.exists()) {
              let usertest = snapshot.val();
              window.localStorage.setItem("userId_iti", user.uid);
              sweetAlertSuccess();
              console.log(usertest);
              if (usertest.role == "user") {
                window.location = "../../home.html";
              }else{
                window.location = "../../dashboard/dashboard.html";
              }
            }
          });

        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode == "auth/invalid-credential") {
            sweetAlertFailed("Email or password is invalid");
          } else {
            sweetAlertFailed(errorCode);
          }
        });
    } else {
      console.log("input or more is empty");
    }
  });
})();

function redirectUser(id) {
  console.log(id);

  let productsRef = ref(db, `users/${id}`);
  get(productsRef).then((snapshot) => {
    if (snapshot.exists()) {
      let usertest = snapshot.val();
      console.log(usertest);
    }
  });
}

//  validation on Email input

email.addEventListener("keyup", validationEmail);

function validationEmail() {
  let pattern = /^[a-zA-Z0-9_]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,6}$/;
  if (pattern.test(email.value) == true) {
    email.style.borderColor = "green";
    email.nextElementSibling.innerHTML = "Email is valid";
    email.nextElementSibling.style.color = "green";
    return email.value;
  } else {
    email.style.borderColor = "red";
    email.nextElementSibling.innerHTML =
      "Email is not valid (must be like nametest@gmail.com)";
    email.nextElementSibling.style.color = "red";
    return false;
  }
}

//  validation on password input

password.addEventListener("keyup", validationPassword);

function validationPassword() {
  let pattern = /^((?=.*[A-Z])(?=.*\W)(?=.*[0-9])){6,}/;
  if (pattern.test(password.value) == true) {
    password.style.borderColor = "green";
    password.nextElementSibling.innerHTML = "Password is valid";
    password.nextElementSibling.style.color = "green";
    return password.value;
  } else {
    password.style.borderColor = "red";
    password.nextElementSibling.innerHTML =
      "Password is not valid (must have at least one capital letter, one special character, one digit and count is 6 or more than)";
    password.nextElementSibling.style.color = "red";
    return false;
  }
}

function sweetAlertSuccess() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: "you are a valid user",
  });
  return Toast;
}

function sweetAlertFailed(errorMessage) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: errorMessage,
  });
  return Toast;
}
