javascript: (function () {

  let magicBullet = document.querySelector("#radancy-magicbullet[data-a11y]") || document.querySelector("#tmp-magic-bullet[data-a11y='true']");

  if(magicBullet) {

    alert("MagicBullet is currently on the site. Awesome!")

  } else { 

    alert("MagicBullet is not currently on the site. Please add it or log an issue.")

  }

})();
