javascript: (function() {

    const API_KEY = '1qCtiKYAPcG5xy2BijVzOHQEO8OmqVtup9y2Wk7ZVxsk4traAyHuJQQJ99BCACYeBjFXJ3w3AAAFACOGmDy7'; // Replace with your Azure API key 
    const ENDPOINT = 'https://a11y.cognitiveservices.azure.com'; // Replace with your Azure endpoint

    if (!API_KEY || !ENDPOINT) {

      alert('Please update the script with your Azure API key and endpoint.');

    } else {

      async function selectImage() {
        
        return new Promise((resolve) => {

          document.body.addEventListener('click', function handler(event) {

            if (event.target.tagName === 'IMG') {

              event.preventDefault();

              document.body.removeEventListener('click', handler);

              resolve(event.target);

            }

          }, { once: true });

        });

      }

      async function generateAltText(imageUrl) {

        const response = await fetch(`${ENDPOINT}/vision/v3.2/analyze?visualFeatures=Description`, {

          method: 'POST',

          headers: {

            'Ocp-Apim-Subscription-Key': API_KEY,

            'Content-Type': 'application/json'

          },

          body: JSON.stringify({ url: imageUrl })

        });

        const data = await response.json();

        return data.description?.captions[0]?.text || 'No description available';

      }

      alert('Click on an image to generate alt text.');

      (async function() {

        const img = await selectImage();

        const imageUrl = img.src.startsWith('http') ? img.src : window.location.origin + img.src;

        try {

          const altText = await generateAltText(imageUrl);

          img.alt = altText;

          alert(`Alt text generated: "${altText}"`);

        } catch (error) {

          alert('Error generating alt text. Check API key and endpoint.');

          console.error(error);

        }

      })();

    }

})()