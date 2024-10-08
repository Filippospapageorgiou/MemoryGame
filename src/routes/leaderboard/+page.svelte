<script lang="ts">
    import type { PageData } from "./$types";
	export let data: PageData;
</script>

<svelte:head>
    <title>LeaderBoard Card GAME</title>
    <link href="https://fonts.googleapis.com/css?family=Archivo|Archivo+Narrow:600" rel="stylesheet">
</svelte:head>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-custom-orange to-custom-pink font-sans text-2xl">
    <header class="flex justify-around items-center p-5 h-11 bg-white shadow-lg">
        <h2 class="text-custom-pink text-4xl">Leaderboard</h2>
    </header>
    
    <main class="flex flex-grow justify-center p-5">
        <div class="w-auto h-auto bg-orange-500 p-5 rounded-lg shadow">
            <div id="leaderboard" class="text-white">
                {#each data.leaderboard as entry, i}
                <div class="p-2">
                    <p> {i + 1}. {entry.username ?? 'Unknown User'} - Best Time: {entry.best_time ?? 'N/A'}, Attempts: {entry.fewest_attempts ?? 'N/A'}</p>
                </div>
                {/each}
            </div>
        </div>
    </main>
</div>
