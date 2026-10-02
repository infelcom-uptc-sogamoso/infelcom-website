import type { NextApiRequest, NextApiResponse } from 'next';
import { IEmail } from '@/interfaces';
import { Resend } from 'resend';

type Data = { message: string } | IEmail[] | IEmail;

const resend = new Resend(process.env.RESEND_API_KEY);

const FIELDS = ['name', 'lastName', 'phone', 'fromEmail', 'institution', 'message'] as const;

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return sendEmail(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const sendEmail = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const body = req.body ?? {};
  if (FIELDS.some((f) => typeof body[f] !== 'string' || body[f].trim().length < 2)) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  const [name, lastName, phone, fromEmail, institution, message] = FIELDS.map((f) =>
    escapeHtml(body[f].trim()),
  );

  try {
    const { error } = await resend.emails.send({
      from: 'infelcom@infelcom.co',
      to: 'infelcom@infelcom.co',
      replyTo: body.fromEmail.trim(),
      subject: `Solicitud de contacto - ${body.name.trim()} ${body.lastName.trim()}`,
      html: `<p>${message}</p><br><p>Atentamente,</p><p><strong>${name} ${lastName}</strong></p>
      <p>${institution}</p><p>${fromEmail}</p><p>${phone}</p>`,
    });
    if (error) throw error;
    return res.status(200).json({ message: 'Se ha enviado tu solicitud de contacto' });
  } catch (error) {
    console.error({ error });
    return res.status(500).json({ message: 'Revisar logs del servidor' });
  }
};
