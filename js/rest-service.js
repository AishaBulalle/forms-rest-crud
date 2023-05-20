import { prepareData } from "./helperss.js";

const endpoint = "https://forms-rest-crud-c1ca6-default-rtdb.firebaseio.com/";

async function getPosts() {
  const response = await fetch(`${endpoint}/posts.json`); // fetch request, (GET)
  const data = await response.json(); // parse JSON to JavaScript
  const posts = prepareData(data); // convert object of object to array of objects
  return posts; // return posts
}

async function createPost(title, body, image) {
  event.preventDefault();
  const newPost = { title, body, image, uid: "fTs84KRoYw5pRZEWCq2Z" }; // create new post object
  const json = JSON.stringify(newPost); // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  const response = await fetch(`${endpoint}/posts.json`, {
    method: "POST",
    body: json,
  });
  return response;

  // check if response is ok - if the response is successful

  /*
  const url = document.querySelector("#image");

  image.addEventListener("input", (event) => {
    if (url.validity.typeMismatch) {
      url.setCustomValidity("Please input url image");
    } else {
      url.setCustomValidity("");
    }
  });*/
}

async function updatePost(id, title, body, image) {
  const postToUpdate = { title, body, image };
  const json = JSON.stringify(postToUpdate);

  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("Post succesfully updated in Firebase 🔥");
    updatePostsGrid(); // update the post grid to display all posts and the new post
  }
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/posts/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    console.log("New post succesfully deleted from Firebase 🔥");
    updatePostsGrid(); // update the post grid to display all posts and the new post
  }
}

async function getUser(id) {
  const response = await fetch(`${endpoint}/users/${id}.json`);
  const user = await response.json();
  return user;
}

export { getPosts, createPost, updatePost, deletePost, getUser, endpoint };
