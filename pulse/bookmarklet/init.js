
/*!

  Radancy: Accessibility Pulse

  Contributor(s):
  Michael "Spell" Spellacy

*/


import { initAccordion } from "https://radancy.dev/component-library/accordion/module.js";

// Example: if it exports `initAccordion`

initAccordion();

(function() {

    "use strict";
  
    // Display which Disclosure is in use via console:
  
    console.log("%c Accessibility Pulse v1.05 in use. ", "background: #6e00ee; color: #fff");
  
    // Commonly used Classes, Data Attributes, States, Strings, etc.

    const getLocation = location.href;
    const shadowHost = document.querySelector("a11y-pulse");
    const shadowContainer = shadowHost.shadowRoot;
    const a11yPulse = shadowContainer.querySelector(".a11y-pulse");
    const a11yPulseClose = shadowContainer.querySelector(".a11y-pulse__close");

    // Show Modal

    a11yPulseClose.focus();

    // Close Button 

    a11yPulseClose.addEventListener("click", () => {

        a11yPulse.setAttribute("closing", "");

        a11yPulse.addEventListener("animationend", () => {

            shadowHost.remove();

            let a11yPulseAssets = document.querySelectorAll(".a11y-pulse-asset");

           a11yPulseAssets.forEach(function(asset) {

               asset.remove();

           });

        });

    });

    // Validate WAVE

    let btnValidateWAVE = shadowContainer.querySelectorAll(".validate-wave");

    btnValidateWAVE.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "report#/" + getLocation);

    });

    // Validate W3C

    let btnValidateW3C = shadowContainer.querySelectorAll(".validate-w3c");

    btnValidateW3C.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?showsource=yes&showoutline=yes&showimagereport=yes&doc=" + getLocation);

    });

    // Validate Headings

    let btnValidateHeading = shadowContainer.querySelectorAll(".validate-heading");

    btnValidateHeading.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);

    });

    // Validate Images

    let btnValidateImage = shadowContainer.querySelectorAll(".validate-image");

    btnValidateImage.forEach(function(btn) {

        var getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);

    });

    // Validate CSS

    let btnValidateCSS = shadowContainer.querySelectorAll(".validate-css");

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

    let btnValidateSpelling = shadowContainer.querySelectorAll(".validate-spelling");

    btnValidateSpelling.forEach(function(btn){
        
        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?uri=" + getLocation + "&lang=" + document.querySelector("html").getAttribute("lang") + "&suggest=on");
        
    });

    // Validate Structured Data

    let btnValidateStructuredData = shadowContainer.querySelectorAll(".validate-structured-data");

    btnValidateStructuredData.forEach(function(btn){
    
        let getLink = btn.getAttribute("href");
        btn.setAttribute("href", getLink + "?url=" + getLocation);
    
    });

    // Validate HTML by Direct Input

    var formValidation = shadowContainer.getElementById("submitPartialPage");
    var formValidationContent = shadowContainer.getElementById("contentToValidate");
    var formValidationSubmit = shadowContainer.getElementById("submitValidate");
    var topHtml = '<!DOCTYPE html>' + "\n" + '<html lang="en">' + "\n" + '<head>' + "\n\t" + '<meta charset="utf-8">' + "\n\t" + '<title>Untitled Document</title>' + "\n" + '</head>' + "\n" + '<body>' + "\n" + "\n";
    var bottomHtml = "\n\n</body></html>";
    
    formValidationSubmit.addEventListener("click", function(e) {
    
        e.preventDefault();
    
        var textareaContent = formValidationContent.value;
    
        var newInput = document.createElement("input");
        newInput.setAttribute("type", "hidden");
        newInput.setAttribute("id", "contentField");
        newInput.setAttribute("name", "content");
        newInput.setAttribute("value", topHtml + textareaContent + bottomHtml);
        formValidation.appendChild(newInput);
    
        formValidation.submit();
    
    }, false);

    // Bookmarklet Loader
    
    let btnValidateScript = shadowContainer.querySelectorAll("button[data-script]");

    btnValidateScript.forEach(function(btn){

        btn.addEventListener("click", function() {

            var bookMarklet = document.createElement("script");
            bookMarklet.setAttribute("src", this.getAttribute("data-script"));
            document.body.append(bookMarklet);

        });    
    
    });



  

})();