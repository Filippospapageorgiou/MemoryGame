<script lang="ts">
  import { writable } from 'svelte/store';
  import { goto } from "$app/navigation";
  import Authcheck from '$lib/components/Authcheck.svelte';
  import { userStore } from '$lib/Entities/User';
  import { scoreStore } from '$lib/Entities/Score';
  import { client } from '$lib';
  

  

  // Define card types
  interface Card {
    emoji: string;
    flipped: boolean;
    matched: boolean;
    id: number; // Added for key tracking in Svelte's {#each}
  }

  interface Score {
    username: string | undefined;
    attempts: number | undefined;
    time: number | undefined;
  }

  let endGame: boolean = false;

  // Store for cards using Svelte's writable
  let cards = writable<Card[]>([]);
  

  // Emoji cards
  let groupCards: string[] = ['🦄','🍦','🌈','👽','👾','🤖','👹','👺','💩','💨'];
  let SizeCards:number = groupCards.length;
  let Totaldiscovers:number = 0;
  const totalCards: string[] = groupCards.concat(groupCards);

  // Game state variables
  let play: boolean = false;
  let chronometro: ReturnType<typeof setInterval>;
  let seconds: number = 0;
  let minutes: number = 0;
  let attempts: number = 0;

  // Shuffle and distribute cards
  function shuffleCards(): string[] {
    return [...totalCards].sort(() => Math.random() - 0.5);
  }

  function distributeCards(): void {
    let shuffledCards: string[] = shuffleCards();
    cards.set(shuffledCards.map((card, index) => ({ emoji: card, flipped: false, matched: false, id: index })));
  }

  // Flip card logic
  function flipCard(clickedCard: Card): void {
    cards.update(allCards => {
      return allCards.map(card => card.id === clickedCard.id ? {...card, flipped: !card.flipped} : card);
    });
    checkForMatch();
  }

  // Check for matches
  function checkForMatch(): void {
    let flippedCards: Card[] = [];
    cards.update(allCards => {
      flippedCards = allCards.filter(card => card.flipped && !card.matched);
      if (flippedCards.length === 2) {
        attempts++;
        if (flippedCards[0].emoji === flippedCards[1].emoji) {
          // Add matched cards to disappear after they are matched
          setTimeout(() => {
            cards.update(current => current.map(card => 
              flippedCards.includes(card) ? {...card, matched: true, flipped: false} : card
            ));
          }, 500); // Short delay before disappearing
          Totaldiscovers++;
          if(Totaldiscovers === SizeCards){
            let score: Score = {
              username: $userStore.username,
              attempts: attempts,
              time: seconds + (minutes * 60)
            };
            scoreStore.setScore(score);
            endGame = true;
            play = false;
            clearInterval(chronometro);
          }
        } else {
          setTimeout(() => {
            cards.update(current => current.map(card => 
              flippedCards.includes(card) ? {...card, flipped: false} : card
            ));
          },500);
        }
      }
      return allCards;
    });
  }

  // Start game logic
  function startGame(): void {
    play = true;
    endGame=false;
    attempts = 0;
    seconds = 0;
    minutes = 0;
    Totaldiscovers = 0;
    distributeCards();
    startTimer();
  }

  // Timer logic
  function startTimer(): void {
    clearInterval(chronometro);
    chronometro = setInterval(() => {
      seconds++;
      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
    }, 1000);
  }

   
  async function handleSubmit() {
    try {
        let timeSumbit = $scoreStore.time || 0;
        let attemptsSumbit = $scoreStore.attempts || 0;
        let usernameSumbit = $scoreStore.username || ' ';
        await client.execute({
            sql: "INSERT INTO score (time,attempts,username) VALUES (?, ?,?)",
            args: [timeSumbit , attemptsSumbit , usernameSumbit]
        });
        startGame();
      } catch (error:any) {
        console.error('Fetch error:', error.message);
      }
    }


  // Navigation functions
  async function gotoLeaderboard(): Promise<void> {
    goto("/leaderboard");
  }

  async function logout(): Promise<void> {
    userStore.clearUser();
    goto("/");
  }
</script>





