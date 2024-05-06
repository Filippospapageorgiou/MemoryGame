<script lang="ts">
  import { goto } from '$app/navigation';
  import { client } from '$lib';
  import { userStore } from '$lib/Entities/User';
  let username: string = "";
  let password: string = "";

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const isAuthenticated = await authenticate(username, password);

    if (isAuthenticated) {
      goto("/game");
    } else {
      alert("Invalid username or password");
    }
  }

  async function authenticate(username: string, password: string): Promise<boolean> {
    try {
      const result = await client.execute({
        sql: "SELECT * FROM user WHERE username = ? AND password = ?",
        args: [username, password]
      });
      const user = {
        username: username || undefined,
        password: password || undefined
      }
      userStore.setUser(user);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database query failed:', error);
      return false;
    }
  }
</script>

<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-500 to-pink-600">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-center text-pink-600 mb-6">Login-In To Play Card Game</h1>
    <form on:submit={handleSubmit}>
      <input name="username" type="text" bind:value={username} placeholder="username" class="input w-full border-2 rounded p-2 focus:outline-none focus:border-orange-500" required>
      <input name="password" type="password" bind:value={password} placeholder="password" class="input w-full border-2 rounded p-2 focus:outline-none focus:border-orange-500" required>
      <div class="text-center text-pink-600 mb-6">
        <span>Don't Have an account</span>
        <a href="/signup" class="ml-2 no-underline text-orange-500 hover:underline hover:opacity-80">Sign-in</a>
      </div>
      <input type="submit" value="Login-In" class="w-full p-2 rounded bg-gradient-to-br from-orange-500 to-pink-600 text-white cursor-pointer hover:opacity-90">
    </form>
  </div>
</div>
