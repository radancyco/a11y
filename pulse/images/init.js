/*!

  Radancy: Accessibility Pulse - Image Inventory

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    "use strict";
  
    let pageElement = document.getElementById("page-content");
    let urlParam = new URLSearchParams(window.location.search);
    let pageTest = urlParam.get("url");
    var pageElementHref = "https://validator.w3.org/nu/?showimagereport=yes&doc=" + pageTest;

    let pageError = document.createElement("div");
    pageError.classList.add("warning-info");
    pageError.innerHTML = "We're sorry, the content you are looking for can't be displayed right now. Try refreshing your page. If the issue persists please contact the <a href='mailto:a11y@radancy.com?subject=Accessibility%20Pulse%20Issue'>Accessibility Team</a>.";

    let request = new XMLHttpRequest();

    request.open("GET", pageElementHref, true);

    request.onload = function() {

    if (request.status >= 200 && request.status < 400) {

        // Success!

        let primaryHeading = document.querySelector(".primary-heading");
        let primaryHeadingLink = document.createElement("a");

        primaryHeadingLink.setAttribute("href", pageTest);
        primaryHeadingLink.setAttribute("target", "_blank");
        primaryHeadingLink.innerHTML = pageTest + " <span class='visually-hidden'>(opens in new window)</span></a>";
        primaryHeading.append(primaryHeadingLink);

        let parser = new DOMParser();
        let response = parser.parseFromString(request.responseText, "text/html");

        var fragment = response.getElementById("results");

        pageElement.appendChild(fragment);

    } else {

        // We reached our target server, but it returned an error

        pageElement.appendChild(pageError);

    }

    };

    request.onerror = function() {

    // There was a connection error of some sort

    pageElement.appendChild(pageError);

    };

    request.send();

})();