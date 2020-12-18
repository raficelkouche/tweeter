$(document).ready(function() {
  
  //Parse a string to prevent XSS
  const escape = function(input) {
    const div = $("<div>")
    div.text(input);
    return div.text();
  }

  //Determine how long ago a tweet was posted
  const adjustTweetTime = function (timeInMs) {
    const MS_ONE_DAY = 86400000;
    const MS_ONE_MIN = 60000;
    const difference = Date.now() - timeInMs;

    if (difference >= MS_ONE_DAY) {
      //report in days if difference is more than 24 hours
      return `${Math.floor(difference / MS_ONE_DAY)} day(s) ago`;
      //report in minutes if difference is less than 24 hours
    } else if (difference < MS_ONE_DAY && difference >= MS_ONE_MIN) {
      return `${Math.floor(difference / MS_ONE_MIN)} minute(s) ago`;
    } else {
      return `<1 minute ago`;
    }
  }

  //Creates a new tweet element from a given object 
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
            <p>${adjustTweetTime(tweetData["created_at"])}</p>
            <div class="icons">
              <i class="fas fa-flag"></i>
              <i class="fas fa-retweet"></i>
              <i class="fas fa-heart"></i>
            </div>
          </footer>
        </article>`
    return $tweet;
  }

  //Render the tweets on the page ordered by date (most recent first)
  const renderTweets = function(tweets) {
    tweets.forEach((elm) => {
      let $tweet = createTweetElement(elm);
      $('.tweet-container').prepend($tweet)
    })
  };

  //load all the tweets and render them on the page
  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: "http://localhost:8080/tweets"
    })
      .then(renderTweets)
  };

  //Get the most recent tweet only and render it on the page
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

  //Validate the tweet before posting
  const validateTweet = function($data, $error) {
    if (!$data.val()) {
      $error.children("p").text("Tweet is empty! I am sure you can come up with something better than that...")
      $error.slideDown();
      return false;
    } else if ($data.val().length > 140) {
      $error.children("p").text("That was a pretty long tweet! You might want to cut it down a bit to see it come to life...")
      $error.slideDown();
      return false;
    } else {
      return true;
    }
  }
  
  //New tweet form validation and submission
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();

    const $data = $(this).children("#tweet-text");
    const $error = $(".new-tweet .error-message");

    //hide the error on submit
    $error.slideUp();

    //Post the tweet if it is valid
    if (validateTweet($data, $error)) {
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
  });

  //Hide the error messages and new tweet form when the document loads
  $(".new-tweet .error-message").hide();
  $(".new-tweet").children("form").hide();

  //registers a handler for the arrows in the navbar
  $(".fa-angle-double-down").on("click", function () {
    $(".error-message").slideUp(); //hide the error in case it was there
    //slides the form up/down depending on its current status
    $(".new-tweet").children("form").slideToggle('slow', function () {
      $("#tweet-text").focus();
    })
  })

  //Displays an arrow at the bottom of the page when the user starts scrolling
  $(window).on("scroll", function () {
    $(".lower-toggle-button").css("display", "flex");
  })
    //Scroll to the top of the page and show the form when the user clicks on the arrows
    $(".lower-toggle-button").on("click", function () {
      $("html").animate({ scrollTop: 0 }, "slow")
      $(".new-tweet").children("form").slideDown();
      $("#tweet-text").focus();
    })

  //Load the tweets when the document is ready
  loadTweets();
});
