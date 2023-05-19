"use strict";

// ============== global variables ============== //
const endpoint = "https://forms-rest-crud-c1ca6-default-rtdb.firebaseio.com/";
let posts;

// ============== load and init app ============== //

window.addEventListener("load", initApp);

function initApp() {
  updatePostsGrid(); // update the grid of posts: get and show all posts
  //updateUserGrid();
  // event listener
  document
    .querySelector("#btn-create-post")
    .addEventListener("click", showCreatePostDialog);
  document
    .querySelector("#form-create-post")
    .addEventListener("submit", createPostClicked);
  document
    .querySelector("#form-update-post")
    .addEventListener("submit", updatePostClicked);
  document
    .querySelector("#form-delete-post")
    .addEventListener("submit", deletePostClicked);
  document
    .querySelector("#form-delete-post .btn-cancel")
    .addEventListener("click", deleteCancelClicked);
  document
    .querySelector("#select-sort-by")
    .addEventListener("change", sortByChanged);
  document
    .querySelector("#input-search")
    .addEventListener("keyup", inputSearchChanged);
  document
    .querySelector("#input-search")
    .addEventListener("search", inputSearchChanged);
}

// ============== events ============== //

function showCreatePostDialog() {
  console.log("Create New Post clicked!");
  document.querySelector("#dialog-create-post").showModal();
}

async function createPostClicked(event) {
  event.preventDefault();

  const form = event.target;

  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.value;
  const response = await createPost(title, body, image);

  if (response.ok) {
    console.log("New post succesfully added to Firebase 🔥");
    form.reset(); // reset the form (clears inputs)
    updatePostsGrid();
    event.target.parentNode.close(); // the dialog
    hideErrorMessage();
  } else {
    showErrorMessage("Something went wrong. Please, try again!");
  }
}

function updatePostClicked(event) {
  const form = event.target; // or "this"
  // extract the values from inputs in the form
  const title = form.title.value;
  const body = form.body.value;
  const image = form.image.value;
  // get id of the post to update - saved in data-id
  const id = form.getAttribute("data-id");
  updatePost(id, title, body, image); // call updatePost with arguments
}

function deletePostClicked(event) {
  const id = event.target.getAttribute("data-id"); // event.target is the delete form
  deletePost(id); // call deletePost with id
}

function deleteCancelClicked() {
  document.querySelector("#dialog-delete-post").close(); // close dialog
}

function sortByChanged(event) {
  const selectedValue = event.target.value;

  if (selectedValue === "title") {
    posts.sort(compareTitle);
  } else if (selectedValue === "body") {
    posts.sort(compareBody);
  }

  showPosts(posts);
}

function inputSearchChanged(event) {
  const value = event.target.value;
  const postsToShow = searchPosts(value);
  showPosts(postsToShow);
}
// todo

// ============== posts ============== //

async function updatePostsGrid() {
  posts = await getPosts(); // get posts from rest endpoint and save in global variable
  showPosts(posts); // show all posts (append to the DOM) with posts as argument
}

// Get all posts - HTTP Method: GET
function prepareData(data) {
  return Object.values(data);
}

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`);
  const data = await response.json();
  const posts = prepareData(data);
  return posts;
}

function showPosts(listOfPosts) {
  document.querySelector("#posts").innerHTML = ""; // reset the content of section#posts

  for (const post of listOfPosts) {
    showPost(post); // for every post object in listOfPosts, call showPost
  }
}

function showPost(post) {
  console.log(post);

  const mypost = /* html */ `
    <article class="grid-item">
        <h2>${post.title}</h2>
        <img src="${post.image}" alt=""/>
        <p>Tryk for mere info: ${post.info}</p>
      
    </article>
  `;

  document.querySelector("#posts").insertAdjacentHTML("beforeend", mypost);
  document
    .querySelector("#posts article:last-child")
    .addEventListener("click", postClicked);

  function postClicked() {
    console.log("______________________________________");

    document.querySelector("#detail-image").src = post.image;
    document.querySelector("#detail-name").textContent = post.title;
    document.querySelector("#detail-info").textContent = post.body;
    document.querySelector("#detail-description").textContent =
      post.description;

    //document.querySelector("#dialog-posts").showModal();
  }
}