<Authcheck>
  <header class="px-4 py-2 bg-white shadow flex justify-between items-start text-sm">
    <div class="flex">
      <div class="mr-6">
        <div class="uppercase font-display font-semibold leading-tight text-gray-400">ATTEMPTS</div>
        <div class="font-display text-custom-pink font-light text-4xl leading-tight">
          <span>{attempts}</span>
        </div>
      </div>
  
      <div>
        <h4 class="uppercase font-display font-semibold leading-tight text-gray-400">Time</h4>
        <div class="font-display text-custom-pink font-light text-4xl leading-tight">
          <span>{seconds}</span>:<span>{minutes}</span>
        </div>
      </div>
    </div>
  
    <div class="flex items-center mt-2 mr-6 text-custom-pink font-display text-4xl leading-none">
      <button on:click={gotoLeaderboard} class="flex items-center justify-center px-4 py-1.5 mr-3 text-lg bg-custom-pink text-white rounded-full no-underline hover:text-custom-orange transition-colors duration-300">Leaderboard</button>
      <button on:click={logout} class="flex items-center justify-center px-4 py-1.5 mr-3 text-lg bg-custom-pink text-white rounded-full no-underline hover:text-custom-orange transition-colors duration-300">Log Out</button>
      Welcome, <span id="playerName">{$userStore.username}</span>
    </div>
  </header>

{#if play === false && endGame === false}
<div class="flex flex-col items-center justify-center min-h-screen pb-10">
  <h1 class="text-4xl text-custom-pink font-display mb-4">Are you ready to play Memory game?</h1>
  <h2 class="text-2xl text-custom-pink font-display mb-4">Click 2 Cards see if its alike and try to make the best time</h2>
  <h3 class="text-xl text-custom-pink font-display mb-4">Good Luck!</h3>
  <button on:click={startGame}  class="px-6 py-3 bg-custom-orange text-white rounded-full font-display text-xl hover:bg-gradient-to-t from-custom-pink to-custom-orange hover:text-white transition duration-300 ease-in-out">Play</button>
</div>
{:else if play === true}
<main class="flex flex-col items-center justify-center min-h-screen">
  <div class="table pb-10">
    {#each $cards as card (card.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="card" class:matched="{card.matched}" class:discover="{card.flipped || card.matched}" on:click="{() => !card.matched && flipCard(card)}">
        <div class="card__content">{card.flipped || card.matched ? card.emoji : ''}</div>
      </div>
    {/each}
  </div>
</main>
{:else if endGame === true && play === false}
<div class="flex flex-col items-center justify-center min-h-screen pb-10">
  <div class=" absolute bg-gradient-to-t from-custom-pink to-custom-orange text-orange-100 w-auto h-auto p-20
              text-center shadow-lg" >
      <h2 class="text-4xl font-bold text-white">Congratulations! <span>{$userStore.username}</span> </h2>
      <h2>Stats:</h2>
      <p>Attempts: {attempts}</p>
      <p>Time: {seconds}s {minutes}m</p>
      <button on:click={handleSubmit} class="px-6 py-3 bg-custom-orange text-white rounded-full font-display text-xl hover:bg-gradient-to-t from-custom-pink to-custom-orange hover:text-white transition duration-300 ease-in-out">Play Again</button> 
  </div>
</div>
{/if}
</Authcheck>

<style>

  :root {
    --bg: #fafafa;
    --font: "Archivo", sans-serif;
    --font-display: "Archivo Narrow", sans-serif;
    --hotpink: #e94057;
    --orange: #f27121;
    --gradient: linear-gradient(35deg, var(--orange), var(--hotpink));
  }


.card {
  width: 5rem;
  height: 5rem;
  margin: 0.5rem;
  border-radius: 0.3em;
  background-image: var(--gradient);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25), 4px 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: 0.3s;
  cursor: pointer;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.card__content{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  transform: rotateY(-180deg);
  backface-visibility: hidden;
  background-color: white;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25), 4px 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: 0.3em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem;
  padding-top: 0.4rem;
}

.discover {
  transform: rotateY(-180deg);
}

@keyframes accurate {
    from {
      transform: rotateY(-180deg) scale3d(1, 1, 1);
      opacity: 1;
    }

    25% {
      transform: rotateY(-180deg) scale3d(1.1, 1.1, 1.1);
      opacity: 1;
    }

    to {
      transform: rotateY(-180deg) scale3d(1, 1, 1);
      opacity: 0;
    }
  }

  .table {
    position: fixed;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    align-content: center;
    max-width: 35rem;
    margin: auto;
  }

  
  /* Additional CSS for matched cards */
  .card.matched {
    animation: accurate 1.3s ease-in-out forwards; 
  }
</style>
