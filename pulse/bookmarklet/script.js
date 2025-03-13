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

            // Parse the HTML string and extract the desired fragment

            const fragment = new DOMParser().parseFromString(html, "text/html").querySelector(selector);

            if (fragment) {

                // Create a custom element to host the Shadow DOM

                const shadowHost = document.createElement("div");

                shadowHost.classList.add("a11y-pulse-root");

                // Create and attach the Shadow DOM

                const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

                // Append the shadowHost to the body

                document.body.prepend(shadowHost);

                // Load CSS into the Shadow DOM

                const a11yPulseCSS = document.createElement("style");
                a11yPulseCSS.textContent = "@import url('{{ include.url }}/pulse/bookmarklet/init.css');";
                shadowRoot.append(a11yPulseCSS);

                // Prepend the fragment directly into the Shadow DOM

                a11yPulseCSS.onload = () => {

                    shadowRoot.append(fragment); // Append content only after CSS is ready

                     // Load JavaScript into the Shadow DOM

                    const a11yPulseJS = document.createElement("script");
                    a11yPulseJS.classList.add("a11y-pulse-asset");
                    a11yPulseJS.setAttribute("src", "{{ include.url }}/pulse/bookmarklet/init.js");
                    shadowRoot.append(a11yPulseJS);

                };

            } else {

                console.error(`Element "${selector}" not found in fetched content.`);

            }

        }).catch(error => {

            console.error("Fetch error:", error);

        });

    }

    // Load Module

    const a11yPulse = document.querySelector(".a11y-pulse");

    if(!a11yPulse) {

        fetchAndAppendFragment("{{ include.url }}/pulse/bookmarklet/", ".a11y-pulse", "body");

    }

})();
