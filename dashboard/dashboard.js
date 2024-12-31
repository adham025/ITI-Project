import { firebaseConfig } from "../../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {
  getStorage,
  ref as imageRef,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-storage.js";
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getDatabase();

const items = document.querySelectorAll(".page .side-bar ul li");
items.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove 'selected' class from all items
    items.forEach((i) => i.classList.remove("selected"));
    // Add 'selected' class to the clicked item
    item.classList.add("selected");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      const sectionId = item.getAttribute("data-section");
      showSection(sectionId);
    });
  });
});

function showSection(sectionId) {
  const sections = document.querySelectorAll("section");

  // Hide all sections
  sections.forEach((section) => {
    section.style.display = "none";
  });

  // Remove active class from all sidebar menu items
  const menuItems = document.querySelectorAll(".side-bar .menu-item");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });

  // Add active class to the corresponding menu item
  const activeItem = document.querySelector(
    `.menu-item[data-section="${sectionId}"]`
  );
  if (activeItem) {
    activeItem.classList.add("active");
  }

  // Show the selected section
  const activeSection = document.querySelector(`section.${sectionId}`);
  if (activeSection) {
    activeSection.style.display = "block";
  }
}

// Optional: Automatically show the first section on page load
const defaultSection = document.querySelector(".menu-item.active");
if (defaultSection) {
  const sectionId = defaultSection.getAttribute("data-section");
  showSection(sectionId);
}

// Add click event listeners to sidebar menu items
const menuItems = document.querySelectorAll(".side-bar .menu-item");
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const sectionId = item.getAttribute("data-section");
    showSection(sectionId);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  showSection("cats");
});

