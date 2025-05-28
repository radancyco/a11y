javascript: (function () {

    const newWindow = window.open(document.location, "", "width=1280,height=1024");

    // Ensure the new window has loaded before applying styles

    if (newWindow) {
  
        newWindow.onload = function () {
        
           //  newWindow.document.documentElement.style.zoom = "400%";
  
        };

    }

})();

