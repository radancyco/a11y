(() => {
  "use strict";

  // === CONFIGURABLE LIMITS ===
  const maxAjdJobs = 5;
  const maxRegularJobs = 10;
  const maxPerSubfolder = 5;

  const shadowHost = document.querySelector("a11y-pulse-component");
  const shadowContainer = shadowHost.shadowRoot;
  const ul = document.createElement("ul");
  const statusContainer = shadowContainer.querySelector(".status-container--career-site-pages");
  statusContainer.appendChild(ul);
  const statusList = shadowContainer.querySelector(".status-container--career-site-pages ul");
  const statusMessage = shadowContainer.querySelector(".status-message--career-site-pages");
  const careerSitePages = document.getElementById("career-site-pages");
  const careerSitePagesLang = careerSitePages.getAttribute("data-lang");

  // Load sitemap
  const loadSitemap = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/xml");
  };

  // Check if page has AJD input
  const checkAjdInput = async (loc) => {
    try {
      const response = await fetch(loc);
      if (!response.ok) return false;
      const html = await response.text();
      const dom = new DOMParser().parseFromString(html, "text/html");
      return dom.querySelector("input#ajdType") !== null;
    } catch {
      return false;
    }
  };

  // Expand sitemap
  const expandUrlSet = async (urlset) => {
    const urls = [];
    const subfolderCounts = {};
    let ajdJobsIncluded = 0;
    let regularJobsIncluded = 0;

    const allowedSubfolders = (() => {
      if (careerSitePagesLang === "de") {
        return ["/berufsfeld/", "/l%c3%a4nderauswahl/", "/besch%c3%a4ftigung/", "/firma/", "/stellenbeschreibung/", "/arbeitsort/"];
      } else if (careerSitePagesLang === "fr") {
        return ["/cat%c3%a9gorie/", "/lieu/", "/emplois/", "/entreprise/", "/emploi/", "/lieu-de-travail/"];
      } else if (careerSitePagesLang === "pt-br") {
        return ["/%c3%a1rea/", "/localiza%c3%a7%c3%a3o/", "/firma/", "/vaga/", "/sub-localização/"];
      } else {
        return ["/job/", "/location/", "/employment/", "/category/", "/business/", "/job-location/"];
      }
    })();

    const isJobPage = (loc) => {
      if (careerSitePagesLang === "de") return loc.includes("/stellenbeschreibung/");
      if (careerSitePagesLang === "fr") return loc.includes("/emploi/");
      if (careerSitePagesLang === "pt-br") return loc.includes("/vaga/");
      return loc.includes("/job/");
    };

    const urlElements = Array.from(urlset.getElementsByTagName("url"));

    const promises = urlElements.map(async (urlNode) => {
      const loc = urlNode.querySelector("loc").textContent;

      if (isJobPage(loc)) {
        const hasAjd = await checkAjdInput(loc);
        if (hasAjd && ajdJobsIncluded < maxAjdJobs) {
          ajdJobsIncluded++;
          urls.push({ loc, ajd: true });
        } else if (!hasAjd && regularJobsIncluded < maxRegularJobs) {
          regularJobsIncluded++;
          urls.push({ loc });
        }
      } else {
        const matchedFolder = allowedSubfolders.find((sub) => loc.includes(sub));
        if (matchedFolder) {
          subfolderCounts[matchedFolder] = (subfolderCounts[matchedFolder] || 0) + 1;
          if (subfolderCounts[matchedFolder] <= maxPerSubfolder) {
            urls.push({ loc });
          }
        }
      }
    });

    await Promise.all(promises);
    return urls;
  };

  // Process sitemap
  const processSitemap = (sitemap) => {
    sitemap = sitemap.documentElement;
    if (sitemap.tagName === "urlset") {
      return expandUrlSet(sitemap);
    }
    return Promise.resolve([]);
  };

  // Get page title
  const getPageTitle = async (urlObj) => {
    const url = urlObj.loc;
    const isAjd = urlObj.ajd;

    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new DOMParser().parseFromString(html, "text/html");
      const titleElement = dom.querySelector("title");
      const paddedID = String(urlObj.id).padStart(3, "0");
      const title = titleElement && titleElement.textContent.trim() !== "" ? titleElement.textContent : `No Page Title - A11Y${paddedID}`;

      urlObj.missingTitle = !titleElement || titleElement.textContent.trim() === "";
      urlObj.title = isAjd ? `${title} (AJD)` : title;

      const isCmsContent = dom.querySelector('meta[name="career-site-page-type"][content="ContentPage-CMS"]');
      if (isCmsContent) urlObj.title += " (CMS Content)";

      urlObj.hasSlick = !!dom.querySelector('[class*="slick"]') || !!dom.querySelector('[class*="slide"]');
      urlObj.hasTabcordion = !!dom.querySelector('[class*="tab-accordion"]') || !!dom.querySelector('[class*="tabcordion"]');

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

      return urlObj.title;
    } catch {
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
      urlObj.missingTitle = true;
      urlObj.title = `Title not found - A11Y${urlObj.id || "000"}`;

      return urlObj.title;
    }
  };

  // Convert sitemap to array
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
      await getPageTitle(url);
    }

    return urls;
  };

  // Make CSV
  const makeCsv = (data) => {
    let csv = "ID, Title, URL, Heading Validation, WAVE Validation, Slick, Tabcordion, Heading Issue, Missing Page Title, W3C Validation\n";

    data.forEach((row) => {
      csv += `"A11Y${row.id}","${row.title}","${row.loc}","https://validator.w3.org/nu/?showoutline=yes&doc=${row.loc}#headingoutline","https://wave.webaim.org/report#/${row.loc}","${row.hasSlick ? "X" : ""}","${row.hasTabcordion ? "X" : ""}"," ","${row.missingTitle ? "X" : ""}","https://validator.w3.org/nu/?showsource=yes&showoutline=yes&showimagereport=yes&doc=${row.loc}"\n`;
    });

    return csv;
  };

  // Trigger CSV download
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

  // Run it
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isLangFolder = /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0]);
  const sitemapUrl = isLangFolder ? `${location.origin}/${pathSegments[0]}/sitemap.xml` : `${location.origin}/sitemap.xml`;

  convertSitemapToArray(sitemapUrl).then((data) => {
    const csv = makeCsv(data);
    const domain = location.hostname.replace(/\./g, "-");
    const file = `${domain}-pages.csv`;

    triggerDownload(csv, file);
    statusMessage.textContent = `Complete! Please check your download folder (${file}).`;
  });
})();
