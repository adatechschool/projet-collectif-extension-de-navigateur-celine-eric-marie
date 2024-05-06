// Fonction pour envoyer le texte sélectionné au script d'arrière-plan
function sendSelectedTextToBackground(selectedText) {
   console.log("1 Text sélectionné : ", selectedText);
   chrome.runtime.sendMessage({
      type: "selectedText",
      text: selectedText,
   });
}


// Écouteur pour capturer le texte sélectionné
document.body.addEventListener("mouseup", () => {
   const selectedText = window.getSelection().toString();
   sendSelectedTextToBackground(selectedText);
});

//Ecouteur de message qui vient du service worker
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
   if (message.type === "translation") {
      //on reçoit le texte traduit
      console.log("4 Texte traduit reçu : ", message.translatedText);
   }
})

