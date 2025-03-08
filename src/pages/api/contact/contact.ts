import type { NextApiRequest, NextApiResponse } from 'next';
import { IEmail } from '@/interfaces';
import { Resend } from 'resend';

type Data = { message: string } | IEmail[] | IEmail;

const resend = new Resend(process.env.RESEND_API_KEY);

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return sendEmail(req, res);
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

const sendEmail = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { name, lastName, phone, fromEmail, institution, message } = req.body;
    await resend.emails.send({
      from: 'infelcom@infelcom.co',
      to: 'infelcom@infelcom.co',
      subject: `Solicitud de contacto - ${name} ${lastName}`,
      html: `<p>${message}</p><br><p>Atentamente,</p><p><strong>${name} ${lastName}</strong></p>
      <p>${institution}</p><p>${fromEmail}</p><p>${phone}</p>`,
    });
    return res.status(200).json({ message: 'Se ha enviado tu solicitud de contacto' });
  } catch (error) {
    console.error({ error });
    return res.status(400).json({ message: 'Revisar logs del servidor' });
  }
};
