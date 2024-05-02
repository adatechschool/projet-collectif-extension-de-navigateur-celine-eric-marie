function translateText(text, targetLanguage) {
    let apiKey ="0e60bf6a-0931-4bc3-b3b2-985176a015c8:fx";
    let url =  "https://api-free.deepl.com/v2/translate";

    // Construction des données de la requête
    let formData = new FormData();
    formData.append('source_lang', 'EN');
    formData.append('target_lang', targetLanguage);
    formData.append('text', [text]);

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
    .then(res => console.log(res))
    .catch(error => {
      console.error('Erreur lors de la traduction :', error);
    });
  }

  translateText("hello", "fr")