import { writable } from "svelte/store";

interface User {
    username:string | undefined;
    password: string | undefined;
}

function createUserStore(){
    const { subscribe , set } = writable<User>({username:undefined,password:undefined});

    // Function to initialize the store from localStorage, only runs on the client
    function initialize() {
        if (typeof window !== 'undefined') { // Check if running in a browser
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          set(JSON.parse(storedUser));
        }
        }
    }

    return {
        subscribe,
        setUser: (user: User) => {
          if (typeof window !== 'undefined') { // Check if running in a browser
            localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
          }
          set(user);
        },
        clearUser: () => {
          if (typeof window !== 'undefined') { // Check if running in a browser
            localStorage.removeItem('user'); // Clear user from localStorage
          }
          set({ username: undefined, password: undefined});
        },
        initialize,
      };
}

export const userStore = createUserStore();
userStore.initialize(); // Initialize the store from localStorage