/* CATEGORIES */
function writeCategoryData(categoryName) {
  if (categoryName.length < 3 || categoryName.length > 20) {
    document.getElementById("catError").style.display = "block";
    return;
  } else {
    document.getElementById("catError").style.display = "none";
  }
  let categoriesRef = ref(db, "categories/");
  get(categoriesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let categories = snapshot.val();
        let isDuplicated = Object.values(categories).some(
          (category) =>
            category.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (isDuplicated) {
          Swal.fire({
            title: "Duplicate Category!",
            text: `The "${categoryName}" already exists.`,
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }
      }
      const id = Date.now(); // Use current timestamp for a unique ID
      set(ref(db, "categories/" + id), {
        id: id,
        name: categoryName,
      })
        .then(() => {
          let Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "success",
            title: "Category added successfully!",
          });
          getCategories();
        })
        .catch((error) => {
          Swal.fire({
            title: "Error!",
            text: `There was an error adding the category: ${error.message}`,
            icon: "error",
            confirmButtonText: "Try Again",
          });
        });
    })
    .catch((error) => {
      Swal.fire({
        title: "Error!",
        text: `Unable to fetch categories: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}

let categoryName = document.getElementById("categoryName");
let catError = document.getElementById("catError");
categoryName.addEventListener("focus", () => {
  categoryName.style.border = "solid 1px #007bff";
});
categoryName.addEventListener("blur", () => {
  textValidation();
});
function textValidation() {
  categoryName.style.border = "";
  if (categoryName.value.length < 3 && categoryName.value != "") {
    catError.style.display = "inline";
    return false;
  } else {
    catError.style.display = "none";
    return true;
  }
}

let catForm = document.getElementById("category-form");
catForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (textValidation()) {
    let categoryNameValue = categoryName.value.trim();
    if (categoryNameValue !== "") {
      writeCategoryData(categoryNameValue);
      catForm.reset();
    } else {
      catError.style.display = "inline";
    }
  }
});

catForm.addEventListener("submit", function (event) {
  event.preventDefault();
  catForm.reset();
});

window.editCategory = function (id) {
  let updateBtn = document.getElementById("updateBtn");
  const db = getDatabase();
  const categoryRef = ref(db, "categories/" + id);

  get(categoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const categoryData = snapshot.val();
        const categoryName = categoryData.name;
        document.getElementById("categoryName").value = categoryName;
        window.scrollTo({ top: 0, behavior: "smooth" });

        const submitBtn = document.getElementById("submitBtn");
        submitBtn.style.display = "none";
        updateBtn.style.display = "flex";
        window.scrollTo(0, 0);

        updateBtn.onclick = async function (e) {
          e.preventDefault();

          const newCategoryName = document
            .getElementById("categoryName")
            .value.trim();
          if (!newCategoryName) {
            Swal.fire({
              icon: "warning",
              title: "Invalid Input",
              text: "Category name cannot be empty.",
              confirmButtonText: "OK",
            });
            return;
          }

          if (newCategoryName === categoryName) {
            Swal.fire({
              icon: "info",
              title: "No changes detected",
              text: "The category name remains the same.",
              confirmButtonText: "OK",
            });
            return;
          }

          try {
            // Check for duplicates
            const categoriesRef = ref(db, "categories");
            const snapshot = await get(categoriesRef);

            if (snapshot.exists()) {
              const allCategories = snapshot.val();
              for (let key in allCategories) {
                if (allCategories[key].name === newCategoryName) {
                  Swal.fire({
                    icon: "warning",
                    title: "Duplicate Category",
                    text: "This category name already exists.",
                    confirmButtonText: "OK",
                  });
                  return;
                }
              }
            }

            await update(ref(db, "categories/" + id), {
              name: newCategoryName,
            });

            Swal.fire({
              icon: "success",
              title: "Updated Successfully",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            getCategories();
            document.getElementById("category-form").reset();
            submitBtn.style.display = "flex";
            updateBtn.style.display = "none";
          } catch (error) {
            Swal.fire({
              title: "Error!",
              text:
                "There was an error updating the category: " + error.message,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          }
        };
      } else {
        Swal.fire({
          icon: "error",
          title: "Category not found",
          confirmButtonText: "OK",
        });
      }
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Error retrieving category data",
        text: error.message,
        confirmButtonText: "OK",
      });
    });
};

window.deleteCategory = function (id) {
  const db = getDatabase();
  const categoryRef = ref(db, "categories/" + id);
  get(categoryRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const categoryData = snapshot.val();
        const categoryName = categoryData.name;
        remove(categoryRef)
          .then(() => {
            let Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Deleted Successfully",
            });
            getCategories();
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            Swal.fire({
              title: "Error!",
              text:
                "There was an error deleting the category: " + error.message,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          });
      } else {
        console.log("No such category found!");
      }
    })
    .catch((error) => {
      console.error("Error fetching category data:", error);
    });
};

function getCategories() {
  var categoryTableBody = document.querySelector(".responsive-table tbody");
  let categoriesRef = ref(db, "categories/");
  categoryTableBody.innerHTML = "";
  get(categoriesRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let categories = snapshot.val();
        let arr = [];
        for (let key in categories) {
          arr.push({
            id: key,
            name: categories[key]?.name || "Unnamed Category",
          });
        }
        arr.sort((a, b) => a.name.localeCompare(b.name));
        let count = 0;
        arr.forEach((category) => {
          let row = document.createElement("tr");
          count++;
          row.innerHTML = `
            <td>${count}</td>
            <td>${category.name}</td>
            <td>
              <button onclick="editCategory('${category.id}')" class="update-btn">Edit</button>
              <button onclick="deleteCategory('${category.id}')" class="delete-btn">Delete</button>
            </td>
          `;
          categoryTableBody.appendChild(row);
        });
      } else {
        let row = document.createElement("tr");
        row.innerHTML = `<td style="text-align:center;font-size:20px" colspan="3">No Categories Found</td>`;
        categoryTableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching categories:", error);
    });
}

window.onload = function () {
  getCategories();
};

/* LAPTOPS */

async function toUploadImage(productImg) {
  const errorElement = productImg.nextElementSibling;
  errorElement.textContent = "";
  if (!productImg || !productImg.files || productImg.files.length === 0) {
    errorElement.textContent = "Please select an image file to upload.";
    return null;
  }
  try {
    const file = productImg.files[0];
    const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validFileTypes.includes(file.type)) {
      errorElement.textContent =
        "Invalid file type. Please upload an image (JPG, PNG, GIF).";
      return null;
    }

    const sanitizedFileName = file.name.replace(/[^\w.-]/g, "_"); // Sanitize the file name
    const storageRef = imageRef(storage, "images/" + sanitizedFileName);
    const uploadTask = uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL((await uploadTask).ref);
    return downloadURL;
  } catch (error) {
    errorElement.textContent = `Failed to upload image. Please try again. Error: ${error.message}`;
    console.error("Image upload error:", error);
    return null;
  }
}

window.deleteProduct = function (id) {
  const db = getDatabase();
  const productRef = ref(db, "products/" + id);

  get(productRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        remove(productRef)
          .then(async () => {
            let Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Deleted Successfully",
            });
            await renderTable();
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            Swal.fire({
              title: "Error!",
              text: `There was an error deleting the product: ${error.message}`,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          title: "Product Not Found",
          text: "The product you are trying to delete does not exist.",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      Swal.fire({
        title: "Error!",
        text: `There was an error retrieving the product data: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
};

let category1 = document.getElementById("category");
let arr = [];
const categoryList = ref(db, "categories/");

onValue(categoryList, async (snapshot) => {
  let data = await snapshot.val();

  for (let key in data) {
    arr.push(data[key].name);
  }
  arr.sort().forEach(function (el) {
    category1.innerHTML += `<option value="${el}">${el}</option>`;
  });
});

document.getElementById("category").addEventListener("change", function () {
  const brandSelect = document.getElementById("brand");
  const selectedCategory = this.value;

  const brands = {
    Headphones: ["Audio", "Bose", "JBL", "Sony"],
    Laptops: ["Acer", "Asus", "Dell", "Lenovo", "MacBook", "MSI"],
    Mobiles: ["Apple", "Huawei", "Oppo", "Realme", "Samsung"],
    Monitors: ["Asus", "Dell", "LG", "Samsung", "Tornado"],
    Smartwatches: ["Apple", "Huawei", "Realme", "Samsung"],
  };

  brandSelect.innerHTML =
    '<option value="" disabled selected>Select The Brand</option>';
  // Populate the new options
  if (brands[selectedCategory]) {
    brands[selectedCategory].forEach((brand) => {
      const option = document.createElement("option");
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });
  }
});

async function writeUserData(
  imgSrc,
  proname,
  color,
  brand,
  category,
  price,
  quantity,
  description
) {
  const db = getDatabase();
  const id = Date.now(); // Unique ID based on timestamp

  try {
    await set(ref(db, "products/" + id), {
      id: id,
      image: imgSrc,
      name: proname,
      color: color,
      brand: brand,
      category: category,
      price: price,
      quantity: quantity,
      description: description,
    });

    let Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: "success",
      title: "Product added successfully!",
    });
    await renderTable();
  } catch (error) {
    console.error("Error adding product:", error);

    Swal.fire({
      title: "Error!",
      text: `There was an error adding the product: ${error.message}`,
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
}

const links = document.querySelectorAll(".sidebar a");
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function (e) {
    for (let j = 0; j < links.length; j++) {
      links[j].classList.remove("active");
    }
    links[i].classList.add("active");
  });
}

var prodForm = document.getElementById("product-form");
let add = document.getElementById("add");
let errorMessage = document.getElementsByClassName("error");

add.addEventListener("click", async (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll(
    "#product-form input, #product-form select"
  );
  const productImg = document.getElementById("productImage");
  const proname = document.getElementById("name").value.trim();
  const color = document.getElementById("color").value.trim();
  const brand = document.getElementById("brand").value;
  const category = document.getElementById("category").value;
  const price = parseFloat(document.getElementById("price").value);
  const quantity = parseInt(document.getElementById("quantity").value);
  const description = document.getElementById("description").value.trim();
  let isValid = true;

  inputs.forEach((input) => {
    const errorDiv = input.nextElementSibling;

    input.addEventListener("input", () => {
      errorDiv.style.display = "none";
      input.classList.remove("error-input");
    });

    if (
      input.value.trim() === "" ||
      (input.type === "select-one" && input.value === "")
    ) {
      errorDiv.textContent = "This field is required.";
      errorDiv.style.display = "block";
      input.classList.add("error-input");
      isValid = false;
    }
  });

  const priceInput = document.getElementById("price");
  const priceError = document.getElementById("priceError");
  priceInput.addEventListener("input", () => {
    if (parseFloat(priceInput.value) <= 0) {
      priceError.textContent = "Price must be more than zero.";
      priceError.style.display = "block";
      priceInput.classList.add("error-input");
    } else {
      priceError.style.display = "none";
      priceInput.classList.remove("error-input");
    }
  });

  const quantityInput = document.getElementById("quantity");
  const quantityError = document.getElementById("quantityError");
  quantityInput.addEventListener("input", () => {
    if (parseInt(quantityInput.value) <= 0) {
      quantityError.textContent = "Quantity must be more than zero.";
      quantityError.style.display = "block";
      quantityInput.classList.add("error-input");
    } else {
      quantityError.style.display = "none";
      quantityInput.classList.remove("error-input");
    }
  });

  const imageError = document.getElementById("imageError");
  const imgSrc = await toUploadImage(productImg);
  if (!imgSrc) {
    imageError.textContent = "Upload an appropriate image for your product.";
    imageError.style.display = "block";
    productImg.classList.add("error-input");
    return;
  } else {
    imageError.style.display = "none";
    productImg.classList.remove("error-input");
  }

  if (!isValid) {
    return;
  }
  await writeUserData(
    imgSrc,
    proname,
    color,
    brand,
    category,
    price,
    quantity,
    description
  );

  document.getElementById("product-form").reset();
});

const productsData = ref(db, "products");
const tbody = document.querySelector("#tbody");

async function getData() {
  return new Promise((resolve, reject) => {
    onValue(productsData, (snapshot) => {
      const productsBacked = snapshot.val();
      if (!productsBacked) {
        reject("No data found at this path.");
      } else {
        resolve(productsBacked);
      }
    });
  });
}

async function renderTable() {
  try {
    const productsBacked = await getData();
    let count = 0;
    tbody.innerHTML = "";
    for (let key in productsBacked) {
      count++;
      tbody.innerHTML += `
        <tr>
          <td>${count}</td>
          <td class="image-cell">
            <img class="previewImage" src="${productsBacked[key].image}" alt="Product Image" />
          </td>
          <td>${productsBacked[key].name}</td>
          <td>${productsBacked[key].color}</td>
          <td>${productsBacked[key].brand}</td>
          <td>${productsBacked[key].category}</td>
          <td>${productsBacked[key].price} EGP</td>
          <td>${productsBacked[key].quantity}</td>
          <td><button onclick="updateProFun('${productsBacked[key].id}')" class="update-btn">Update</button></td>
          <td><button onclick="deleteProduct('${productsBacked[key].id}')" class="delete-btn">Delete</button></td>
        </tr>
      `;
    }
  } catch (error) {
    console.error(error);
    tbody.innerHTML = "<tr><td colspan='10'>Error loading products.</td></tr>";
  }
}
renderTable();

let productId;

let test = await getData();

window.updateProFun = (id) => {
  if (test.length === 0) {
    console.error("Product data is not available yet.");
    return;
  }

  // Smoothly scroll to the top (if that's your intention)
  window.scrollTo({ top: 0, behavior: "smooth" });

  document
    .getElementById("product-form")
    .scrollIntoView({ behavior: "smooth" });

  document.getElementById("add").style.display = "none";
  document.getElementById("update").style.display = "block";

  document.getElementById("productImage").setAttribute("disabled", "true");

  document.getElementById("name").value = test[id].name;
  document.getElementById("color").value = test[id].color;
  document.getElementById("category").value = test[id].category;
  document.getElementById("brand").value = test[id].brand;
  document.getElementById("price").value = test[id].price;
  document.getElementById("quantity").value = test[id].quantity;
  document.getElementById("description").value = test[id].description;

  productId = id;
};

let updateBtn = document.getElementById("update");

updateBtn.addEventListener("click", () => {
  document.getElementById("productImage").removeAttribute("disabled", "false");
  document.getElementById("add").style.display = "block";
  document.getElementById("update").style.display = "none";

  update(ref(db, "products/" + productId), {
    img: document.getElementById("productImage"),
    name: document.getElementById("name").value,
    color: document.getElementById("color").value,
    category: document.getElementById("category").value,
    brand: document.getElementById("brand").value,
    price: parseFloat(document.getElementById("price").value),
    quantity: parseInt(document.getElementById("quantity").value),
    description: document.getElementById("description").value,
  })
    .then(() => {
      console.log("Product updated successfully!");
      let Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "Updated Successfully",
      });
      renderTable();
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error updating the product: " + error.message,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    });

  prodForm.reset();
});

/* USERS */

let usersRef = ref(db, "users/");
get(usersRef).then((snapshot) => {
  let data = snapshot.val();
  printData(data);
});

function printData(data) {
  let count = 0;
  let tbody = document.getElementById("tUsersBody");
  let box = "";

  for (let key in data) {
    const { firstName, lastName, email, role = "user" } = data[key];
    box += `
      <tr>
          <td>${++count}</td>
          <td>${firstName}</td>
          <td>${lastName}</td>
          <td>${email}</td>
          <td>
            <select data-current-role="${role}"
                    onchange="changeRole(event,'${key}')"
                    aria-label="Change role for ${firstName} ${lastName}">
                <option value="user" ${
                  role === "user" ? "selected" : ""
                }>User</option>
                <option value="admin" ${
                  role === "admin" ? "selected" : ""
                }>Admin</option>
            </select>
          </td>
      </tr>
    `;
  }
  tbody.innerHTML = box;
}

window.changeRole = async (e, id) => {
  e.preventDefault();
  console.log(id);

  let newRole = e.target.value;
  let currentRole = e.target.getAttribute("data-current-role");

  if (newRole === currentRole) {
    console.log("No change in role detected.");
    return;
  }

  let userConfirmed = await sweetAlertUsers();
  console.log(userConfirmed);

  if (userConfirmed) {
    update(ref(db, "users/" + id), { role: newRole })
      .then(() => {
        console.log("Role updated successfully.");
        Swal.fire({
          title: "Role updated successfully!",
          icon: "success",
        });
        e.target.setAttribute("data-current-role", newRole);
      })
      .catch((error) => {
        console.error("Error updating role:", error);
        Swal.fire({
          title: "Error updating role",
          text: error.message || "An error occurred.",
          icon: "error",
        });
        e.target.value = currentRole;
      });
  } else {
    e.target.value = currentRole;
  }
};

async function sweetAlertUsers() {
  const result = await Swal.fire({
    title: "Are you sure you want to change the role for this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
  });

  return result.isConfirmed;
}

/* COUPONS */

let couponName = document.getElementById("couponName");
let coupIdError = document.getElementById("coupIdError");
let couponDate = document.getElementById("couponDate");
let coupDateError = document.getElementById("coupDateError");
let coupForm = document.getElementById("coupon-form");

couponName.addEventListener("focus", () => {
  couponName.style.border = "solid 1px #007bff";
  coupIdError.style.display = "none";
});

couponName.addEventListener("blur", () => {
  couponValidation();
});

function couponValidation() {
  couponName.style.border = "";

  if (couponName.value.length !== 8 && couponName.value !== "") {
    coupIdError.style.display = "inline";
    return false;
  } else {
    coupIdError.style.display = "none";
    return true;
  }
}

coupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!couponValidation()) {
    return;
  }
  if (!couponDate.value) {
    coupDateError.innerText = "Date is required.";
    coupDateError.style.display = "block";
    return;
  } else {
    coupDateError.style.display = "none";
  }

  let couponNameValue = couponName.value.trim();
  let couponDateValue = couponDate.value.trim();

  if (couponNameValue && couponDateValue) {
    await writeCouponData(couponNameValue, couponDateValue);
    coupForm.reset();
  } else {
    if (!couponNameValue) {
      coupIdError.style.display = "inline";
    }
    if (!couponDateValue) {
      coupDateError.innerText = "Date is required.";
      coupDateError.style.display = "block";
    }
  }
});

