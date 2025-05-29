(() => {

    const cbName = "tritanopia";
    const cbGraphic = "0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0";
    
    const svgNameSpace = "http://www.w3.org/2000/svg";
    const colorBlindSVG = document.createElementNS(svgNameSpace, "svg");
    const colorBlindDef = document.createElementNS(svgNameSpace, "defs");
    
    const colorBlindFilter = document.createElementNS(svgNameSpace, "filter");
    colorBlindFilter.setAttribute("id", cbName);
  
    const colorBlindMatrix = document.createElementNS(svgNameSpace, "feColorMatrix");
    colorBlindMatrix.setAttribute("in", "SourceGraphic");
    colorBlindMatrix.setAttribute("values", cbGraphic);
  
    colorBlindFilter.appendChild(colorBlindMatrix);
    colorBlindDef.appendChild(colorBlindFilter);
    colorBlindSVG.appendChild(colorBlindDef);
  
    document.body.appendChild(colorBlindSVG);

    const hasColorCSS = document.querySelector("#a11y-pulse-color-blindness");

    if(!hasColorCSS) {

        const colorBlindCSS = document.createElement("link");
        colorBlindCSS.setAttribute("href", "https://radancy.dev/a11y/pulse/component/color.css");
        colorBlindCSS.setAttribute("rel", "stylesheet");
        colorBlindCSS.setAttribute("id", "a11y-pulse-color-blindness");
        document.head.appendChild(colorBlindCSS);

    }
  
    document.body.removeAttribute("data-color-blindness");
    document.body.setAttribute("data-color-blindness", cbName);
  
})();