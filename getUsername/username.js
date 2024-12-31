import { firebaseConfig } from "../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

let userId = localStorage.getItem("userId_iti");
let usernameNav = document.querySelector(".usernameNav");
let signStatus = document.querySelector(".sign-status");
if(userId != null){
    signStatus.setAttribute("href", "../../profile/index.html")
    let usersRef = ref(db, `users/${userId}`);
    get(usersRef).then(async (snapshot) => {
        let data = await snapshot.val();
        signStatus.innerHTML = "Hello";
        usernameNav.innerHTML = data.firstName;
    });
}