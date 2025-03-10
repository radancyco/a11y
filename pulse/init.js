

var btnWAVEValidate = document.querySelectorAll(".validate-a11y");
var getWindowLocation = location.href;

btnWAVEValidate.forEach(function(btn) {

    // https://wave.webaim.org/#/http://localhost:4000/pulse/

    // https://wave.webaim.org/report#/https://disney-redesign.runmytests.com/en

    btn.addEventListener("click", function() {

    var getWAVELink = btn.getAttribute("href");

    window.open(getWAVELink + "report#/" + getWindowLocation, '_blank');

    });

});