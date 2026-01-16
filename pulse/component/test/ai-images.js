javascript:(function() {(async () => {

  const apiKey = prompt("Enter your Groq API key:");

  if (!apiKey) {

    return;

  }

  // Ask user for a custom AI prompt

  const userPrompt = prompt("Enter a custom AI prompt for alt text generation.\nClick Cancel to use the default prompt.");

  // Default prompt if user cancels or leaves blank

  const defaultPrompt = "Generate concise, meaningful alternative text for this image that conveys only the essential content and purpose. " +
  "Do not include phrases like 'this is an image of' or 'picture of'. " +
  "Keep it short (under 150 characters if possible) and usable by screen reader users. " +
  "Focus on content, context, and function.";

  const finalPrompt = userPrompt && userPrompt.trim() !== "" ? userPrompt : defaultPrompt;

  const images = document.querySelectorAll("img");

  let anchorCounter = 1; // start anchor numbering

  for (const img of images) {

    if (img.dataset.aiProcessed) {

      continue; // mark processed images

    }

    img.dataset.aiProcessed = "true";

    // skip unsupported formats

    if (img.src.endsWith(".svg")) {

      continue;

    }

    const imageUrl = img.src.startsWith("http") ? img.src : new URL(img.src, location.href).href;

    console.log("Calling Groq for:", imageUrl);

    try {

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    
        method: "POST",
        headers: {

          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`

        },

        body: JSON.stringify({

          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [{

            role: "user",
            content: [{

              type: "text",
              text: finalPrompt

            },{ 
            
              type: "image_url", 
              image_url: { 
              
                url: imageUrl } 
            
            }]
          
          }], max_completion_tokens: 50

        })

      });

      if (!response.ok) {

        const errText = await response.text();
        console.error("Request failed:", response.status, errText);
        continue;

      }

      const data = await response.json();
      const altText = data.choices?.[0]?.message?.content;

      if (!altText) {

        continue;

      }

      // remove all hrefs on page so that alt text can be grabbed if nested in a link 

      document.querySelectorAll("a").forEach((link) => {
  
        link.removeAttribute("href");

      });


      // assign anchor name to image

      img.style.cssText = `anchor-name: --image-anchor-${anchorCounter};`;

      // create div containing block

      const descWrapper = document.createElement("div");

      descWrapper.style.cssText = `position-anchor: --image-anchor-${anchorCounter}; position: absolute; inset-block-start: anchor(bottom); z-index: 2147483646;`;

      // append span to wrapper div

      const span = document.createElement("span");

      span.setAttribute("aria-hidden", "true");
      span.style.cssText = "background-color: rebeccapurple; block-size: 20px; inline-size:  20px; inset-block-start: calc(10rem / 16); inset-inline-start: calc(30em / 16); position: absolute; transform: rotate(45deg);";

      // create description div with multiple styles in one block

      const descParent = document.createElement("div");

      descParent.style.cssText = "background-color: rebeccapurple; border-radius: 5px; border: 1px #fff solid; color: #fff; font-size: large; inline-size: calc(260em / 16); margin: 1em; max-inline-size: calc(520em / 16); outline: 1px #000 solid; overflow: hidden; padding: 1em; resize: both;";

      // wrap AI-generated content in child div with unique ID

      const content = document.createElement("div");

      content.id = `ai-alt-text-${anchorCounter}`;
      content.textContent = altText;

      descWrapper.prepend(span);
      descParent.append(content);
      descWrapper.append(descParent);
      img.insertAdjacentElement("afterend", descWrapper);

      anchorCounter++; // increment for next image

      // delay to avoid throttling (2.5 seconds per request)

      await new Promise((r) => { 
        
        setTimeout(r, 2500); 
      
      });

      } catch (err) {

        console.error("Fetch failed:", err);

      }

    }

    alert("Alternative text generation complete.");

  })();

})();