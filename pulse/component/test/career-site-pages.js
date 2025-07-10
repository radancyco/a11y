(() => {

    "use strict";

    const shadowHost = document.querySelector("a11y-pulse-component");
    const shadowContainer = shadowHost.shadowRoot;
    const ul = document.createElement("ul");
    const statusContainer = shadowContainer.querySelector(".status-container--career-site-pages");

    statusContainer.appendChild(ul);

    const statusList = shadowContainer.querySelector(".status-container--career-site-pages ul");
    const statusMessage = shadowContainer.querySelector(".status-message--career-site-pages");
    const statusContainerMsg = shadowContainer.querySelector(".status-container__msg");
    const careerSitePages = document.getElementById("career-site-pages");
    const careerSitePagesLang = careerSitePages.getAttribute("data-lang");
    
    statusContainerMsg.textContent = "Loading. Please be pateint. Go make a sandwich. Actually, make me one too. Mmmm sammiches.";

    const loadSitemap = async (url) => {

        const response = await fetch(url);
        const text = await response.text();
        return (new DOMParser()).parseFromString(text, "text/xml");

    };

    const checkAjdInput = async (loc) => {

        try {

            const response = await fetch(loc);
            const html = await response.text();
            const dom = new DOMParser().parseFromString(html, "text/html");
            return dom.querySelector("#ajd-header") !== null;

        } catch {

            return false;

        }

    };

    const expandUrlSet = async (urlset) => {

        const urls = [];
        const subfolderCounts = {};
        const urlElements = Array.from(urlset.children);

        let ajdJobsIncluded = 0;
        let regularJobsIncluded = 0;

       const allowedSubfolders = (() => {
    const foldersByLang = {
        "de": ["berufsfeld", "länderauswahl", "beschäftigung", "stellenbeschreibung", "arbeitsort", "jobsuche", "inhalt", "firma", "verweisung"],
        "fr": ["catégorie", "lieu", "emplois", "entreprise", "emploi"],
        "nl": ["categorie", "plaats", "werk", "banen", "firma"],
        "pt-br": ["área", "localização", "firma", "vaga", "sub-localização"],
        "default": ["job", "location", "employment", "category", "business"]
    };

    const rawFolders = foldersByLang[careerSitePagesLang] || foldersByLang["default"];

    // Always add leading slash and encode once
    return rawFolders.map(f => encodeURI(`/${f}/`));
})();

        const isJobPage = (loc) => {
    const jobPathByLang = {
        "de": "stellenbeschreibung",
        "fr": "emploi",
        "nl": "banen",
        "pt-br": "vaga",
        "default": "job"
    };

    const rawJobPath = jobPathByLang[careerSitePagesLang] || jobPathByLang["default"];
    const encodedJobPath = encodeURI(`/${rawJobPath}/`);

    return loc.includes(encodedJobPath);
};


        const currentPath = window.location.pathname;
        const subfolderPrefix = currentPath.split('/').filter(Boolean)[0];
        const expectedPrefix = `${window.location.origin}/${subfolderPrefix}/`;

        if (urlElements.length && urlElements[0].querySelector("loc") && urlElements[0].querySelector("loc").textContent === window.location.origin && subfolderPrefix) {

            urlElements[0].querySelector("loc").textContent = expectedPrefix;

        }

for (const url of urlElements) {
    const loc = url.querySelector("loc").textContent;
    const path = new URL(loc).pathname; // ✅ Move here — parse once per URL

console.log(`🔍 Checking URL: ${loc}`);
console.log(`📁 Normalized path: ${path}`);


    let found = false;

for (const subfolder of allowedSubfolders) {
    console.log(`   ↪ Checking if path includes: ${subfolder}`);

    if (path.includes(subfolder)) {
        console.log(`✅ Match found: ${subfolder}`);

        found = true;
        const matchedSubfolder = subfolder;

        if (isJobPage(loc)) {
            if (ajdJobsIncluded >= 2 && regularJobsIncluded >= 2) {
                console.log("🚫 Job page limits reached. Skipping.");
                break;
            }

            const hasAjd = await checkAjdInput(loc);
            console.log(`   🔎 AJD check for ${loc}: ${hasAjd}`);

            if (hasAjd && ajdJobsIncluded < 2) {
                ajdJobsIncluded++;
                console.log(`   ✅ Adding AJD job (${ajdJobsIncluded}/2): ${loc}`);
                urls.push({ loc, ajd: true });
            } else if (!hasAjd && regularJobsIncluded < 2) {
                regularJobsIncluded++;
                console.log(`   ✅ Adding regular job (${regularJobsIncluded}/2): ${loc}`);
                urls.push({ loc });
            }
        } else {
            subfolderCounts[matchedSubfolder] = (subfolderCounts[matchedSubfolder] || 0) + 1;

            console.log(`📊 Subfolder count for ${matchedSubfolder}: ${subfolderCounts[matchedSubfolder]}`);

            if (subfolderCounts[matchedSubfolder] <= 2) {
                console.log(`   ✅ Adding category/content page: ${loc}`);
                urls.push({ loc });
            } else {
                console.log(`   🚫 Skipping (limit reached): ${loc}`);
            }
        }

        break;
    }
}


    if (!found) {
    console.log("🚫 No subfolder match — including anyway.");
    urls.push({ loc });
}


    const allSubfoldersDone = allowedSubfolders.every(
    (sub) => (subfolderCounts[sub] || 0) >= 2
);

if (
    ajdJobsIncluded >= 2 &&
    regularJobsIncluded >= 2 &&
    allSubfoldersDone
) {
    console.log("🎯 All limits met — exiting early.");
    break;
}



}


        return urls;

    };

    const processSitemap = (sitemap) => {

        sitemap = sitemap.documentElement;

        return sitemap.tagName === "urlset" ? expandUrlSet(sitemap) : Promise.resolve([]);

    };

    const getPageInsights = async (urlObj) => {

        const url = urlObj.loc;
        const isAjd = urlObj.ajd;

        try {

            const response = await fetch(url);
            const html = await response.text();
            const dom = new DOMParser().parseFromString(html, "text/html");

            const titleElement = dom.querySelector("title");
            const paddedID = String(urlObj.id).padStart(3, "0");
            
            let title = titleElement && titleElement.textContent.trim() ? titleElement.textContent.trim() : `No Page Title - A11Y${paddedID}`;

            urlObj.missingTitle = !titleElement || titleElement.textContent.trim() === "";

            if (isAjd) title = "(AJD) " + title;

            const isCmsContent = dom.querySelector('meta[name="career-site-page-type"][content="ContentPage-CMS"]');

            if (isCmsContent) title = "(CMS Content) " + title;

            urlObj.title = title;
            urlObj.hasSlick = !!dom.querySelector('[class*="slick"]') || !!dom.querySelector('[class*="slide"]');
            urlObj.hasTabcordion = !!dom.querySelector('[class*="tab-accordion"]') || !!dom.querySelector('[class*="tabcordion"]');

            const li = document.createElement("li");
            const a = document.createElement("a");
            const img = document.createElement("img");

            if (statusList.children.length === 0) {

                statusContainerMsg.textContent = "";
        
            }

            a.href = url;
            a.textContent = url;
            a.target = "_blank";
            img.src = "https://radancy.dev/a11y/pulse/component/img/new-tab.png";
            img.alt = "(Opens in new window)";

            a.appendChild(img);
            li.appendChild(a);
        
            statusList.prepend(li);

            return title;

        } catch {

            const li = document.createElement("li");
            const a = document.createElement("a");
            const img = document.createElement("img");

            if (statusContainer.children.length === 0) {

                statusContainerMsg.textContent = "";
        
            }

            a.href = url;
            a.textContent = "Error retrieving: " + url;
            a.target = "_blank";
            img.src = "https://radancy.dev/a11y/pulse/component/img/new-tab.png";
            img.alt = "(Opens in new window)";

            a.appendChild(img);
            li.appendChild(a);
            li.classList.add("status-error");

            statusList.prepend(li);

            urlObj.title = `Title not found - A11Y${urlObj.id}`;
            urlObj.hasSlick = false;
            urlObj.hasTabcordion = false;
            urlObj.missingTitle = true;

            return urlObj.title;
                
        }

    };

    const convertSitemapToArray = async (url) => {
            
        const sitemap = await loadSitemap(url);
        const urls = await processSitemap(sitemap);

        const generateRandomID = () => Math.floor(100000 + Math.random() * 900000);
        const usedIDs = new Set();

        urls.forEach((url) => {
            
            let randomID;

            do {
                    
                randomID = generateRandomID();

            } while (
                    
                usedIDs.has(randomID)
            
            );
            
            usedIDs.add(randomID);
            url.id = randomID;
                
        });

        return urls;
                
    };

    const enrichUrlsWithInsights = async (urls) => {

        for (const url of urls) {

            await getPageInsights(url);

        }

        return urls;

    };

    const makeCsv = (data) => {

        let csv = "Title, URL, ID, Heading Validation, WAVE Validation, Slick, Tabcordion, Heading Issue, Missing Page Title, W3C Validation\n";

        data.forEach((row) => {

            csv += `"${row.title}","${row.loc}","A11Y${row.id}","https://validator.w3.org/nu/?showoutline=yes&doc=${row.loc}#headingoutline","https://wave.webaim.org/report#/${row.loc}","${row.hasSlick ? "X" : ""}","${row.hasTabcordion ? "X" : ""}"," ","${row.missingTitle ? "X" : ""}","https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=${row.loc}"\n`;

        });

        return csv;

    };

    const triggerDownload = (csv, file) => {

        const BOM = "\uFEFF"; // UTF-8 BOM
        const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
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

        return enrichUrlsWithInsights(data);

    }).then((data) => {

        const csv = makeCsv(data);
        const domain = location.hostname.replace(/\./g, '-');
        const file = `${domain}-pages.csv`;

        triggerDownload(csv, file);
        statusMessage.textContent = `Complete! Please check your download folder (${file}).`;
    
    });

})();
