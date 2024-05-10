let currentSelection = ""; //Variable globale pour stocker le texte selectionné dans la page web
let allLanguages = [];
let allNames = []

//fonction pour traduire une string
async function translateSelectedText(text, source = "auto", target = "fr") {
   try {
      console.log(allNames)
      const res = await fetch("http://localhost:5000/translate", {
         method: "POST",
         body: JSON.stringify({
            q: text,
            source: source,
            target: target,
            format: "text",
            api_key: "",
         }),
         headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
         throw new Error("La réponse du réseau n'a pas été correcte");
      }

      const data = await res.json();
      const translatedText = data.translatedText;
      return translatedText;
   } catch (error) {
      console.error("Une erreur est survenue:", error.message);
   }
}

//Ecouter le message envoyé par content
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
   //Si on reçoit le texte selectionné dans la page web
   if (message.type === "selectedText") {
      //on stocke le texte dans la variable currentSelection
      currentSelection = message.text;
      console.log("2 selection reçu : ", currentSelection);
   }
});

/******************************************************************************************************************************/

// Fonction pour créer ou mettre à jour l'option de menu contextuel
function createOrUpdateContextMenu() {
   allLanguages.forEach((language) => {
      if (language.menuItemId === null) {
         // Créer l'option de menu contextuel pour l'onglet actif
         language.menuItemId = "translateOption_" + language.code;
         chrome.contextMenus.create({
            id: language.menuItemId,
            title: language.name,
            contexts: ["selection"],
         });
      } else {
         // Mettre à jour l'option de menu contextuel pour l'onglet actif
         chrome.contextMenus.update(language.menuItemId, {
            title: language.name,
            contexts: ["selection"],
         });
      }
   });
}

// Écouter les changements d'onglet
chrome.tabs.onActivated.addListener(function (activeInfo) {
   // Mettre à jour l'option de menu contextuel pour l'onglet actif
   createOrUpdateContextMenu();
});

chrome.runtime.onStartup.addListener(async function () {
   const allLanguagesData = await fetch("http://localhost:5000/languages");
   allLanguages = await allLanguagesData.json();
   allLanguages.forEach(oneLanguage => oneLanguage.menuItemId = null);
   allLanguages.sort((a, b) => a.name.localeCompare(b.name));
   allNames = allLanguages.map(oneLanguage => ({[oneLanguage.code]: oneLanguage.name}));
   createOrUpdateContextMenu();
});

/*******************************************************************************************************************************************/

//fonction qui se déclenche dès qu'on clique sur l'option dans le menu
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
   console.log("allLanguages =", allLanguages);
   console.log("menu cliqué, info.menuItemId =", info.menuItemId);
   const targetLanguage = allLanguages.find(
      (language) => info.menuItemId === language.menuItemId
   );
   console.log("langage :", targetLanguage);
   if (targetLanguage) {
      const targetCode = targetLanguage.code;

      const translatedText = await translateSelectedText(
         currentSelection,
         "auto",
         targetCode
      ); //traduit le texte
      console.log("3 Traduction : ", translatedText);

      //on envoie le texte traduit au script content
      chrome.tabs.sendMessage(tab.id, {
         type: "translation",
         translatedText: translatedText,
      });
   }
});
