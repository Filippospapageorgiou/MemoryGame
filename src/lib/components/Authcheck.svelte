<script lang="ts">
    import { onMount } from 'svelte';
    import { userStore } from '$lib/Entities/User';
  
    let isAuthenticated: boolean = false;
  
    // Subscription to authStore to check user authentication status
    const unsubscribe = userStore.subscribe(($userStore) => {
      isAuthenticated = $userStore.username !== null;
    });
  
    onMount(() => {
      return () => {
        unsubscribe();
      };
    });
</script>
  
{#if isAuthenticated}
  <slot />
{:else}
  <p>You are not authenticated.</p>
{/if}