javascript:(async function () {
  const apiKey = prompt("Enter your Groq API key:");
  if (!apiKey) {
    alert("API key is required.");
    return;
  }

  const images = document.querySelectorAll("img");

  for (const img of images) {
    if (img.alt && img.alt.trim() !== "") continue;

    if (
      img.getAttribute("role") === "presentation" ||
      img.getAttribute("aria-hidden") === "true"
    ) continue;

    const imageUrl = img.src.startsWith("http")
      ? img.src
      : new URL(img.src, location.href).href;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: "Provide concise, accessible alt text for this image."
                  },
                  {
                    type: "image_url",
                    image_url: { url: imageUrl }
                  }
                ]
              }
            ],
            max_completion_tokens: 150
          })
        }
      );

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

    } catch (err) {
      console.error("Groq Vision error:", err);
    }
  }

  alert("Alt text generation complete.");
})();
