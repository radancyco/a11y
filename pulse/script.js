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

            document.querySelector(target).prepend(fragment);

        } else {

            console.error(`Element "${selector}" not found in fetched content.`);

        }

    }).catch(error => {

        console.error("Fetch error:", error);

    });

}

fetchAndAppendFragment("{{ include.url }}/pulse/module", "#a11y-pulse", "body");