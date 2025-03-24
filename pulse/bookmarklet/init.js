
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

    const getLocation = location.href;
    const shadowHost = document.querySelector(".a11y-pulse-root");
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

    // Get Alternative Text 

    let btnGetAlternativeTextData = shadowContainer.querySelectorAll(".validate-alternative-text");

    btnGetAlternativeTextData.forEach(function(btn){
    
      btn.addEventListener("click", function() {

      const API_KEY = '1qCtiKYAPcG5xy2BijVzOHQEO8OmqVtup9y2Wk7ZVxsk4traAyHuJQQJ99BCACYeBjFXJ3w3AAAFACOGmDy7'; // Replace with your Azure API key 
      const ENDPOINT = 'https://a11y.cognitiveservices.azure.com'; // Replace with your Azure endpoint

      if (!API_KEY || !ENDPOINT) {

        alert('Please update the script with your Azure API key and endpoint.');

      } else {

        async function selectImage() {
          
          return new Promise((resolve) => {

            document.body.addEventListener('click', function handler(event) {

              if (event.target.tagName === 'IMG') {

                event.preventDefault();

                document.body.removeEventListener('click', handler);

                resolve(event.target);

              }

            }, { once: true });

          });

        }

        async function generateAltText(imageUrl) {

          const response = await fetch(`${ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description`, {

            method: 'POST',

            headers: {

              'Ocp-Apim-Subscription-Key': API_KEY,

              'Content-Type': 'application/json'

            },

            body: JSON.stringify({ url: imageUrl })

          });


          const data = await response.json();

          return data.description?.captions[0]?.text || 'No description available';

        }

        alert('Click on an image to generate alt text.');

        (async function() {

          const img = await selectImage();

          const imageUrl = img.src.startsWith('http') ? img.src : window.location.origin + img.src;

          try {

            const altText = await generateAltText(imageUrl);

            img.alt = altText;

            alert(`Alt text generated: "${altText}"`);

          } catch (error) {

            alert('Error generating alt text. Check API key and endpoint.');

            console.error(error);

          }

        })();

      }

      });
  
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
            // bookMarklet.setAttribute("id", "a11y-pulse-bookmarklet");
            bookMarklet.setAttribute("src", this.getAttribute("data-script"));
            document.body.append(bookMarklet);

        });    
    
    });


// From page.js, possibly related to fragments. see if we can create new single scripts for this. 

// Append Bookmarklet




// 

