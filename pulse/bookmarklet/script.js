/*!

  Radancy: Accessibility Pulse - Bookmarklet

  Contributor(s):
  Michael "Spell" Spellacy

*/

(function() {

    function fetchAndAppendFragment(url, selector, target) {

        fetch(url).then(response => {

            if (!response.ok) {

                throw new Error(`HTTP error! Status: ${response.status}`);

            }

            return response.text();

        }).then(html => {

            const tempDiv = document.createElement("div");

            tempDiv.innerHTML = html;

            const fragment = tempDiv.querySelector(selector);

            if (fragment) {

                // Load CSS 

                var a11yPulseCSS = document.createElement("link");
                a11yPulseCSS.classList.add("a11y-pulse-asset");
                a11yPulseCSS.setAttribute("rel", "stylesheet");
                a11yPulseCSS.setAttribute("href", "{{ include.url }}/pulse/bookmarklet/init.css");
                document.head.append(a11yPulseCSS);

                // Load Bookmarklet

                document.querySelector(target).before(fragment);

                // Load JavaScript 

                var a11yPulseJS = document.createElement("script");
                a11yPulseJS.classList.add("a11y-pulse-asset");
                a11yPulseJS.setAttribute("src", "{{ include.url }}/pulse/bookmarklet/init.js");
                document.body.append(a11yPulseJS);

            } else {

                console.error(`Element "${selector}" not found in fetched content.`);

            }

        }).catch(error => {

            console.error("Fetch error:", error);

        });

    }

    // Load Module

    let a11yPulse = document.querySelector(".a11y-pulse");

    if(!a11yPulse) {

        fetchAndAppendFragment("{{ include.url }}/pulse/bookmarklet", ".a11y-pulse", "body");

    }

})();
