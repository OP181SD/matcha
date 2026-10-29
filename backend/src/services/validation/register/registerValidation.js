

import { checkUsername, checkName, checkPassword } from "../fields.js";

export async function validateRegisterFields(request, reply) {
    const { username, first_name, last_name, password, confirmPassword } = request.body;

    const checks = [
        checkUsername(username),
        checkName(first_name, "Prénom"),
        checkName(last_name, "Nom"),
        checkPassword(password),
    ];
    for (const v of checks) {
        if (!v.ok) {
            reply.code(400).send({ error: v.msg });
            return false;
        }
    }

    if (password !== confirmPassword) {
        reply.code(400).send({ error: "Les mots de passe ne correspondent pas." });
        return false;
    }

    return true;
}
