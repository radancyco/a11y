(() => {
  "use strict";

  const shadowHost = document.querySelector("a11y-pulse-component");
  const shadowContainer = shadowHost.shadowRoot;
  const ul = document.createElement("ul");
  const statusContainer = shadowContainer.querySelector(".status-container--career-site-pages");
  statusContainer.appendChild(ul);

  const statusList = shadowContainer.querySelector(".status-container--career-site-pages ul");
  const statusMessage = shadowContainer.querySelector(".status-message--career-site-pages");

  const careerSitePages = document.getElementById("career-site-pages");
  const careerSitePagesLang = careerSitePages.getAttribute("data-lang");

  // Load Sitemap
  const loadSitemap = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return new DOMParser().parseFromString(text, "text/xml");
  };

  // ✅ STEP 1: Build Target URL List (Small Subset)
  const getTargetUrls = async (urlset) => {
    const urls = [];
    let allowedSubfolders;

    if (careerSitePagesLang === "de") {
      allowedSubfolders = ["/stellenbeschreibung/"];
    } else if (careerSitePagesLang === "fr") {
      allowedSubfolders = ["/emploi/"];
    } else if (careerSitePagesLang === "pt-br") {
      allowedSubfolders = ["/vaga/"];
    } else {
      allowedSubfolders = ["/job/"];
    }

    let ajdJobsIncluded = 0;
    let regularJobsIncluded = 0;

    const checkAjdInput = async (loc) => {
      try {
        const response = await fetch(loc);
        const html = await response.text();
        const dom = new DOMParser().parseFromString(html, "text/html");
        return dom.querySelector("input#ajdType") !== null;
      } catch {
        return false;
      }
    };

    const urlElements = Array.from(urlset.getElementsByTagName("url"));

    const promises = urlElements.map(async (urlNode) => {
      const loc = urlNode.querySelector("loc").textContent;

      const isJob = allowedSubfolders.some((sub) => loc.includes(sub));
      if (isJob) {
        const hasAjd = await checkAjdInput(loc);
        if (hasAjd && ajdJobsIncluded < 2) {
          ajdJobsIncluded++;
          urls.push({ loc, ajd: true });
        } else if (!hasAjd && regularJobsIncluded < 2) {
          regularJobsIncluded++;
          urls.push({ loc });
        }
      }
    });

    await Promise.all(promises);
    return urls;
  };

  const processSitemap = (sitemap) => {
    sitemap = sitemap.documentElement;
    if (sitemap.tagName === "urlset") {
      return getTargetUrls(sitemap);
    }
    return Promise.resolve([]);
  };

  // ✅ STEP 2: Traverse Only Target Pages
  const getPageTitle = async (urlObj) => {
    const url = urlObj.loc;
    const isAjd = urlObj.ajd;

    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new DOMParser().parseFromString(html, "text/html");

      const titleElement = dom.querySelector("title");
      const paddedID = String(urlObj.id).padStart(3, "0");
      const title = titleElement && titleElement.textContent.trim() !== ""
        ? titleElement.textContent
        : `No Page Title - A11Y${paddedID}`;

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
    } catch (error) {
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
      const fallbackTitle = `Title not found - A11Y${urlObj.id || "000"}`;
      urlObj.title = fallbackTitle;

      return fallbackTitle;
    }
  };

  const convertToCsv = async (urlList) => {
    const generateRandomID = () => Math.floor(100000 + Math.random() * 900000);
    const usedIDs = new Set();

    for (const url of urlList) {
      let randomID;
      do {
        randomID = generateRandomID();
      } while (usedIDs.has(randomID));
      usedIDs.add(randomID);
      url.id = randomID;
      url.title = await getPageTitle(url);
    }

    let csv = "ID, Title, URL, Heading Validation, WAVE Validation, Slick, Tabcordion, Heading Issue, Missing Page Title, W3C Validation\n";

    urlList.forEach((row) => {
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

  // ✅ START HERE
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isLangFolder = /^[a-z]{2}(-[A-Z]{2})?$/.test(pathSegments[0]);
  const sitemapUrl = isLangFolder ? `${location.origin}/${pathSegments[0]}/sitemap.xml` : `${location.origin}/sitemap.xml`;

  loadSitemap(sitemapUrl)
    .then(processSitemap)
    .then(convertToCsv)
    .then((csv) => {
      const domain = location.hostname.replace(/\./g, '-');
      const file = `${domain}-pages.csv`;
      triggerDownload(csv, file);
      statusMessage.textContent = `Complete! Check your download folder (${file}).`;
    });

})();
