/*!

  Radancy: Accessibility Pulse - Bookmarklet
  
  Contributor(s):
  Michael "Spell" Spellacy
  
*/

(async () => {

    const fetchCSS = async (url) => {

        const response = await fetch(url);

        if (!response.ok) {

            throw new Error(`HTTP error! Status: ${response.status}`);

        }

        const text = await response.text();
        const sheet = new CSSStyleSheet();
        
        await sheet.replace(text);
        return sheet;

    };

    const fetchAndAppendFragment = async (url, selector, target) => {

        try {

            const response = await fetch(url);

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const html = await response.text();
            const fragment = new DOMParser().parseFromString(html, "text/html").querySelector(selector);

            if (fragment) {

                const shadowHost = document.createElement("a11y-pulse-component");

                const shadowRoot = shadowHost.attachShadow({ mode: 'open' });

                document.body.prepend(shadowHost);

                // Load and apply styles via adoptedStyleSheets

                const sheets = await Promise.all([

                    fetchCSS("{{ include.url }}/pulse/bookmarklet/init.css"),
                    fetchCSS("https://radancy.dev/component-library/accordion/init.css")

                ]);

                shadowRoot.adoptedStyleSheets = sheets;

                // Append content after styles

                shadowRoot.append(fragment);

                // Append script

                const a11yPulseJS = document.createElement("script");

                a11yPulseJS.src = "{{ include.url }}/pulse/bookmarklet/init.js";

                shadowRoot.append(a11yPulseJS);

            } else {

                console.error(`Element "${selector}" not found in fetched content.`);

            }

        } catch (error) {

            console.error("Fetch error:", error);

        }

    };

    if (!document.querySelector(".a11y-pulse")) {

        fetchAndAppendFragment("{{ include.url }}/pulse/bookmarklet/", ".a11y-pulse", "body");

    }

})();
