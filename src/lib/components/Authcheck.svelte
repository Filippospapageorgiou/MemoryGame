<script lang="ts">
    import { userStore } from "$lib/Entities/User";
</script>
  
{#if $userStore.username}
  <slot />
{:else}
<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-500 to-pink-600">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-center text-pink-600 mb-6">You have to be Loged in to PLay Thanks!!</h1>
  </div>
</div>
{/if}