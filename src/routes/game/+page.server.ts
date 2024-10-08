import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { userStore } from '$lib/Entities/User';

export const load = (async () => {
    
    let currentUser = get(userStore);
    console.log(currentUser);

    return {};
}) satisfies PageServerLoad;