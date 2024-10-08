<script lang="ts">
    interface LeaderboardEntry {
        username: string;
        best_time: number;
        fewest_attempts: number;
    }

    export let data: { leaderboard: LeaderboardEntry[] };

    const leaderboard = data.leaderboard ?? [];
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
                {#each leaderboard as { username, best_time, fewest_attempts }, i}
                    <div class="p-2">
                        <p>{i + 1}. {username} - Best Time: {best_time}, Attempts: {fewest_attempts}</p>
                    </div>
                {/each}
            </div>
        </div>
    </main>
</div>