import api from "../api";
export const getLists = async () => api("/lists");
export const createList = async (list) => api("/lists", "POST", list);
export const updateList = async (list) => api(`/lists/${list.id}`, "PATCH", {
title: list.title, position: list.position,
});
export const deleteList = async (listId) => api(`/lists/${listId}`, "DELETE");