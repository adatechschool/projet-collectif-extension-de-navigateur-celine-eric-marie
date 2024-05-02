/* async function translateText(text, source = "auto", target = "fr") {
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
      console.log(translatedText);
   } catch (error) {
      console.error("Une erreur est survenue:", error.message);
   }
} */

document.body.addEventListener("mouseup", () => {
   let selectedText = window.getSelection().toString();
   if (selectedText !== "") {
      chrome.runtime.sendMessage(
         { type: "selectedText", text: selectedText },
         (response) => {console.log(response)}
      );
   }
});
