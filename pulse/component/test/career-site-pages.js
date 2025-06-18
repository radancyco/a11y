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
  
    // Data Attributes
  
    var careerSitePagesLang = careerSitePages.getAttribute("data-lang");

    // Function to load the sitemap from URL

    const loadSitemap = async (url) => {

        try {

            const response = await fetch(url);
            const text = await response.text();
            return (new DOMParser()).parseFromString(text, "text/xml");

        } catch (error) {}

    };

    // Function to expand the URL set

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
        if (careerSitePagesLang === "de") {
            return loc.includes("/stellenbeschreibung/");
        } else if (careerSitePagesLang === "fr") {
            return loc.includes("/emploi/");
        } else if (careerSitePagesLang === "pt-br") {
            return loc.includes("/vaga/");
        } else {
            return loc.includes("/job/");
        }
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
        const pathParts = new URL(loc).pathname.split("/").filter(Boolean);
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
    }

    for (const subfolder in subfolderPageLists) {
    let subfolderRegularIncluded = 0;
    let subfolderAjdIncluded = 0;
    let subfolderOtherIncluded = 0;

    for (const loc of subfolderPageLists[subfolder]) {
        if (isJobPage(loc)) {
            const hasAjd = await checkAjdInput(loc);

            if (hasAjd && subfolderAjdIncluded < 2) {
                urls.push({ loc, ajd: true });
                subfolderAjdIncluded++;
            } else if (!hasAjd && subfolderRegularIncluded < 2) {
                urls.push({ loc });
                subfolderRegularIncluded++;
            }
        } else if (subfolderOtherIncluded < 2) {
            urls.push({ loc });
            subfolderOtherIncluded++;
        }

        // Updated break condition
        if ((subfolderAjdIncluded + subfolderRegularIncluded) >= 2 && subfolderOtherIncluded >= 2) {
            break;
        }
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

    return urls;
};


    
    // Function to process the sitemap

    const processSitemap = (sitemap) => {

        sitemap = sitemap.documentElement;

        switch (sitemap.tagName) {

            case "urlset":

            return expandUrlSet(sitemap);

            default:

            return Promise.resolve([]);

        }

    };

    // Function to retrieve the title of a webpage given its URL

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
    
            // Check for elements with "slick" in class

            const hasSlick = !!dom.querySelector('[class*="slick"]') || !!dom.querySelector('[class*="slide"]');
            urlObj.hasSlick = hasSlick;

            // Check for Tabcordion

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
    
    // Function to convert sitemap to array of objects

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

    // Function to trigger CSV download

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

    // Call the functions to convert sitemap to array, convert to CSV, and trigger download

    // Split pathname into segments

    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Check if the first segment looks like a language code
    
    const isLangFolder = /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0]);

    // Build sitemap URL
    
    const sitemapUrl = isLangFolder ? `${location.origin}/${pathSegments[0]}/sitemap.xml` : `${location.origin}/sitemap.xml`;

    convertSitemapToArray(sitemapUrl).then((data) => {
    
        const csv = makeCsv(data);
        const domain = location.hostname.replace(/\./g, '-');
        const file = `${domain}-pages.csv`;

        triggerDownload(csv, file);
        statusMessage.textContent = `Complete! Please check your download folder (${file}).`;
    
    });

})();
