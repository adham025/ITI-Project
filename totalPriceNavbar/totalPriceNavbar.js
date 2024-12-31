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
let totalPriceNavbar = document.querySelector(".totalPriceNavbar");


let userId = localStorage.getItem("userId_iti");
if (userId != null) {
  let usersRef = ref(db, "totalPriceNavbar/" + userId);
  get(usersRef).then(async (snapshot) => {
    let data = await snapshot.val();
    console.log(data);
    if(data){
      totalPriceNavbar.innerHTML = data.total + " EGP";
    }else{
      totalPriceNavbar.innerHTML = "0.00 EGP";
    }
  });
}

