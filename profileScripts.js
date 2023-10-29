
const getCurrentUserId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
};

console.log(getCurrentUserId());

const getUser = () => {

  const id = getCurrentUserId();

  axios.get(`${ baseUrl }/users/${ id }`)
    .then((response) => {
      const user = response.data.data;
      document.getElementById("main-info-email").innerHTML = user.email;
      document.getElementById("main-info-name").innerHTML = user.name;
      document.getElementById("main-info-username").innerHTML = user.username;
      document.getElementById("main-info-image").src = user.profile_image;
      document.getElementById("name-posts").innerHTML = `${ user.username }'s`;


      // posts & comments count
      document.getElementById("posts-count").innerHTML = user.posts_count;
      document.getElementById("comments-count").innerHTML = user.comments_count;

    });
};

const getUserPosts = () => {
  const id = getCurrentUserId();

  axios.get(`${ baseUrl }/users/${ id }/posts`)
    .then((response) => {
      const posts = response.data.data;
      document.getElementById("user-posts").innerHTML = "";

      for (post of posts) {

        const author = post.author;
        let postTitle = "";

        // show or hide (edit) button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = ``;

        if (isMyPost) {
          editBtnContent =
            `
            <button
            class="btn btn-outline-secondary"
            onclick="editPostBtn('${ encodeURIComponent(JSON.stringify(post)) }')"
          >Edite</button>

          <button class='btn btn-outline-danger' ' onclick="deletePostBtn('${ encodeURIComponent(JSON.stringify(post)) }')">delete</button>
                `;
        }

        if (post.title != null) {
          postTitle = post.title;
        }
        let content = `
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

        document.getElementById("user-posts").innerHTML += content;

        const currentPostTagsId = `post-tags-${ post.id }`;
        document.getElementById(currentPostTagsId).innerHTML = "";

        for (tag of post.tags) {
          console.log(tag.name);
          let tagsContent =
            `
                    <button class="btn btn-sm rounded-5" style="background-color: gray; color: white">
                            ${ tag.name }
                    </button>
                `;
          document.getElementById(currentPostTagsId).innerHTML += tagsContent;
        }
      }
    });

};


getUser();
getUserPosts();