/*!

  Radancy Component Library: Disclosure

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    // Display which Disclosure is in use via console:
  
    console.log("%c Disclosure v2.3 in use. ", "background: #6e00ee; color: #fff");
  
    // Commonly used Classes, Data Attributes, States, Strings, etc.
  
    var disclosureButtonClass = ".disclosure--btn";
    var disclosureButtons = document.querySelectorAll(disclosureButtonClass);
    var disclosureArrowClassName = "disclosure--arrow";
    var disclosureHeadingClass = ".disclosure--heading";
    var disclosureDataDefaultOpen = "data-open";
    var disclosureDataEnableAnchor = "data-enable-anchor";
    var disclosureDataRemoveArrow = "data-remove-arrow";
  
    // Add Listener and other needed attributes to disclosure button
  
    disclosureButtons.forEach(function(button, e) {
  
      var count = e + 1;
  
      button.setAttribute("aria-expanded", "false");
  
      if(button.hasAttribute("id")){
  
        // Check for custom ID on button.
  
        var thisButtonID = button.getAttribute("id");
        var thisContentID = thisButtonID + "-content";
  
      } else {
  
        // else, add dynamic ID.
  
        var thisButtonID = "disclosure-btn-" + count;
        var thisContentID = "disclosure-content-" + count;
  
      }
  
      // Set ID and aria-controls on button.
  
      button.setAttribute("id", thisButtonID);
      button.setAttribute("aria-controls", thisContentID);
  
      if(button.closest(disclosureHeadingClass)) {
  
        // If button contains heading...
  
        button.closest(disclosureHeadingClass).nextElementSibling.setAttribute("id", thisContentID);
  
      } else {
  
        button.nextElementSibling.setAttribute("id", thisContentID);
  
      }
  
      // If custom arrow not needed.
  
      if(!button.hasAttribute(disclosureDataRemoveArrow)){
  
        var toggleState = document.createElement("span");
  
        toggleState.setAttribute("aria-hidden", "true");
        toggleState.classList.add(disclosureArrowClassName);
        button.append(toggleState);
  
      }
  
      button.addEventListener("click", function() {
  
        var isExpanded = button.getAttribute("aria-expanded") === "true";
  
        button.setAttribute("aria-expanded", isExpanded ? "false" : "true");
  
        if(button.hasAttribute(disclosureDataEnableAnchor)) {
  
          history.pushState(null, null, "#" + button.id);
  
        }
  
      });
  
      // Open desired disclosure.
  
      if(button.hasAttribute(disclosureDataDefaultOpen)) {
  
        button.setAttribute("aria-expanded", "true");
  
      }
  
    });
  
    // Open selected disclosure via URL
  
    var url = document.location.href;
    var hash = url.split("#");
    var disclosureID = document.getElementById(hash[1]);
  
    if(disclosureID) {
  
      var disclosureTarget = document.querySelector(disclosureButtonClass + "#" + disclosureID.id);
  
      if (disclosureTarget) {
  
        disclosureTarget.setAttribute("aria-expanded", "true");
        disclosureTarget.focus();
  
      }
  
    }
  
  })();