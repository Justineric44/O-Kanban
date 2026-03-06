import { StatusCodes } from "http-status-codes";
import "dotenv/config";


export async function createPrompt(req, res) {
  const formattedMessages = {
    role: "user",
    content: req.body.prompt,
  }


  const response = await fetch(
    `${process.env.MISTRAL_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${process.env.MISTRAL_MODEL}`,
        messages: [formattedMessages],
      }),
    },
  );
  if (response.ok) {
    // récupère la réponse
    const result = await response.json();
    const repMistral = result.choices[0].message.content;
    res.status(StatusCodes.OK).json(repMistral);
  } else {
    console.error("Erreur API");
  }
}

export async function createSpellCheck(req, res) {


  const response = await fetch(
    `${process.env.MISTRAL_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${process.env.MISTRAL_MODEL}`,
        messages: [
          {
            role: "system",
            content: "Ne réponds que par le texte corrigé, aucune phrase d'introduction et aucun symbole et de commentaire."
          },
          {
            role: "user",
            content: "Corrige automatiquement l'orthographe et la grammaire. Ne réponds que par le texte corrigé." + req.body.text
          }

        ],
      }),
    },
  );
  if (response.ok) {
    // récupère la réponse
    const result = await response.json();
    res.send(result);
    console.log(result.choices)
  } else {
    console.error("Erreur API");
  }
}

export async function createTranslate(req, res) {
  const response = await fetch(
    `${process.env.MISTRAL_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${process.env.MISTRAL_MODEL}`,
        messages: [
          {
            role: "system",
            content: "Ne réponds que par le texte traduit, aucune phrase d'introduction et aucun symbole et de commentaire."
          },
          {
            role: "user",
            content: "Traduis automatiquement " + req.body.text + " en " + req.body.lang
          }

        ],
      }),
    },
  );
  if (response.ok) {
    // récupère la réponse
    const result = await response.json();
    res.json(result.choices[0].message.content);
  } else {
    console.error("Erreur API");
  }
}

