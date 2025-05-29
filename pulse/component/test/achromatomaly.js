(() => {

    const svgNS = "http://www.w3.org/2000/svg";
  
    const colorBlindSVG = document.createElementNS(svgNS, "svg");
    colorBlindSVG.setAttribute("id", "color-blindness-filter");
  
    const colorBlindDef = document.createElementNS(svgNS, "defs");
  
    const colorBlindFilter = document.createElementNS(svgNS, "filter");
    colorBlindFilter8.setAttribute("id", "achromatomaly");
  
    const colorBlindMatrix = document.createElementNS(svgNS, "feColorMatrix");
    colorBlindMatrix8.setAttribute("in", "SourceGraphic");
    colorBlindMatrix8.setAttribute("values", "0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0");
  
    colorBlindFilter.appendChild(colorBlindMatrix8);
    colorBlindDef.appendChild(colorBlindFilter8);
    colorBlindSVG.appendChild(colorBlindDef);
  
    document.body.appendChild(colorBlindSVG);
  
    document.body.removeAttribute("data-color-blindness");
    document.body.setAttribute("data-color-blindness", "achromatomaly");

  })();
  
  
