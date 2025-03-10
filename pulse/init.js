
var getLocation = location.href;
var btnValidateWAVE = document.querySelectorAll(".validate-wave");
var btnValidateW3C = document.querySelectorAll(".validate-w3c");

// WAVE Validation

btnValidateWAVE.forEach(function(btn) {

    btn.addEventListener("click", function(event) {

        event.preventDefault();

        var getLink = btn.getAttribute("href");
        window.open(getLink + "report#/" + getLocation, "_blank");


    });

});

// W3C Validation

btnValidateW3C.forEach(function(btn) {

    btn.addEventListener("click", function(event) {

        event.preventDefault();

        var getLink = btn.getAttribute("href");
        window.open(getLink + "?showsource=yes&showoutline=yes&showimagereport=yes&doc=" + getLocation, "_blank");

    });

});