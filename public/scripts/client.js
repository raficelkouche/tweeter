/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
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
            <p>${tweetData.content.text}</p>
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
      $('.tweet-container').append($tweet)
    })
  };

  const loadTweets = function() {
    $.ajax({
      method: 'GET',
      url: "http://localhost:8080/tweets"
    })
      .then(renderTweets)
  };

  loadTweets();
  
  $(".new-tweet form").on("submit", function(event) {
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "http://localhost:8080/tweets",
      data: $(this).children("#tweet-text").serialize()
    })
      .then()
      .catch((result) => {
        alert(result.responseJSON.error)
      })
  })

});
