$(document).ready(function () {
  $(".new-tweet form textarea").on("input", function () {
    //Count the characters
    const charCount = 140 - $(this).val().length
    $(this).siblings().children(".counter").text(charCount);

    //Check for character limit
    if (charCount < 0) {
      $(this).siblings().children(".counter").addClass("negative");
    }
    else {
      $(this).siblings().children(".counter").removeClass("negative");
    }
  })
})