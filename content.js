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

function createTranslationModal(translationDialog, translationText) {
  translationDialog = document.createElement("dialog");
  translationText = document.createElement("p");
  translationText.classList.add("paragraphe");
  translationDialog.setAttribute("id", "translation-dialog");
  translationText.setAttribute("id", "translation-text");
  const closeForm = document.createElement("form");
  const closeButton = document.createElement("button");
  closeButton.classList.add("buttonClose");
  closeButton.append("FERMER");

  closeForm.setAttribute("method", "dialog");
  closeForm.append(closeButton);

  translationDialog.append(translationText, closeForm);
  document.body.append(translationDialog);
}

function setTranslation(translation) {
  let translationDialog = document.getElementById("translation-dialog");
  let translationText = document.getElementById("translation-text");

  translationText.textContent = "";
  //on ajoute chaque paragraphe en transformant les "\n" en <br>
  const translationArray = translation.split("\n");
  translationArray.forEach((translationPiece) => {
    const linebreak = document.createElement("br");
    translationText.append(translationPiece);
    translationText.append(linebreak);
  });
  translationDialog.setAttribute("open", "");
}

//Fonction pour afficher le texte dans une balise <dialog>
function displayTranslationModal(translation) {
  let translationDialog = document.getElementById("translation-dialog");
  let translationText = document.getElementById("translation-text");

  if (!translationDialog)
    createTranslationModal(translationDialog, translationText);

  setTranslation(translation);
}

//Ecouteur de message qui vient du service worker
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "translation") {
    //on reçoit le texte traduit
    console.log("4 Texte traduit reçu : ", message.translatedText);
    displayTranslationModal(message.translatedText);
  }
});
