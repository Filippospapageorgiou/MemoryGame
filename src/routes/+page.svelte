<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/Entities/User";
  import type { ActionResult } from "@sveltejs/kit";

  

  interface User {
    username: string | undefined;
    password: string | undefined;
  }

  let user: User = {
    username: undefined,
    password: undefined,
  };

  let error = '';

  function handleSubmit(){
    return async ({ result }: { result: ActionResult }) => {
      if (result.type === 'success') {
        userStore.setUser(user);
        goto('/game');
      } else if (result.type === 'failure') {
        error = result.data?.message || 'Login failed';
        userStore.setUser(user);
      }
    };
  };

</script>

<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-500 to-pink-600">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-center text-pink-600 mb-6">Login To Play Card Game</h1>
    <form method="post" use:enhance={handleSubmit}>
      <input name="username" type="text" bind:value={user.username} placeholder="username" class="input w-full border-2 rounded p-2 mb-4 focus:outline-none focus:border-orange-500" required>
      <input name="password" type="password" bind:value={user.password} placeholder="password" class="input w-full border-2 rounded p-2 mb-4 focus:outline-none focus:border-orange-500" required>
      {#if error}
        <p class="text-red-500 mb-4">{error}</p>
      {/if}
      <div class="text-center text-pink-600 mb-6">
        <span>Don't Have an account?</span>
        <a href="/signup" class="ml-2 no-underline text-orange-500 hover:underline hover:opacity-80">Sign up</a>
      </div>
      <button type="submit" class="w-full p-2 rounded bg-gradient-to-br from-orange-500 to-pink-600 text-white cursor-pointer hover:opacity-90">
        Login
      </button>
    </form>
  </div>
</div>