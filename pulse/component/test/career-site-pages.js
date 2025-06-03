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

    const expandUrlSet = (urlset) => {

        const urls = [];
        
        let allowedSubfolders;

        if(careerSitePagesLang === "de") {

            allowedSubfolders = ["/stellenbeschreibung/", "/länderauswahl/", "/beschäftigung/", "/berufsfeld/", "/geschäft/", "/arbeitsort/"];

        } else { 

            allowedSubfolders = ["/job/", "/location/", "/employment/", "/category/", "/business/", "/job-location/"];

        }
        
        const subfolderCounts = {};

        for (const url of urlset.children) {

            const loc = url.querySelector("loc").textContent;
            let found = false;

            for (const subfolder of allowedSubfolders) {

                if (loc.includes(subfolder)) {

                    found = true;
                    subfolderCounts[subfolder] = (subfolderCounts[subfolder] || 0) + 1;

                    if (subfolderCounts[subfolder] <= 5) {

                        urls.push({ loc });

                    }

                    break;

                }

            }

            if (!found) {

                urls.push({ loc });

            }

        }

        return Promise.resolve(urls);

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

    const getPageTitle = async (url) => {

        try {

            const response = await fetch(url);
            const html = await response.text();
            const dom = new DOMParser().parseFromString(html, "text/html");
            const title = dom.querySelector("title").textContent;

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

            return "Title not found";

        }

    };

    // Function to convert sitemap to array of objects

    const convertSitemapToArray = async (url) => {

        const sitemap = await loadSitemap(url);
        const urls = await processSitemap(sitemap);

        for (const url of urls) {

            url.title = await getPageTitle(url.loc);

        }

        return urls;
    };

    const makeCsv = (data) => {

        let csv = "Title, URL, W3C Validation, Error, Heading Validation, Error, Screenshot, WAVE Validation, Errors, Contrast Errors, Screenshot, Radancy Notes, ID\n";
        let ID = 1;

        data.forEach((row) => {

            const paddedID = String(ID).padStart(3, "0");

            csv += `"${row.title}","${row.loc}","https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=${row.loc}"," ","https://radancy.dev/a11y/pulse/headings/?url=${row.loc}"," "," ","https://wave.webaim.org/report#/${row.loc}"," "," "," "," ","A11Y${paddedID}"\n`;

            ID++;

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
