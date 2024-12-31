let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let email = document.getElementById("email");
let submit = document.getElementById("submit");
let textMessage = document.getElementById("textMessage");
let form = document.getElementById("myForm");

firstName.addEventListener("keyup", firstNameValidate);
lastName.addEventListener("keyup", lastNameValidate);
email.addEventListener("keyup", validationEmail);
textMessage.addEventListener("keyup", textMessageVal);
submit.addEventListener("click", send);

function firstNameValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(firstName.value) == true) {
    firstName.style.borderColor = "green";
    firstName.nextElementSibling.innerHTML = "FirstName input is valid";
    firstName.nextElementSibling.style.color = "green";
    return firstName.value;
  } else {
    firstName.style.borderColor = "red";
    firstName.nextElementSibling.innerHTML =
      "FirstName input must be more than or equal 3 English characters !";
    firstName.nextElementSibling.style.color = "red";
    firstName.nextElementSibling.style.fontSize = "15px";
    return false;
  }
}

function lastNameValidate() {
  let pattern = /^[a-zA-Z]{3,}/;
  if (pattern.test(lastName.value) == true) {
    lastName.style.borderColor = "green";
    lastName.nextElementSibling.innerHTML = "LastName input is valid";
    lastName.nextElementSibling.style.color = "green";
    return lastName.value;
  } else {
    lastName.style.borderColor = "red";
    lastName.nextElementSibling.innerHTML =
      "LastName input must be more than or equal 3 English characters !";
    lastName.nextElementSibling.style.color = "red";
    lastName.nextElementSibling.style.fontSize = "15px";
    return false;
  }
}

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
    email.nextElementSibling.style.fontSize = "15px";
    return false;
  }
}

function textMessageVal() {
  if (textMessage.value != "") {
    textMessage.nextElementSibling.innerHTML = "";
    textMessage.style.borderColor = "green";
    return textMessage.value;
  } else {
    textMessage.style.borderColor = "red";
    textMessage.nextElementSibling.innerHTML = "Please type your message";
    textMessage.nextElementSibling.style.color = "red";
    textMessage.nextElementSibling.style.fontSize = "15px";
    return false;
  }
}

function send(e) {
  e.preventDefault();
  let fFun = firstNameValidate();
  let lFun = lastNameValidate();
  let mailFun = validationEmail();
  let textFun = textMessageVal();
  submit.nextElementSibling.innerHTML = "";
  if (fFun && lFun && mailFun && textFun) {
    form.reset();
    firstName.nextElementSibling.innerHTML = "";
    firstName.style.borderColor = "black";
    lastName.nextElementSibling.innerHTML = "";
    lastName.style.borderColor = "black";
    email.nextElementSibling.innerHTML = "";
    email.style.borderColor = "black";
    textMessage.nextElementSibling.innerHTML = "";
    textMessage.style.borderColor = "black";

    submit.nextElementSibling.innerHTML = "We will contact you soon.";
    submit.nextElementSibling.style.color = "green";
  } else {
    console.log("error");
  }
}
