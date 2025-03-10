

  /*!

  Radancy Component Library: Accordion

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    function loadLanguagePack(url, callback) {
  
      // Install Language Pack.
  
      var getComponentLanguagePack = document.getElementById("component-library-language-pack");
  
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
        var accordions = document.querySelectorAll(accordionClass);
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