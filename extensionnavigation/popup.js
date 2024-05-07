document.addEventListener('DOMContentLoaded', function() {
    let inputText = document.getElementById('inputText');
    let targetLanguage = document.getElementById('targetLanguage');
    let translateButton = document.getElementById('translateButton');
    let translationResult = document.getElementById('translationResult');
  
    translateButton.addEventListener('click', function() {
      let textToTranslate = inputText.value;
      let language = targetLanguage.value;
  
      // Appel à l'API de traduction avec la clé d'API
      translateText(textToTranslate, language);
    });
  
    function translateText(text, targetLanguage) {
      let apiKey ="0e60bf6a-0931-4bc3-b3b2-985176a015c8:fx";
      let url =  "https://api-free.deepl.com/v2/translate";
  
      // Construction des données de la requête
      let formData = new FormData();
      formData.append('source_lang', 'EN');
      formData.append('target_lang', targetLanguage);
      formData.append('text', [text]);

      document.addEventListener('mouseup', function(event) {
        var selectedText = window.getSelection().toString().trim();
        if (selectedText !== '') {
            translateText(selectedText, 'fr'); 
        }
        });

      fetch(url, {
        method: 'POST',
        mode: "no-cors",
        headers: {
        'Access-Control-Allow-Origin': "*",
          'Authorization': 'DeepL-Auth-Key ' + apiKey
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        // Afficher le résultat de la traduction dans #translationResult
        translationResult.textContent = "Texte traduit : " + data.translations[0].text;
      })
      .catch(error => {
        console.error('Erreur lors de la traduction :', error);
        translationResult.textContent = "Erreur lors de la traduction. Veuillez réessayer.";
      });
    }
});
