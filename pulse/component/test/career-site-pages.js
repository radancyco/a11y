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
        
        let allowedSubfolders;
    
        if (careerSitePagesLang === "de") {

            allowedSubfolders = ["/berufsfeld/", "/l%c3%a4nderauswahl/", "/besch%c3%a4ftigung/", "/firma/", "/stellenbeschreibung/", "/arbeitsort/"];

        } else if (careerSitePagesLang === "pt-br") {

            allowedSubfolders = ["/%c3%a1rea/", "/localiza%c3%a7%c3%a3o/", "/firma/", "/vaga/", "/sub-localização/"];

        } else {

            allowedSubfolders = ["/job/", "/location/", "/employment/", "/category/", "/business/", "/job-location/"];

        }
    
        const subfolderCounts = {};
        let ajdJobsIncluded = 0;
        let regularJobsIncluded = 0;
    
        const isJobPage = (loc) => {

            return careerSitePagesLang === "de" ? loc.includes("/berufsfeld/") : loc.includes("/job/");

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
    
        const urlElements = Array.from(urlset.children);

        // Determine subfolder from current page

        const currentPath = window.location.pathname;
        const subfolderPrefix = currentPath.split('/').filter(Boolean)[0];
        const expectedPrefix = `${window.location.origin}/${subfolderPrefix}/`;

        // Adjust the first <loc> if needed

        if (
            
            urlElements.length &&
            urlElements[0].querySelector("loc") &&
            urlElements[0].querySelector("loc").textContent === window.location.origin &&
            subfolderPrefix

        ) {
    
            // Replace root URL with subfolder URL
    
            urlElements[0].querySelector("loc").textContent = expectedPrefix;

        }

        // Now map over the updated elements

        const promises = urlElements.map(async (url) => {

            const loc = url.querySelector("loc").textContent;

            let found = false;
    
            for (const subfolder of allowedSubfolders) {

                if (loc.includes(subfolder)) {

                    found = true;
    
                    if (isJobPage(loc)) {
                        const hasAjd = await checkAjdInput(loc);
    
                        if (hasAjd && ajdJobsIncluded < 5) {

                            ajdJobsIncluded++;
                            urls.push({ loc, ajd: true });

                        } else if (!hasAjd && regularJobsIncluded < 5) {

                            regularJobsIncluded++;
                            urls.push({ loc });

                        }
    
                        break;

                    } else {

                        subfolderCounts[subfolder] = (subfolderCounts[subfolder] || 0) + 1;

                        if (subfolderCounts[subfolder] <= 5) {

                            urls.push({ loc });

                        }

                        break;

                    }

                }

            }
    
            if (!found) {

                urls.push({ loc });

            }

        });
    
        await Promise.all(promises);
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
            li.classList.add = "status-error";
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
