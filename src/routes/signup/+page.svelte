<script lang="ts">
  import { client } from "$lib";
  import { userStore } from "$lib/Entities/User";
  import { goto } from '$app/navigation';
  
  

  let username:string = "";
  let password:string = "";
  let isAvaible:boolean = false;
  let loading = false;

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
  
  $: isValid = username?.length > 2 && username.length < 16 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !isAvaible && !loading

  let debounceTimer:NodeJS.Timeout;

  async function checkAvaibility(){
    isAvaible = false;
    clearTimeout(debounceTimer);
    loading=true;

    debounceTimer = setTimeout(async()=>{
      console.log("checking username");
      const result = await client.execute({
        sql: "SELECT * FROM user WHERE username = ?",
        args: [username]
      });
      if(result.rows.length > 0){
        isAvaible=false;
        loading=false;
      }else{
        isAvaible=true;
        loading=false;
      }      
    },500)
  }

  async function confirmusername(){
      console.log("confirm username",username);
      await client.execute({
        sql: "INSERT INTO user (username, password) VALUES (?, ?)",
        args: [username, password]
      });
      const user = {
        username: username || undefined,
        password: password || undefined
      };
      userStore.setUser(user);
      goto('/game');
  }
</script>

<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-500 to-pink-600">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-center text-pink-600 mb-6">Create an Account</h1>
    <form on:submit|preventDefault={confirmusername}>
      <div class="mb-4">
        <input
          type="text"
          placeholder="Username"
          class="input w-full border-2 rounded p-2 mb-4 focus:outline-none focus:border-orange-500"
          bind:value={username}
          on:input={checkAvaibility}
          class:input-error={!isValid && isTouched}
          class:input-warning={isTaken}
          class:input-success={isAvaible && isValid && !loading}
          required
        />
        {#if !isValid && isTouched}
          <p class="text-error text-sm mt-1 text-red-600 text-bold">Username must be 3-16 characters long, alphanumeric only</p>
        {/if}
        {#if isTaken && isValid && !loading}
          <p class="text-error text-sm mt-1 text-red-600 text-bold">Username is not available</p>
        {/if}
      </div>
      <div class="mb-4">
        <input
          type="password"
          placeholder="Password"
          class="input w-full border-2 rounded p-2 mb-4 focus:outline-none focus:border-orange-500"
          bind:value={password}
          required
        />
      </div>
      <div class="text-center text-pink-600 mb-8">
        <span>Already have an account?</span>
        <a href="/" class="ml-2 no-underline text-orange-500 hover:underline hover:opacity-80">Log in</a>
      </div>
      <div class="my-4">
        {#if loading}
          <p class="text-secondary text-yellow-600 pb-4 text-bold text-center">Checking availability of @{username}...</p>
        {/if}
        <input
        type="submit"
        value={loading ? "Checking username..." : "Register"}
        disabled={isTaken || !isValid || loading || !password}
        class="w-full p-2 rounded text-white transition-all duration-200
          {isTaken || !isValid || loading || !password
            ? 'bg-gradient-to-br from-orange-300 to-pink-400 hover:opacity-90 cursor-not-allowed'
            : 'bg-gradient-to-br from-orange-500 to-pink-600 hover:opacity-90 cursor-pointer'
          }"
      />
      </div>
    </form>
  </div>
</div>
