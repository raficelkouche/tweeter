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
      return `${Math.floor(difference / MS_ONE_DAY)} day(s) ago`
      //report in minutes if difference is less than 24 hours
    } else if (difference < MS_ONE_DAY && difference >= MS_ONE_MIN) {
      return `${Math.floor(difference / MS_ONE_MIN)} minute(s) ago`
    } else {
      return `<1 minute ago`
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
  $(".new-tweet .error-message").hide();
  $(".new-tweet").children("form").hide();

  $(".fa-angle-double-down").on("click", function () {
    $(".error-message").slideUp();
    $(".new-tweet").children("form").slideToggle('slow', function () {
      $("#tweet-text").focus();
      
    })
  })

  $(window).on("scroll", function () {
    $(".lower-toggle-button").css("display", "flex");

  })

  $(".lower-toggle-button").on("click", function () {
    $("html").animate({ scrollTop: 0 }, "slow")
    $(".new-tweet").children("form").slideDown();
    $("#tweet-text").focus();
  })
  loadTweets();
});
