import { component$, useStore, $ } from "@builder.io/qwik";
import type { User } from "~/types/User";

export default component$(() => {
  const state = useStore<{
    users: User[];
    name: string;
    email: string;
    editingId: number | null;
  }>({
    users: [],
    name: "",
    email: "",
    editingId: null,
  });

  const addUser = $(() => {
    if (state.name && state.email) {
      if (state.editingId === null) {
        state.users.push({
          id: Date.now(),
          name: state.name,
          email: state.email,
        });
      } else {
        const user = state.users.find((user) => user.id === state.editingId);
        if (user) {
          user.name = state.name;
          user.email = state.email;
        }
        state.editingId = null;
      }

      state.name = "";
      state.email = "";
    }
  });

  const removeUser = $((id: number) => {
    state.users = state.users.filter((user) => user.id !== id);
  });

  const editUser = $((user: User) => {
    state.name = user.name;
    state.email = user.email;
    state.editingId = user.id;
  });

  return (
    <div>
      <h1>CRUD com Qwik</h1>

      <input
        type="text"
        placeholder="Nome"
        value={state.name}
        onInput$={(e) => (state.name = (e.target as HTMLInputElement).value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={state.email}
        onInput$={(e) => (state.email = (e.target as HTMLInputElement).value)}
      />
      <button onClick$={addUser}>
        {state.editingId === null ? "Adicionar Usuário" : "Salvar Alterações"}
      </button>

      <ul>
        {state.users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <button onClick$={() => editUser(user)}>Editar</button>
            <button onClick$={() => removeUser(user.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
});
