
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

    // Validate WAVE

    let btnValidateWAVE = document.querySelectorAll(".validate-wave");

    btnValidateWAVE.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "report#/" + getLocation);

    });

    // Validate W3C

    let btnValidateW3C = document.querySelectorAll(".validate-w3c");

    btnValidateW3C.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?showsource=yes&showoutline=yes&showimagereport=yes&doc=" + getLocation);

    });

    // Validate Headings

    let btnValidateHeading = document.querySelectorAll(".validate-heading");

    btnValidateHeading.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);

    });

    // Validate Images

    let btnValidateImage = document.querySelectorAll(".validate-image");

    btnValidateImage.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);

    });

    // Validate CSS

    let btnValidateCSS = document.querySelectorAll(".validate-css");

    btnValidateCSS.forEach(function(btn){

        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "validator?profile=css3&warning=0&uri=" + getLocation);

    });

    // Validate Links

    let btnValidateLinks = document.querySelectorAll(".validate-link");

    btnValidateLinks.forEach(function(btn){
    
        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?uri=" + getLocation + "&hide_type=all&depth=&check=Check");
    
    });

    // Validate Spelling

    let btnValidateSpelling = document.querySelectorAll(".validate-spelling");

    btnValidateSpelling.forEach(function(btn){
        
        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?uri=" + getLocation + "&lang=" + document.querySelector("html").getAttribute("lang"));
        
    });

    // Validate Structured Data

    let btnValidateStructuredData = document.querySelectorAll(".validate-structured-data");

    btnValidateStructuredData.forEach(function(btn){
    
        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);
    
    });

})();