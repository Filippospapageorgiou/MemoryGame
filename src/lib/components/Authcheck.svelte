<script lang="ts">
  import { userStore } from "$lib/Entities/User";
  import { goto } from "$app/navigation";

  function goToHome() {
    goto('/');
  }
</script>

{#if $userStore.username}
  <slot />
{:else}
  <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-500 to-pink-600">
    <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <h1 class="text-center text-pink-600 mb-6">You have to be Logged in to Play. Thanks!</h1>
      <button 
        on:click={goToHome}
        class="px-4 py-2 rounded bg-gradient-to-br from-orange-500 to-pink-600 text-white cursor-pointer hover:opacity-90 transition-opacity duration-200"
      >
        Go to Home Page
      </button>
    </div>
  </div>
{/if}