/*!

  Radancy Component Library: Accordion

  Contributor(s):
  Michael "Spell" Spellacy

*/

    function loadLanguagePack(url, callback) {
  
      // Install Language Pack.
  
      var getComponentLanguagePack = shadowContainer.getElementById("component-library-language-pack");
  
      if (!getComponentLanguagePack) {
  
        var componentLanguagePack = document.createElement("script");
  
        componentLanguagePack.setAttribute("src", url);
        componentLanguagePack.setAttribute("id", "component-library-language-pack");
        componentLanguagePack.addEventListener("load", callback);
  
        document.head.appendChild(componentLanguagePack);
  
      } else {
  
        getComponentLanguagePack.addEventListener("load", callback);
  
      }
  
    }
  
    function initAccordion() {
  
      loadLanguagePack("https://services.tmpwebeng.com/component-library/language-pack.js", function(){
  
        // Display which version is in use via console:
  
        console.log("%c Accordion v2.7 in use. ", "background: #6e00ee; color: #fff");
  
        // Classes, data attributes, states, and strings.
  
        var accordionClass = ".accordion";
        var accordionCloseClassName = "accordion__close";
        var accordionCloseClass = "." + accordionCloseClassName;
        var accordionToggleClassName = "accordion__toggle";
        var accordionArrowClassName = "accordion__arrow";
        var accordionToggleClass = "." + accordionToggleClassName;
        var accordionToggleAllClass = ".accordion__toggle-all";
        var accordionHeadingClassName = "accordion__heading";
        var accordionPanelClass = ".accordion__panel";
        var accordionDataActiveState = "data-active";
        var accordionDataDefaultOpen = "data-open";
        var accordionDataOverlay = "data-overlay";
        var accordionDataCloseButton = "data-close";
        var accordionDataDisableAnchor = "data-disable-anchor";
        var accordionDataFixedHeight = "data-fixed-height";
        var accordionDataMultiOpen = "data-multiple";
        var accordionDataRemoveArrow = "data-remove-arrow";
        var accordions = shadowContainer.querySelectorAll(accordionClass);
        var URLFragment = location.hash.slice(1);
  
        // Language
  
        var accordionCloseButtonLabel = window.accordionCloseButtonLabel;
  
        // Loop through and set up all accordions on the page.
  
        accordions.forEach(function(accordion, index) {
  
          // Set unique ID on all accordions.
  
          accordion.setAttribute("id", "accordion-" + (index + 1));
  
          // Get all buttons within accordion.
  
          var accordionToggles = accordion.querySelectorAll(accordionToggleClass);
  
          // Get all panels within accordion.
          
          var accordionPanels = accordion.querySelectorAll(accordionPanelClass);
  
          // Set variable for selected button target.
  
          var expandedButton = null;
  
          // Get "Toggle All " button.
  
          var btnToggleAll = accordion.querySelector(accordionToggleAllClass);
  
          // Loop through each toggle button.
  
          accordionToggles.forEach(function(btn) {
  
            // Get button ID. Remember: ID's should always be unique.
  
            var buttonID = btn.getAttribute("id");
  
            // Set up each button.
  
            btn.setAttribute("aria-controls", "accordion-" + buttonID);
            btn.setAttribute("aria-expanded", "false");
  
            // Add Toggle Arrow
  
            if(!accordion.hasAttribute(accordionDataRemoveArrow)) {
  
              var toggleState = document.createElement("span");
  
              toggleState.setAttribute("aria-hidden", "true");
              toggleState.classList.add(accordionArrowClassName);
              btn.append(toggleState);
  
            }
  
            // Handle button click.
  
            btn.addEventListener("click", function() {
  
              var isExpanded = btn.getAttribute("aria-expanded") === "true";
  
              if (!accordion.hasAttribute(accordionDataMultiOpen)) {
  
                accordionToggles.forEach(function(button) {
  
                  button.setAttribute("aria-expanded", "false");
  
                });
  
              }
  
              btn.setAttribute("aria-expanded", isExpanded ? "false" : "true");
  
              // Add "data-active" attribute on the parent accordion. Might be useful to achieve interesting UX.
        
              accordion.setAttribute(accordionDataActiveState, "");
  
              // If "Toggle All" button is present, then always set it to false.
  
              if(btnToggleAll) {
              
                btnToggleAll.setAttribute("aria-pressed", "false")
              
              }
  
              // Place focus on close button if present.
  
              if (accordion.hasAttribute(accordionDataCloseButton)) {
  
                btn.nextElementSibling.querySelector(accordionCloseClass).focus();
  
              }
  
              // Add URL Fragment to URL if not disabled.
  
              if (!accordion.hasAttribute(accordionDataDisableAnchor)) {
  
                history.pushState(null, null, "#" + buttonID);
  
              }
  
            });
  
            // Default open based on URL fragment or data-open attribute.
  
            if (buttonID === URLFragment || (!expandedButton && btn.hasAttribute(accordionDataDefaultOpen))) {
  
              // Add "data-active" to parent.
  
              accordion.setAttribute(accordionDataActiveState, "");
  
              // Open targeted element.
              
              expandedButton = btn;
  
            }
  
          });
  
          if (expandedButton) { 
            
            expandedButton.setAttribute("aria-expanded", "true");
  
          }
  
          // If "Toggle All" button is present...
  
          if(btnToggleAll) {
  
            btnToggleAll.setAttribute("aria-pressed", "false");
  
            if(!accordion.hasAttribute(accordionDataRemoveArrow)) {
  
              var toggleAllState = document.createElement("span");
  
              toggleAllState.setAttribute("aria-hidden", "true");
              toggleAllState.classList.add(accordionArrowClassName);
              btnToggleAll.append(toggleAllState);
  
            }
  
            // Toggle All Event
  
            btnToggleAll.addEventListener("click", function() {
  
              var isPressed = this.getAttribute("aria-pressed");
  
              if(isPressed === "true") {
  
                this.setAttribute("aria-pressed", "false");
        
              } else {
        
                this.setAttribute("aria-pressed", "true");
        
              }
  
              // Get all accordion buttons and handle their state based on toggle button state.
  
              accordionToggles.forEach(function(btn) {
  
                if (isPressed === "true") {
  
                  btn.setAttribute("aria-expanded", "false");
  
                } else {
  
                  btn.setAttribute("aria-expanded", "true");
  
                }
  
              });
  
            });
  
          }
  
          // Loop through each panel.
  
          accordionPanels.forEach(function(panel) {
  
            // Set up each disclosure.
  
            var currentPanel = panel.previousElementSibling;
  
            var panelID;
  
            if(currentPanel.classList.contains(accordionHeadingClassName)) {
  
              panelID = currentPanel.querySelector(accordionToggleClass).getAttribute("id");
  
            } else { 
  
              panelID = currentPanel.getAttribute("id");
  
            }
  
            panel.setAttribute("id", "accordion-" + panelID);
  
             // To better support scrolling and repositioned focus, the panels should have a proper role and accName.
  
            if (accordion.hasAttribute(accordionDataFixedHeight) || accordion.hasAttribute(accordionDataOverlay)) {
  
              panel.setAttribute("role", "region");
              panel.setAttribute("aria-labelledby", panelID);
  
            }
  
             // To better support inner-scrolling, the panels must be focusable.
  
            if (accordion.hasAttribute(accordionDataFixedHeight)) {
  
              panel.setAttribute("tabindex", "0");
  
            }
  
            // Add close button
  
            if (accordion.hasAttribute(accordionDataCloseButton)) {
  
              var closeButton = document.createElement("button");
  
              closeButton.setAttribute("aria-label", accordionCloseButtonLabel);
              closeButton.classList.add(accordionCloseClassName);
  
              closeButton.addEventListener("click", function() {
  
                var thisButton = panel.previousElementSibling;
  
                // Remove "data-active" attribute.
  
                accordion.removeAttribute(accordionDataActiveState);
  
                // Reset button state, move focus to button that initiated click.
  
                thisButton.setAttribute("aria-expanded", "false");
                thisButton.focus();
  
              });
  
              panel.prepend(closeButton);
  
            }
  
          });
  
        });
  
        // Check for duplicate IDs and log a warning
  
        var buttonIDs = Array.prototype.map.call(document.querySelectorAll(accordionToggleClass), function(btn) {
  
          return btn.id;
  
        });
  
        buttonIDs.forEach(function(id, index) {
  
          if (buttonIDs.indexOf(id, index + 1) !== -1) {
  
            console.warn("%c Warning: Duplicate Accordion ID found: #" + id + ". Accordions must have unique ID values.", "background: #ff0000; color: #fff");
  
          }
  
        });
  
      });
  
    }
  
    initAccordion();
  

})();