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
    
    statusContainerMsg.textContent = "Loading. Please be patient. Maybe go make a sandwhich.";

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

            if (careerSitePagesLang === "de") return ["/berufsfeld/", "/l%c3%a4nderauswahl/", "/besch%c3%a4ftigung/", "/firma/", "/stellenbeschreibung/", "/arbeitsort/"];
            if (careerSitePagesLang === "fr") return ["/cat%c3%a9gorie/", "/lieu/", "/emplois/", "/entreprise/", "/emploi/", "/lieu-de-travail/"];
            if (careerSitePagesLang === "pt-br") return ["/%c3%a1rea/", "/localiza%c3%a7%c3%a3o/", "/firma/", "/vaga/", "/sub-localização/"];
            return ["/job/", "/location/", "/employment/", "/category/", "/business/", "/job-location/"];

        })();

        const isJobPage = (loc) => {

            if (careerSitePagesLang === "de") return loc.includes("/stellenbeschreibung/");
            if (careerSitePagesLang === "fr") return loc.includes("/emploi/");
            if (careerSitePagesLang === "pt-br") return loc.includes("/vaga/");
            return loc.includes("/job/");

        };

        const currentPath = window.location.pathname;
        const subfolderPrefix = currentPath.split('/').filter(Boolean)[0];
        const expectedPrefix = `${window.location.origin}/${subfolderPrefix}/`;

        if (urlElements.length && urlElements[0].querySelector("loc") && urlElements[0].querySelector("loc").textContent === window.location.origin && subfolderPrefix) {

            urlElements[0].querySelector("loc").textContent = expectedPrefix;

        }

        for (const url of urlElements) {

            const loc = url.querySelector("loc").textContent;
            let found = false;

            for (const subfolder of allowedSubfolders) {

                if (loc.includes(subfolder)) {
                    found = true;

                    if (isJobPage(loc)) {

                        // Check if job limits are already met

                        if (ajdJobsIncluded >= 2 && regularJobsIncluded >= 2) {

                            // ✅ Skip job checks — limits met

                            break;

                        }

                        // Fetch page only if limits not met

                        const hasAjd = await checkAjdInput(loc);

                        if (hasAjd && ajdJobsIncluded < 2) {

                            ajdJobsIncluded++;

                            urls.push({ loc, ajd: true });

                        } else if (!hasAjd && regularJobsIncluded < 2) {

                            regularJobsIncluded++;
                            urls.push({ loc });

                        }

                    } else {

                        subfolderCounts[subfolder] = (subfolderCounts[subfolder] || 0) + 1;

                        if (subfolderCounts[subfolder] <= 2) {

                            urls.push({ loc });

                        }
                    }

                    break;
                }
            }

            if (!found) {

                urls.push({ loc });

            }

            // 🔥 Exit early if all limits are met for jobs and subfolders

            const allSubfoldersDone = allowedSubfolders.every(

                (sub) => (subfolderCounts[sub] || 0) >= 2

            );

            if (

                ajdJobsIncluded >= 2 &&
                regularJobsIncluded >= 2 &&
                allSubfoldersDone

            ) {

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

            if (isAjd) title += " (AJD)";

            const isCmsContent = dom.querySelector('meta[name="career-site-page-type"][content="ContentPage-CMS"]');

            if (isCmsContent) title += " (CMS Content)";

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
            li.classList.add = "status-error";

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

        let csv = "ID, Title, URL, Heading Validation, WAVE Validation, Slick, Tabcordion, Heading Issue, Missing Page Title, W3C Validation\n";

        data.forEach((row) => {

            csv += `"A11Y${row.id}","${row.title}","${row.loc}","https://validator.w3.org/nu/?showoutline=yes&doc=${row.loc}#headingoutline","https://wave.webaim.org/report#/${row.loc}","${row.hasSlick ? "X" : ""}","${row.hasTabcordion ? "X" : ""}"," ","${row.missingTitle ? "X" : ""}","https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=${row.loc}"\n`;

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
