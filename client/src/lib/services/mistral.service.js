import api from "../api";
export const callMistral = async (repMistral) => api("/mistral/prompt", "POST", { prompt: repMistral });

// export const callMistral = async (repMistral) => {
//   api(
//     "/mistral/prompt",
//     "POST",
//     JSON.stringify({ text: "repMistral" }) // enveloppe le texte dans un objet JSON
//   );
// };





