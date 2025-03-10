
var getLocation = location.href;

// WAVE Validation

var btnValidateW3C = document.querySelectorAll(".validate-w3c");

btnValidateWAVE.forEach(function(btn) {

    btn.addEventListener("click", function(event) {

        event.preventDefault();

        var getLink = btn.getAttribute("href");
        window.open(getLink + "report#/" + getLocation, "_blank");


    });

});

// W3C Validation

var btnValidateWAVE = document.querySelectorAll(".validate-wave");

btnValidateW3C.forEach(function(btn) {

    btn.addEventListener("click", function(event) {

        event.preventDefault();

        var getLink = btn.getAttribute("href");
        window.open(getLink + "?showsource=yes&showoutline=yes&showimagereport=yes&doc=" + getLocation, "_blank");

    });

});

// Heading Validation

var btnValidateHeading = document.querySelectorAll(".validate-heading");

btnValidateHeading.forEach(function(btn) {

    btn.addEventListener("click", function(event) {

        event.preventDefault();

        var getLink = btn.getAttribute("href");
        window.open(getLink + "?url=" + getLocation, "_blank");

    });

});