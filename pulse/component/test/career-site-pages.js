(() => {

    "use strict";

    const shadowHost = document.querySelector("a11y-pulse-component");
    const shadowContainer = shadowHost.shadowRoot;
    const ul = document.createElement("ul");
    const statusContainer = shadowContainer.querySelector(".status-container--career-site-pages");

    statusContainer.appendChild(ul);

    const statusList = shadowContainer.querySelector(".status-container--career-site-pages ul");
    const statusMessage = shadowContainer.querySelector(".status-message--career-site-pages");

    var careerSitePages = document.getElementById("career-site-pages");

    var careerSitePagesLang = careerSitePages.getAttribute("data-lang");

    const loadSitemap = async (url) => {
        try {
            const response = await fetch(url);
            const text = await response.text();
            return (new DOMParser()).parseFromString(text, "text/xml");
        } catch (error) {
            console.error("Failed to load sitemap:", error);
        }
    };

    const expandUrlSet = async (urlset) => {
        const urls = [];
        const subfolderPageLists = {};
        const urlElements = Array.from(urlset.children);

        const jobLocationPaths = {
            "de": "/arbeitsort/",
            "fr": "/lieu-de-travail/",
            "pt-br": "/sub-localização/",
            "default": "/job-location/"
        };

        const jobLocationPath = jobLocationPaths[careerSitePagesLang] || jobLocationPaths["default"];
        const jobLocationUrls = [];

        const isJobPage = (loc) => {
            if (careerSitePagesLang === "de") return loc.includes("/stellenbeschreibung/");
            if (careerSitePagesLang === "fr") return loc.includes("/emploi/");
            if (careerSitePagesLang === "pt-br") return loc.includes("/vaga/");
            return loc.includes("/job/");
        };

        const checkAjdInput = async (loc) => {
            try {
                const response = await fetch(loc);
                const html = await response.text();
                const dom = new DOMParser().parseFromString(html, "text/html");
                return dom.querySelector("input#ajdType") !== null;
            } catch (e) {
                return false;
            }
        };

        for (const url of urlElements) {
            const loc = url.querySelector("loc").textContent;
           
            try {
    const pathname = new URL(loc).pathname;
    const pathParts = pathname.split("/").filter(Boolean);

    if (!pathParts.length) {
        console.warn("Skipping URL with no subfolder path:", loc);
        continue;
    }

    const subfolder = `/${pathParts[0]}/`;

    if (loc.includes(jobLocationPath)) {
        if (jobLocationUrls.length < 5) {
            jobLocationUrls.push(loc);
        }
        continue;
    }

    if (!subfolderPageLists[subfolder]) {
        subfolderPageLists[subfolder] = [];
    }

    if (subfolderPageLists[subfolder].length < 20) {
        subfolderPageLists[subfolder].push(loc);
    }

} catch (e) {
    console.error("Invalid loc in sitemap:", loc, e);
    continue;
}

for (const [sub, pages] of Object.entries(subfolderPageLists)) {
    console.log(`Subfolder: ${sub} → ${pages.length} pages`);
}

          
        }

        console.log("DEBUG: Subfolders found:", Object.keys(subfolderPageLists));

        let totalIncluded = 0;

        for (const subfolder in subfolderPageLists) {
            if (totalIncluded >= 20) break;

            let subfolderIncludedCount = 0;

            for (const loc of subfolderPageLists[subfolder]) {
                if (subfolderIncludedCount >= 2) break;

                const hasAjd = isJobPage(loc) ? await checkAjdInput(loc) : false;

                urls.push({ loc, ajd: hasAjd });
                subfolderIncludedCount++;
                totalIncluded++;
            }
        }

        // Handle /job-location/ pages
        let jobLocAdded = 0;
        let jobLocAjdAdded = 0;

        for (const loc of jobLocationUrls) {
            if (isJobPage(loc)) {
                const hasAjd = await checkAjdInput(loc);
                if (hasAjd && jobLocAjdAdded < 2) {
                    urls.push({ loc, ajd: true });
                    jobLocAjdAdded++;
                } else if (!hasAjd && jobLocAdded < 2) {
                    urls.push({ loc });
                    jobLocAdded++;
                }
            } else if (jobLocAdded < 2) {
                urls.push({ loc });
                jobLocAdded++;
            }

            if (jobLocAjdAdded + jobLocAdded >= 2) break;
        }

        console.log("DEBUG: Subfolder URLs collected:", urls.map(u => u.loc));
        return urls;
    };

    const processSitemap = (sitemap) => {
        sitemap = sitemap.documentElement;
        console.log("DEBUG: Sitemap tag:", sitemap.tagName);

        switch (sitemap.tagName) {
            case "urlset":
                return expandUrlSet(sitemap);
            default:
                return Promise.resolve([]);
        }
    };

    const getPageTitle = async (urlObj) => {
        const url = urlObj.loc;
        const isAjd = urlObj.ajd;

        try {
            const response = await fetch(url);
            const html = await response.text();
            const dom = new DOMParser().parseFromString(html, "text/html");

            let titleElement = dom.querySelector("title");
            let paddedID = String(urlObj.id).padStart(3, "0");
            let title = titleElement && titleElement.textContent.trim() !== "" ? titleElement.textContent : `No Page Title - A11Y${paddedID}`;

            urlObj.missingTitle = !titleElement || titleElement.textContent.trim() === "";

            if (isAjd) title += " (AJD)";

            const isCmsContent = dom.querySelector('meta[name="career-site-page-type"][content="ContentPage-CMS"]') !== null;
            if (isCmsContent) title += " (CMS Content)";

            const hasSlick = !!dom.querySelector('[class*="slick"]') || !!dom.querySelector('[class*="slide"]');
            urlObj.hasSlick = hasSlick;

            const hasTabcordion = !!dom.querySelector('[class*="tab-accordion"]') || !!dom.querySelector('[class*="tabcordion"]');
            urlObj.hasTabcordion = hasTabcordion;

            const li = document.createElement("li");
            const a = document.createElement("a");
            const img = document.createElement("img");

            a.href = url;
            a.textContent = url;
            a.target = "_blank";

            img.src = "https://radancy.dev/a11y/pulse/component/img/new-tab.png";
            img.alt = "(Opens in new window)";

            a.appendChild(img);
            li.appendChild(a);
            statusList.prepend(li);

            return title;

        } catch (error) {
            console.error("Error retrieving page title:", error);

            const li = document.createElement("li");
            const a = document.createElement("a");
            const img = document.createElement("img");

            a.href = url;
            a.textContent = "Error retrieving: " + url;
            a.target = "_blank";

            img.src = "https://radancy.dev/a11y/pulse/img/new-tab.png";
            img.alt = "(Opens in new window)";

            a.appendChild(img);
            li.appendChild(a);
            li.classList.add("status-error");
            statusList.prepend(li);

            urlObj.hasSlick = false;
            urlObj.hasTabcordion = false;

            return "Title not found";
        }
    };

    const convertSitemapToArray = async (url) => {
        const sitemap = await loadSitemap(url);
        const urls = await processSitemap(sitemap);

        const generateRandomID = () => Math.floor(100000 + Math.random() * 900000);
        const usedIDs = new Set();

        for (const url of urls) {
            let randomID;
            do {
                randomID = generateRandomID();
            } while (usedIDs.has(randomID));
            usedIDs.add(randomID);

            url.id = randomID;
            url.title = await getPageTitle(url);
        }

        return urls;
    };

    const makeCsv = (data) => {
        let csv = "ID, Title, URL, Heading Validation, WAVE Validation, Slick, Tabcordion, Heading Issue, Missing Page Title, W3C Validation\n";

        data.forEach((row) => {
            csv += `"A11Y${row.id}","${row.title}","${row.loc}","https://validator.w3.org/nu/?showoutline=yes&doc=${row.loc}#headingoutline","https://wave.webaim.org/report#/${row.loc}","${row.hasSlick ? "X" : ""}","${row.hasTabcordion ? "X" : ""}"," ","${row.missingTitle ? "X" : ""}","https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=${row.loc}"\n`;
        });

        return csv;
    };

    const triggerDownload = (csv, file) => {
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", file);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const isLangFolder = /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0]);
    const sitemapUrl = isLangFolder ? `${location.origin}/${pathSegments[0]}/sitemap.xml` : `${location.origin}/sitemap.xml`;

    convertSitemapToArray(sitemapUrl).then((data) => {
        const csv = makeCsv(data);
        const domain = location.hostname.replace(/\./g, '-');
        const file = `${domain}-pages.csv`;

        triggerDownload(csv, file);
        statusMessage.textContent = `Complete! Please check your download folder (${file}).`;
    });

})();
