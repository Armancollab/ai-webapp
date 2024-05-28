async function sendPrompt() {
  const userInput = document.getElementById("userInput").value;
  if (userInput.toLowerCase() === "exit") {
    alert("Exiting...");
  } else {
    try {
      const response = await fetch(
        "https://ai-webapp.onrender.com/generate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      displayMessage("You", userInput);
      displayMessage("Assistant", data.response);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to fetch response from server");
    }
  }
}

function displayMessage(sender, message) {
  const chatDisplay = document.getElementById("chatDisplay");
  const timestamp = new Date().toLocaleTimeString();
  chatDisplay.innerHTML += `<p><strong>${sender} (${timestamp}):</strong> ${message}</p>`;
}

async function speakPrompt() {
  const userInput = await recognizeSpeech();
  document.getElementById("userInput").value = userInput;
  sendPrompt();
}

function readLastResponse() {
  const chatDisplay = document.getElementById("chatDisplay");
  const messages = chatDisplay.getElementsByTagName("p");
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].innerHTML.startsWith("<strong>Assistant")) {
      const response = messages[i].innerText.split(": ")[1];
      const msg = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(msg);
      break;
    }
  }
}

function recognizeSpeech() {
  return new Promise((resolve, reject) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = function (event) {
      resolve(event.results[0][0].transcript);
    };

    recognition.onerror = function (event) {
      reject(event.error);
    };
  });
}
