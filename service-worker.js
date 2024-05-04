let currentSelection = ""; //Variable globale pour stocker le texte selectionné dans la page web

//fonction pour traduire une string
async function translateSelectedText(text, source = "auto", target = "fr") {
   try {
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


//ajoute l'option dans le menu de contexte Chrome
chrome.contextMenus.create({
   id: "translateOption",
   title: "Traduire",
   contexts: ["selection"],
});

//fonction qui se déclenche dès qu'on clique sur l'option dans le menu
chrome.contextMenus.onClicked.addListener(async function (info, tab) {
   if (info.menuItemId === "translateOption") {
      const translatedText = await translateSelectedText(currentSelection); //traduit le texte
      console.log("3 Traduction : ", translatedText);

      //on envoie le texte traduit au script content
      chrome.tabs.sendMessage(tab.id, {
         type: "translation",
         translatedText: translatedText
      });
   }
});
