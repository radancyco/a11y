
/*!

  Radancy: Accessibility Pulse

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    // Display which Disclosure is in use via console:
  
    console.log("%c Accessibility Pulse v1.05 in use. ", "background: #6e00ee; color: #fff");
  
    // Commonly used Classes, Data Attributes, States, Strings, etc.

    let getLocation = location.href;

    // WAVE Validation

    let btnValidateWAVE = document.querySelectorAll(".validate-wave");

    btnValidateWAVE.forEach(function(btn) {

        btn.addEventListener("click", function(event) {

            event.preventDefault();

            var getLink = btn.getAttribute("href");
            window.open(getLink + "report#/" + getLocation, "_blank");

        });

    });

    // W3C Validation

    let btnValidateW3C = document.querySelectorAll(".validate-w3c");

    btnValidateW3C.forEach(function(btn) {

        btn.addEventListener("click", function(event) {

            event.preventDefault();

            var getLink = btn.getAttribute("href");
            window.open(getLink + "?showsource=yes&showoutline=yes&showimagereport=yes&doc=" + getLocation, "_blank");

        });

    });

    // Heading Validation

    let btnValidateHeading = document.querySelectorAll(".validate-heading");

    btnValidateHeading.forEach(function(btn) {

        btn.addEventListener("click", function(event) {

            event.preventDefault();

            var getLink = btn.getAttribute("href");
            window.open(getLink + "?url=" + getLocation, "_blank");

        });

    });

})();