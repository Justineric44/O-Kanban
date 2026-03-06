<script>
  import { Trash2, Pen } from "@lucide/svelte";
  import { deleteCard, updateCard } from "../services/card.service";
  import Markdown from "svelte-exmarkdown";
  import { form } from "../store/form.svelte";
  import ModalForm from "./modals/ModalForm.svelte";
  import ModalConfirm from "./modals/ModalConfirm.svelte";
  import { openModal } from "../utils/modal";
  import { authStore } from "../store/auth.svelte";
  import { callMistral } from "../services/mistral.service";

  let { card, list } = $props();

  let hovered = $state(false);

const editCard = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const text = formData.get("text");

  if (!text || text.trim() === "") {
    alert("Le texte ne peut pas être vide");
    return;
  }

  try {
    const correctedText = await callMistral(
      "Corrige moi les fautes d'orthographe de cette phrase, avec 30 caractères maximum (sans préciser le nombre de caractères et voici la correction), renvoie moi juste le mot corrigé, rien d'autre" + text
    );

    const finalCard = await updateCard({ id: card.id, content: correctedText });
    
    if (finalCard && finalCard.content) {
      card.content = finalCard.content;
      e.target.reset();
      document.getElementById(`edit-card-${card.id}`)?.close();
    }
    
  } catch (err) {
    console.error("Erreur editCard:", err);
    form.error = err.message || "Une erreur s'est produite lors de la mise à jour de la carte.";
  }
};

  const handleDeleteCard = () => {
    try {
      deleteCard(card.id); // Call the deleteCard function to remove it from the server
      list.cards = list.cards.filter((c) => c.id !== card.id); // Remove the deleted card from the local state
    } catch (e) {
      form.error =
        "Une erreur s'est produite lors de la suppression de la carte.";
    }
  };
</script>

<div
  onmouseover={() => {
    hovered = true;
  }}
  onfocus={() => {
    hovered = true;
  }}
  onblur={() => {
    hovered = false;
  }}
  onmouseout={() => {
    hovered = false;
  }}
  role="list"
  class="bg-white shadow-md rounded-lg p-4 flex justify-between items-center relative"
>
  <div class="markdown-body">
    <Markdown md={card.content} />
  </div>
  {#if authStore.user.role.name === "admin"}
  <div
    class={`flex gap-2 absolute right-2 items-center h-full ${hovered ? "opacity-100" : "opacity-0"}`}
  >
    <button
      onclick={() => openModal(`edit-card-${card.id}`)}
      class="bg-yellow-500 text-white h-[50px] px-2 py-1 rounded"
    >
      <Pen />
    </button>
    <ModalForm
      title="Modifier la carte"
      modalId={`edit-card-${card.id}`}
      msg=""
    >
      <div class="flex flex-col gap-2">
        <form onsubmit={editCard}>
          <textarea class="textarea" name="text">{card.content}</textarea>
          <div class="flex justify-center">
            <button class="bg-blue-500 text-white px-2 py-1 rounded"
              >Modifier et corriger</button
            >
          </div>
        </form>
        <form method="dialog">
          <div class="flex justify-center">
            <button class="bg-red-500 text-white px-2 py-1 rounded"
              >Annuler</button
            >
          </div>
        </form>
      </div>
    </ModalForm>
    <button
      onclick={() => openModal(`confirm-delete-card-${card.id}`)}
      class="bg-red-500 text-white px-2 py-1 rounded h-[50px]"
    >
      <Trash2 />
    </button>
    <ModalConfirm
      modalId={`confirm-delete-card-${card.id}`}
      msg="Confirmez que vous souhaitez supprimer cette carte"
      handleConfirm={handleDeleteCard}
    />
  </div>
  {/if}
</div>
