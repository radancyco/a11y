javascript:(function() {
(async () => {
  const apiKey = prompt("Enter your Groq API key:");
  if (!apiKey) return;

  const images = document.querySelectorAll("img");

  for (const img of images) {
    if (img.dataset.aiProcessed) continue; // mark processed images
    img.dataset.aiProcessed = "true";

    // skip unsupported formats
    if (img.src.endsWith(".svg")) continue;

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
            content: [
              { 
                type: "text",
                text: "Generate a concise, meaningful alt text for this image that conveys only the essential content and purpose. " +
                      "Do not include phrases like 'this is an image of' or 'picture of'. " +
                      "Keep it short (under 125 characters if possible) and usable by screen reader users. " +
                      "Focus on content, context, and function."
              },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }],
          max_completion_tokens: 50
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Request failed:", response.status, errText);
        continue;
      }

      const data = await response.json();
      const altText = data.choices?.[0]?.message?.content;
      if (!altText) continue;

      img.alt = altText;

      const desc = document.createElement("div");
      desc.textContent = altText;
      desc.style.fontSize = "0.875rem";
      desc.style.color = "#555";
      desc.style.marginTop = "4px";

      img.insertAdjacentElement("afterend", desc);

      // delay to avoid throttling (2.5 seconds per request)
      await new Promise(r => setTimeout(r, 2500));

    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  alert("Alt text generation complete.");
})();
})();
