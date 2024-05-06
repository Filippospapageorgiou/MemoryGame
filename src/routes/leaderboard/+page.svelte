<script lang="ts">
	export let data;
    type LeaderboardEntry = {
        username: string | undefined;
        best_time: number | undefined;
        fewest_attempts: number | undefined;
    };
    // Assuming data.props contains the leaderboard array
    const leaderboard: LeaderboardEntry[] = data.props.leaderboard ?? [];
</script>

<svelte:head>
    <title>LeaderBoard Card GAME</title>
    <link href="https://fonts.googleapis.com/css?family=Archivo|Archivo+Narrow:600" rel="stylesheet">
</svelte:head>

<div class="flex flex-col min-h-screen bg-gradient-to-br from-custom-orange to-custom-pink font-sans text-2xl">
    <header class="flex justify-around items-center p-5 h-11 bg-white shadow-lg">
        <h2 class=" text-custom-pink text-4xl">Leaderboard</h2>
    </header>
    <main class="flex flex-grow justify-center p-5">
        <div class=" w-auto h-auto bg-orange-500 p-5 rounded-lg shadow">
            <div id="leaderboard" class="text-white">
                {#each leaderboard as entry , i}
                <div class="p-2">
                    <p> {++i} {entry.username} - Best Time: {entry.best_time}, Attempts: {entry.fewest_attempts}</p>
                </div>
            {/each}
            </div>
        </div>
    </main>
</div>

