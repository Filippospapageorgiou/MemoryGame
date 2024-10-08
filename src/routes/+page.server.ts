import { client } from '$lib';
import type { Actions } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';


export const actions = {
    default:async({ request }) => {
        
        const data = await request.formData();
        const username = data.get('username');
        const password = data.get('password');

        if (typeof username !== 'string' || typeof password !== 'string') {
            return fail(400, { message: 'Invalid username or password' });
        }


        console.log(username , password)

        const result = await client.execute({
            sql: "SELECT * FROM user WHERE username = ? AND password = ?",
            args: [username, password]
        }); 
        
        if (result.rows.length === 0) {
            return fail(400, { message: 'Invalid username or password' });
        }else{
            return {
                success:true
            }
        }
    }
}satisfies Actions;