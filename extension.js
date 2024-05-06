let task = "auto"; // Définir une valeur par défaut pour la langue source


async function translateText(text, source = "auto", target = "fr") {
   try {

      const res = await fetch("http://localhost:5000/translate", {
         method: "POST",
         body: JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: "text",
            api_key: ""
         }),
         headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
         throw new Error('La réponse du réseau n\'a pas été correcte');
      }

      const data = await res.json();
      const translatedText = data.translatedText;
      document.getElementById("translatedText").value = translatedText;
   } catch (error) {
      console.error('Une erreur est survenue:', error.message);
   }
}

//Input texte à traduire
const ToTranslateInput = document.getElementById("inputTranslate");

//selection de langages
const sourceSelect = document.getElementById("source-language");
const targetSelect = document.getElementById("target-language");

// Sélection du champ de texte
const inputTranslate = document.getElementById("inputTranslate");

// Ajout d'un écouteur d'événement pour la touche "Entrée"
inputTranslate.addEventListener("keydown", function (event) {
   if (event.key === "Enter") {
      const sourceLanguage = sourceSelect.value;
      const targetLanguage = targetSelect.value;
      translateText(ToTranslateInput.value, sourceLanguage, targetLanguage);
   }
});

const buttonTranslate = document.getElementById("buttonTranslate");
buttonTranslate.addEventListener("click", function () {
   const sourceLanguage = sourceSelect.value;
   const targetLanguage = targetSelect.value
   translateText(ToTranslateInput.value, sourceLanguage, targetLanguage);
});

/*
// sélection de langue
const languageDropdown = document.getElementById("language");
languageDropdown.addEventListener("change", function () {
   // Mettre à jour la valeur de la variable task
   task = languageDropdown.value;
});

const languageTarget = document.getElementById("target-language");
languageTarget.addEventListener("change", function () {
   // Mettre à jour la valeur de la variable target
   target = languageTarget.value;
}); */

// Ajout d'un écouteur d'événement pour le clic sur le bouton de recherche Google
document.getElementById("googleTranslate").addEventListener("click", function (e) {
   e.preventDefault();
   const query = document.getElementById("inputTranslate").value;
   if (query) {
      const googleTranslateUrl = `https://translate.google.fr/?sl=auto&tl=fr&text=${encodeURIComponent(query)}`;
      chrome.tabs.create({ url: googleTranslateUrl });
   }
});
document.addEventListener('mouseup', function(event) {
   // Récupérer le texte sélectionné
   var selectedText = window.getSelection().toString().trim();
   if (selectedText !== '') {
       // Traduire le texte sélectionné
       translateText(selectedText);
   }
});
