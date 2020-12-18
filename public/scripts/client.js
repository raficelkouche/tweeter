/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  $(".new-tweet .error-message").hide();

  const escape = function(input) {
    const div = $("<div>")
    div.text(input);
    return div.text();
  }
  
  const createTweetElement = function (tweetData) {
    const $tweet = `<article>
          <header>
            <div class="profile-info">
              <img src=${tweetData.user.avatars} alt="">
              <p>${tweetData.user.name}</p>
            </div>
            <p id="handle">${tweetData.user.handle}</p>
          </header>
          <div class="tweet">
            <p>${escape(tweetData.content.text)}</p>
          </div>
          <footer>
            <p>${Math.floor((Date.now() - tweetData["created_at"]) * (1 / 86400000))} days ago</p>
            <div class="icons">
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>`
    return $tweet;
  }

  const renderTweets = function(tweets) {
    tweets.forEach((elm) => {
      let $tweet = createTweetElement(elm);
      $('.tweet-container').prepend($tweet)
    })
  };

  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: "http://localhost:8080/tweets"
    })
      .then(renderTweets)
  };

  const updateTweets = function() {
    $.ajax({
      method: 'GET',
      url: "http://localhost:8080/tweets"
    })
      .then((result) => {
        let $tweet = createTweetElement(result[result.length - 1]);
        $('.tweet-container').prepend($tweet);
      })
  }

  //Reset the form fields
  const resetForm = function () {
    const $form = $(".new-tweet form");
    $form.trigger("reset");
    $form.find("output").text(140);
  }; 

  
  //New tweet form validation and submission
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();
    const $data = $(this).children("#tweet-text");
    const $error = $(".new-tweet .error-message");
    
    //hide the error on submit
    $error.slideUp();

    if (!$data.val()) {
      $error.children("p").text("Tweet is empty! I am sure you can come up with something better than that...")
      $error.slideDown();
    } else if ($data.val().length > 140) {
      //create an error function that takes in the element and the type of error
      $error.children("p").text("That was a pretty long tweet! You might want to cut it down a bit to see it come to life...")
      $error.slideDown();
    } else {
        $.ajax({
          method: "POST",
          url: "http://localhost:8080/tweets",
          data: $data.serialize()
        })
          .then(() => {
            resetForm();
            updateTweets();
          })
          .catch((result) => {
            alert(result.responseJSON.error)
          })
    }
  })

  loadTweets();
});
