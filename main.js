// const { default: axios } = require("axios");
// import axios from "axios";

const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage;

// infinite scroll
window.addEventListener("scroll", () => {
  const endOfBage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;

  if (endOfBage && currentPage < lastPage) {
    currentPage += 1;
    getPosts(currentPage);
  }
});

const userClicked = (userId) => {
  window.location = `profile.html?userid=${ userId }`;
};

const profileClicked = () => {
  const user = getCurrentUser();
  const userId = user.id;
  window.location = `profile.html?userid=${ userId }`;
};

// loader
const loaderFunc = (isLodare) => {
  if (!isLodare) {
    document.getElementById("loader").style.display = "none";
  } else {
    document.getElementById("loader").style.display = "bluck";
  }

};


// posts
const PostsDiv = document.getElementById("posts");
const getPosts = (page = 1) => {
  loaderFunc(true);
  axios.get(`${ baseUrl }/posts?limit=3&page=${ page }`)
    .then((response) => {
      const posts = response.data.data;
      loaderFunc(false);
      lastPage = response.data.meta.last_page;
      for (const post of posts) {

        // show or hide (edit) button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent = `<button
            class="btn btn-outline-secondary"
            onclick="editPostBtn('${ encodeURIComponent(JSON.stringify(post)) }')"
          >Edite</button>

          <button class='btn btn-outline-danger' ' onclick="deletePostBtn('${ encodeURIComponent(JSON.stringify(post)) }')">delete</button>
          
          `;

        }
        let contant = `
        <div class="card shadow-lg my-4" >
        <div class="card-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center " onclick="userClicked(${ post.author.id })" style="cursor: pointer;">
            <img
              src="${ post.author.profile_image }"
              alt="avt-1"
              class="rounded-circle border border-2"
              width="35px"
              height="35px"
            >
            <h5 class="mx-2">@${ post.author.name }</h5>
          </div>

          <div>
          ${ editBtnContent }
          </div>

          
        </div>
        <div class="card-body" onclick="postclicked(${ post.id })" style="cursor: pointer;">
          <img
            src=${ post.image }
            alt=""
            class="w-100"
          >
          <span style="color: #888;">${ post.created_at }</span>
          <h4>${ post.title }</h4>
          <p class="col-lg-10">${ post.body }</p>
          <hr>
          <div id="comments">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path
                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
              />
            </svg>
            <span>(${ post.comments_count }) comments
              <span id="post-tags-${ post.id }">
                
              </span>
            </span>
          </div>
        </div>
      </div>
      `;

        PostsDiv.innerHTML += contant;

        let currentPostTagsId = `post-tags-${ post.id }`;
        document.getElementById(currentPostTagsId).innerHTML = "";
        for (let tag of post.tags) {
          console.log(tag.name);
          let tagesContent =
            `<button class="btn btn-sm btn-secondary rounded-5">
            ${ tag.name }
          </button>`;
          document.getElementById(currentPostTagsId).innerHTML += tagesContent;
        }
      }
    });
};

if (PostsDiv != null) {
  getPosts();
}

const postclicked = (postId) => {
  window.location = `postDetails.html?postId=${ postId }`;
  // console.log(postId);
};

// get Current User Info
const getCurrentUser = () => {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
};

// Login function
const logInBtnClick = () => {
  const userName = document.getElementById("username-input").value;
  const passowrd = document.getElementById("passowrd-input").value;

  const params = {
    "username": userName,
    "password": passowrd
  };

  loaderFunc(true);
  axios.post(`${ baseUrl }/login`, params)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      loaderFunc(false);
      // close Login Modal
      const loginModal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(loginModal);
      modalInstance.hide();

      showAlert("Log In Successfuly ", 'success');
      setupUI();
    });

};

// signup function
const signupBtnClick = () => {
  const userName = document.getElementById("signup-username-input").value;
  const passowrd = document.getElementById("signup-passowrd-input").value;
  const email = document.getElementById("signup-email-input").value;
  const name = document.getElementById("signup-name-input").value;
  const profileImage = document.getElementById("profile-image-input").files[ 0 ];

  let formData = new FormData();

  formData.append("username", userName);
  formData.append("password", passowrd);
  formData.append("email", email);
  formData.append("name", name);
  formData.append("image", profileImage);

  // const params = {
  //   "username": userName,
  //   "password": passowrd,
  //   "email": email,
  //   "name": name
  // };

  loaderFunc(true);

  axios.post(`${ baseUrl }/register`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      loaderFunc(false);
      // close Modal
      const signupModal = document.getElementById("signup-modal");
      const modalInstance = bootstrap.Modal.getInstance(signupModal);
      modalInstance.hide();

      showAlert("Sign up Successfuly ", 'success');
      setupUI();
    }).catch((error) => {
      const message = error.response.data.message;

      showAlert(message, 'danger');
    });
};

// logout function
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Log Out Successfuly ", 'success');
  setupUI();
};

// Create New Post function
const createNewPost = () => {

  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";


  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[ 0 ];

  let formData = new FormData();

  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);

  const token = localStorage.getItem("token");
  let url = ``;
  if (isCreate) {
    url = `${ baseUrl }/posts`;

  } else {
    formData.append("_method", "put");
    url = `${ baseUrl }/posts/${ postId }`;
  }

  loaderFunc(true);
  axios.post(url, formData, {
    headers: {
      "authorization": `Bearer ${ token }`,
      "Content-Type": "multipart/form-data",
    }
  }).then((response) => {
    console.log("success");

    console.log(response.data);
    // close Modal
    const creatPostModal = document.getElementById("creat-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(creatPostModal);
    modalInstance.hide();
    showAlert("New Post Has Been Created", "success");
    getPosts();
    loaderFunc(false);
    window.location.reload();
    console.log("finall");
  })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, 'danger');
    });

};




const showAlert = (custumMessage, type) => {

  const successAlert = document.getElementById('success-alert');
  // successAlert.style.display = "block";
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
      `<div class="alert alert-${ type } alert-dismissible" role="alert">`,
      `   <div>${ message }</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('');

    successAlert.append(wrapper);
  };
  appendAlert(custumMessage, type);

  const alert = bootstrap.Alert.getOrCreateInstance('#success-alert');
  setTimeout(() => {
    successAlert.innerHTML = "";
  }, 3000);

};


const setupUI = () => {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  const logoutProfileDiv = document.getElementById("logout-profile-div");
  const addBtn = document.getElementById("add-btn");
  if (token == null) {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutProfileDiv.style.display = "none";

    if (addBtn != null) {
      addBtn.style.display = "none";
    }
  } else {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutProfileDiv.style.display = "flex";

    if (addBtn != null) {
      addBtn.style.display = "flex";
    }
    let userName = getCurrentUser().username;
    let profile_image = getCurrentUser().profile_image;
    document.getElementById("username-header").innerHTML = userName;
    document.getElementById("profile-img").setAttribute("src", profile_image);
  }
};
setupUI();

// Edit Post
const editPostBtn = (postObject) => {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("create-post-model").innerHTML = "Edit Post";
  let postModal = new bootstrap.Modal(document.getElementById("creat-post-modal"), {});
  postModal.toggle();
};


const addBtnClicked = () => {
  document.getElementById("post-modal-submit-btn").innerHTML = "Add";
  document.getElementById("post-id-input").value = "";
  document.getElementById("create-post-model").innerHTML = "Add A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(document.getElementById("creat-post-modal"), {});
  postModal.toggle();
};

const deletePostBtn = (postObject) => {

  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {});
  postModal.toggle();

};

const confirmPostDelete = () => {
  const token = localStorage.getItem("token");
  const postId = document.getElementById("delete-post-id-input").value;
  const url = `${ baseUrl }/posts/${ postId }`;
  const headers = {
    "Content-Type": "multipart/form-data",
    "authorization": `Bearer ${ token }`
  };


  axios.delete(url, {
    headers: headers
  })
    .then((response) => {
      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post Has Been Deleted Successfully", "success");
      getPosts();
      window.location.reload();
    }).catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}


