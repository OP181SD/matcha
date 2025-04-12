

export async function modleRegister (request, reply) {

    const users = await fastify.pg.query('SELECT FROM * users');
    console.log(users);
}

fastify.get('/users',modleRegister);