/*
IFS L1T20 – Capstone Project IV: : JavaScript Fundamentals

I have consulted the following websites for guidance:
closest() method –
https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
https://stackoverflow.com/questions/19497720/how-to-use-this-closest-in-jquery
Passing data between pages in JavaScript –
https://code-boxx.com/pass-variables-between-pages-javascript/
jQuery not() method –
https://www.w3schools.com/jquery/sel_not.asp
window.scrollTo() method – 
https://css-tricks.com/need-to-scroll-to-the-top-of-the-page/
array.some() method –
https://stackoverflow.com/questions/12462318/find-a-value-in-an-array-of-objects-in-javascript
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
Adding elements with jQuery – 
https://www.w3schools.com/jquery/jquery_dom_add.asp
Using if... in... with sessionStorage –
https://stackoverflow.com/questions/16010827/html5-localstorage-checking-if-a-key-exists
jQuery animate() method –
https://www.w3schools.com/jquery/jquery_animate.asp

*/

// Creates an empty array in which to store saved blog post objects.
let savedPosts = [];

/*
  Function loads sessionStorage contents to "savedPosts" array.
  It is called each time a page loads.
  
  Question for mentor: why doesn't array.some() work (chcck "Save for Later"
  jQuery function below) if I don't actually initialize the empty array again
  inside this function?
*/
function loadSessionStorage() {
  if (JSON.parse(sessionStorage.getItem("savedItems")) === null) {
    // Initialise "savedPosts" on first load.
    savedPosts = [];
  } else {
    // Populates "savedPosts" from sessionStorage on subsequent loads.
    savedPosts = JSON.parse(sessionStorage.getItem("savedItems"));
  }
  // Checks if there is a saved post item in sessionStorage waiting to be loaded
  // into full view (called from "saved.html"), and if so, sends it to full view
  // function.
  if ("id" in sessionStorage) {
    let id = sessionStorage.getItem("id");
    // Removes "id" key from sessionStorage before sending its value to full
    // view function.
    sessionStorage.removeItem("id");
    loadFullView(id);
  }
}

// jQuery function displays dropdown menu on click, and hides it on
// "mouseleave" event.
$(".menu").click(function () {
  $(this).css("color", "black");
  $(".menu-dropdown").slideDown();
});
$(".menu").mouseleave(function () {
  $(".menu-dropdown").slideUp();
});

// jQuery function retrieves ID of article linked to clicked button and sends
// it to function that loads full view mode (called from "blog.html").
$("button:contains('Read More')").click(function () {
  let post = this.closest("article");
  let postID = post.id;
  loadFullView(postID);
});

// Function displays blog post in full view mode.
function loadFullView(postID) {
  let post = document.getElementById(postID);
  // Removes class that hides text in current post.
  let hiddenText = document.querySelector("#" + postID + " .hidden-text");
  hiddenText.classList.remove("hidden-text");
  // Hides all elements on page other than the current post.
  $("article, footer, img, .fixed-header").not(post).hide();
  // Hides image, date and buttons from current post
  let postDate = document.querySelector("#" + postID + " .post-date");
  $(postDate).hide();
  let postImage = document.querySelector("#" + postID + " .post-image");
  $(postImage).hide();
  let postButtons = document.querySelector("#" + postID + " .post-buttons");
  $(postButtons).hide();
  // Displays comment box.
  $(".hidden-comment").css("display", "flex");
  // Adds class to post that styles it to fill screen.
  $(post).addClass("fullpost");
  // Adds class to post that displays "Close" link.
  $("#close-post").show();
  // Scrolls to top of viewport
  window.scrollTo(0, 0);
}

// Constructor function for blog post objects.
function BlogObject(id, title, date, image, text) {
  this.id = id;
  this.title = title;
  this.date = date;
  this.image = image;
  this.text = text;
}

// Function adds post to "savedPosts" array when user clicks "Save for later"
// (Called by blog.html)
$("button:contains('Save for later')").click(function () {
  // Assigns article to which button belongs to "post" variable
  let post = this.closest("article");
  // Assigns post title, date, image location and first paragraph to new blog
  // post object.
  let postID = post.id;
  let postTitle = document.querySelector(
    "#" + postID + " .post-title"
  ).textContent;
  let postDate = document.querySelector(
    "#" + postID + " .post-date"
  ).textContent;
  let postImage = document.querySelector("#" + postID + " .post-image").src;
  let postParagraph = document.querySelector(
    "#" + postID + " .post-text p"
  ).textContent;
  // Creates new blog object from "saved" post.
  const blogPost = new BlogObject(
    postID,
    postTitle,
    postDate,
    postImage,
    postParagraph
  );
  // Function iterates through array and checks if it contains current blog
  // object title.
  let checkString = blogPost.title;
  let checkSave = (obj) => obj.title === checkString;
  let alreadySaved = savedPosts.some(checkSave);
  if (alreadySaved) {
    alert("This post has already been saved!");
    // Saves post to "savedPosts" array if it isn't there yet, and alerts user
    // to number of saved posts.
  } else {
    savedPosts.push(blogPost);
    alert(`There are ${savedPosts.length} posts in your "Saved" folder.`);
  }
  // Loads "savedItems" array to sessionStorage.
  sessionStorage.setItem("savedItems", JSON.stringify(savedPosts));
});

// Function called on load by "saved.html" to retrieve and display saved posts
// from sessionStorage.
function loadSavedPosts() {
  // Calls function to assign sessionStorage values to "savedPosts" array.
  loadSessionStorage();
  // Loop creates blog post elements, populates them from "savedPosts" array,
  // and adds them to "Saved" page DOM.
  for (let i = 0; i < savedPosts.length; i++) {
    let postItem = document.createElement("section");
    postItem.classList.add("saved-item");
    // In addition to title, date, image and description, ID is added to post
    // to identify it when window returns to "blog.html" page for full view.
    postItem.innerHTML = `<p id=${savedPosts[i].id}>${i + 1}. ${
      savedPosts[i].title
    } (${savedPosts[i].date})</p>`;
    postItem.innerHTML += `<img src=${savedPosts[i].image} alt="book cover"/>`;
    postItem.innerHTML += `<div>${savedPosts[i].text}</div>`;
    // Displays post in grid layout.
    $(".grid-layout").append(postItem);
  }
  // jQuery function adds effects to post caption on hover.
  $(".saved-item p").hover(
    function () {
      $(this).css({
        "background-color": "white",
        border: "1px solid black",
      });
    },
    function () {
      $(this).css({
        "background-color": "gainsboro",
        border: "1px solid gainsboro",
      });
    }
  );
  // jQuery function loads "blog.html" for full post view on caption click.
  $(".saved-item p").click(function () {
    let sendID = this.id;
    sessionStorage.setItem("id", sendID);
    location.href = "blog.html";
  });
}

// jQuery function animates and solidifies "thumbs up" icon on click.
$(".like").click(function () {
  $(this).animate(
    {
      height: "50vh",
      opacity: 0,
    },
    "500",
    function () {
      // Replaces current icon with opposite, to toggle between like and unlike
      let currentIcon = this.src;
      if (currentIcon.includes("solid")) {
        this.src =
          "https://upload.wikimedia.org/wikipedia/commons/2/21/Font_Awesome_5_regular_thumbs-up.svg";
      } else {
        this.src =
          "https://upload.wikimedia.org/wikipedia/commons/e/e6/Font_Awesome_5_solid_thumbs-up.svg";
      }
    }
  );
  $(this).animate(
    {
      height: "2vh",
      opacity: 1,
    },
    0
  );
});
