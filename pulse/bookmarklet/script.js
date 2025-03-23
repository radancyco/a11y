/*!
  Radancy: Accessibility Pulse - Bookmarklet

  Contributor(s):
  Michael "Spell" Spellacy
*/

(function() {

    async function fetchAndAppendFragment(url, selector, target) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const html = await response.text();
            const fragment = new DOMParser().parseFromString(html, "text/html").querySelector(selector);

            if (fragment) {
                // Create a custom element to host the Shadow DOM
                const shadowHost = document.createElement("div");
                shadowHost.classList.add("a11y-pulse-root");

                // Create and attach the Shadow DOM
                const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

                // Append the shadowHost to the body
                document.body.prepend(shadowHost);

                // Fetch all required stylesheets
                const stylesheets = await Promise.all([
                    fetch("{{ include.url }}/pulse/bookmarklet/init.css").then(res => res.ok ? res.text() : ""),
                    fetch("https://radancy.dev/css/init.css").then(res => res.ok ? res.text() : ""),
                    fetch("https://radancy.dev/component-library/accordion/init.css").then(res => res.ok ? res.text() : "")
                ]);

                // Combine the fetched CSS into a single stylesheet
                const combinedCSS = stylesheets.join("\n");
                const sheet = new CSSStyleSheet();
                sheet.replaceSync(combinedCSS);
                shadowRoot.adoptedStyleSheets = [sheet];

                // Append the fragment directly into the Shadow DOM
                shadowRoot.append(fragment);

                // Load JavaScript into the Shadow DOM
                const a11yPulseJS = document.createElement("script");
                a11yPulseJS.classList.add("a11y-pulse-asset");
                a11yPulseJS.setAttribute("src", "{{ include.url }}/pulse/bookmarklet/init.js");
                shadowRoot.append(a11yPulseJS);
            } else {
                console.error(`Element "${selector}" not found in fetched content.`);
            }

        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    // Load Module
    const a11yPulse = document.querySelector(".a11y-pulse");

    if (!a11yPulse) {
        fetchAndAppendFragment("{{ include.url }}/pulse/bookmarklet/", ".a11y-pulse", "body");
    }

})();
