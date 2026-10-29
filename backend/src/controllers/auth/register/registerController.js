import { modelRegister } from "../../../models/register/register.js";
import { checkEmail } from "../../../services/validation/fields.js";
import { validateRegisterFields } from "../../../services/validation/register/registerValidation.js";
import { normEmail, normUsername } from "../../../utils/normalize.js";

export const authRegister = async (request, reply) => {

  if (request.body) {
    request.body.email = normEmail(request.body.email);
    request.body.username = normUsername(request.body.username);
  }

  const ev = checkEmail(request.body?.email);
  if (!ev.ok) return reply.code(400).send({ error: ev.msg });

  const isValidFields = await validateRegisterFields(request, reply);
  if (!isValidFields) return;

  try {
    const user = await modelRegister(request);
    reply.code(201).send({ success: true, userId: user.id });
  } catch (err) {

    if (err.code === '23505') {
      return reply.code(400).send({ error: "L'email ou le nom d'utilisateur est déjà pris" });
    }
    request.log.error(err, 'Erreur dans authRegister :');
    reply.code(500).send({ error: 'Erreur lors de l\'inscription' });
  }
}
