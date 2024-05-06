import type { PageServerLoad } from './$types';
import { client } from '$lib';

export const load: PageServerLoad = async () => {
    try {
        const result = await client.execute({
            sql: "SELECT u.username, MIN(s.time) AS best_time, MIN(s.attempts) AS fewest_attempts FROM user u JOIN score s ON u.username = s.username GROUP BY u.username ORDER BY best_time ASC, fewest_attempts ASC;",
            args: []
        });
        return {
            props: {
                leaderboard: result.rows
            }
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return {
            props: {
                error: 'Failed to load leaderboard data.'
            }
        };
    }
};
