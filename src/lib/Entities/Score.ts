import { writable } from "svelte/store";

export interface Score {
    time: number | undefined;
    attempts: number | undefined; 
    username: string | undefined;
}

function createScoreStore(){
    const { subscribe , set } = writable<Score>({time:undefined,attempts:undefined,username:undefined});

    // Function to initialize the store from localStorage, only runs on the client
    function initialize() {
        if (typeof window !== 'undefined') { // Check if running in a browser
        const storedScore = localStorage.getItem('score');
        if (storedScore) {
          set(JSON.parse(storedScore));
        }
        }
    }

    return {
        subscribe,
        setScore: (score: Score) => {
          if (typeof window !== 'undefined') { // Check if running in a browser
            localStorage.setItem('score', JSON.stringify(score)); // Persist score to localStorage
          }
          set(score);
        },
        clearScore: () => {
          if (typeof window !== 'undefined') { // Check if running in a browser
            localStorage.removeItem('score'); // Clear score from localStorage
          }
          set({ time: undefined, attempts: undefined, username: undefined});
        },
        initialize,
      };
}

export const scoreStore = createScoreStore();
scoreStore.initialize();