window.deleteCoupon = function (couponId) {
  let couponRef = ref(db, `coupons/${couponId}`);

  get(couponRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        remove(couponRef)
          .then(async () => {
            let Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
            Toast.fire({
              icon: "success",
              title: "Deleted Successfully",
            });
            getCoupons();
          })
          .catch((error) => {
            console.error("Error deleting coupon:", error);
            Swal.fire({
              title: "Error!",
              text: `There was an error deleting the coupon: ${error.message}`,
              icon: "error",
              confirmButtonText: "Try Again",
            });
          });
      } else {
        Swal.fire({
          icon: "info",
          title: "Coupon Not Found",
          text: "The coupon you are trying to delete does not exist.",
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching coupon data:", error);
      Swal.fire({
        title: "Error!",
        text: `There was an error retrieving the coupon data: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
};

async function writeCouponData(couponName, couponDate) {
  if (couponName.length !== 8) {
    document.getElementById("coupIdError").style.display = "block";
    return;
  } else {
    document.getElementById("coupIdError").style.display = "none";
  }

  const currentDate = new Date();
  const expirationDate = new Date(couponDate);
  currentDate.setHours(0, 0, 0, 0);
  expirationDate.setHours(0, 0, 0, 0);

  if (expirationDate < currentDate) {
    document.getElementById("coupDateError").innerText =
      "Expiration date cannot be in the past.";
    document.getElementById("coupDateError").style.display = "block";
    return;
  } else {
    document.getElementById("coupDateError").style.display = "none";
  }

  try {
    let couponsRef = ref(db, "coupons/");
    const snapshot = await get(couponsRef);

    if (snapshot.exists()) {
      let coupons = snapshot.val();
      let isDuplicated = Object.values(coupons).some(
        (coupon) => coupon.name.toLowerCase() === couponName.toLowerCase()
      );
      if (isDuplicated) {
        Swal.fire({
          title: "Duplicate Coupon!",
          text: `"${couponName}" already exists.`,
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    }
    const id = Date.now();
    await set(ref(db, "coupons/" + id), {
      id: id,
      name: couponName,
      date: couponDate,
    });

    Swal.fire({
      icon: "success",
      title: "Coupon added successfully!",
      showConfirmButton: false,
      timer: 1500,
    });
    getCoupons();
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: `There was an error adding the coupon: ${error.message}`,
      icon: "error",
      confirmButtonText: "Try Again",
    });
  }
}

function getCoupons() {
  const couponTableBody = document.querySelector("#tCouponsBody");

  if (!couponTableBody) {
    console.error("Coupon table body not found!");
    return;
  }

  let couponsRef = ref(db, "coupons/");
  couponTableBody.innerHTML = "";

  get(couponsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        let coupons = snapshot.val();
        console.log("Fetched coupons:", coupons);
        let count = 0;

        Object.keys(coupons).forEach((key) => {
          count++;
          const coupon = coupons[key];
          let row = document.createElement("tr");

          row.innerHTML = `
            <td>${count}</td>
            <td>${coupon.name}</td>
            <td>${coupon.date}</td>
            <td>
              <button onclick="deleteCoupon('${key}')" class="delete-btn">Delete</button>
            </td>
          `;

          couponTableBody.appendChild(row);
        });
      } else {
        let row = document.createElement("tr");
        row.innerHTML = `<td colspan="4" style="text-align:center;font-size:20px">No Coupons Found</td>`;
        couponTableBody.appendChild(row);
      }
    })
    .catch((error) => {
      console.error("Error fetching coupons:", error);
      Swal.fire({
        title: "Error!",
        text: `Unable to fetch coupons: ${error.message}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    });
}

getCoupons();

/* ORDERS */

let ordersRef = ref(db, "finalOrders/");
get(ordersRef)
  .then((snapshot) => {
    let data = snapshot.val();

    if (data) {
      display(data); 
    } else {
      console.log("No orders found or data is undefined");
      document.getElementById("tOrdersBody").innerHTML =
        "<tr><td colspan='7' style='text-align: center;'>No orders found.</td></tr>";
    }
  })
  .catch((error) => {
    console.error("Error fetching orders:", error);
  });

function display(data) {
  let tbody = document.getElementById("tOrdersBody");
  let categoriesSection = document.querySelector(".categoriesSection");
  let count = 0;
  let box = "";
  console.log(data);
  
  if(data){
    for (let key in data) {
      const order = data[key];
      
  
      for(let item in order){
        console.log(order[item]);
  
        let productList = order[item].products
        .map((product) => `
          <div class="itemo">
            <div>
              <img src="${product.image}"/>
            </div>
            <div class="first">
                <div>
              <h4>${product.name}</h4>
              <section>
                <strong>Total: ${order[item].finalTotalToReceive}</strong>
              </section>
              <section>
                <strong>Shipping: ${order[item].finalShippingToReceive}</strong>
              </section>
              <section>
                <strong>Order Date: ${order[item].orderDate}</strong>
              </section>
            </div>
            
            
            </div>
          </div>
        `)
        .join(""); 
  
        box += `
            <div class="orderBorder">
              <div class="orderTitle">
                    <article>
                      <span>
                        Order Id:
                      </span>
                      <h4>${item}</h4>
                  </article>

                  <article>
                      <span>
                        Username:
                      </span>
                      <h4>${order[item].firstName}</h4>
                  </article>

                  <article>
                      <span>
                        User email:
                      </span>
                      <h4>${order[item].email}</h4>
                  </article>

                  <article>
                      <span>
                        Address:
                      </span>
                      <h4>${order[item].town}</h4>
                  </article>
                  <article>
                      <span>
                        Total:
                      </span>
                      <h4>${order[item].finalTotalToReceive}</h4>
                  </article>
                  <select data-current-status="${order[item].orderStatus}" onchange="changeStatus(event, '${key}' ,'${item}')">
                    <option value="pending" ${
                      order[item].orderStatus === "pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="approved" ${
                      order[item].orderStatus === "approved" ? "selected" : ""
                    }>Approved</option>
                    <option value="declined" ${
                      order[item].orderStatus === "declined" ? "selected" : ""
                    }>Declined</option>
                  </select>
              </div>
              
              
              <div class="d-flexa">${productList}</div>

            </div>`;
        }
      
      categoriesSection.innerHTML = box;
  
    }
  }else{
    categoriesSection.innerHTML = "<h2 style='text-align: center'>No orders found.</h2>"
  }
  

}

window.changeStatus = async (e,usrId , orderId) => {
  const newStatus = e.target.value;
  console.log(orderId);
  
  const orderRef = ref(db, `finalOrders/${usrId}/${orderId}`);
  update(orderRef, { orderStatus: newStatus })
    .then(() => {
      sweetOrder()
    })
    .catch((error) => {
      console.error("Error updating status:", error);
    });
};

async function sweetAlertOrders() {
  const result = await Swal.fire({
    title: "Are you sure you want to change the status for this user?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
  });

  return result.isConfirmed;
}


function sweetOrder() {
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
    title: "order status changed successfully",
  });
}

window.onload = () => {
  get(ordersRef)
    .then((snapshot) => {
      let data = snapshot.val();

      if (data) {
        display(data);
      } else {
        console.log("No orders found or data is undefined");
        document.getElementById("tOrdersBody").innerHTML =
          "<tr><td colspan='7' style='text-align: center;'>No orders found.</td></tr>";
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
    });
};
