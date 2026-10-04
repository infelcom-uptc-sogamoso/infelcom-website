import { AccessTime, Mail, Phone, Place, WhatsApp } from '@mui/icons-material';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';

const digits = (phone: string) => phone.replace(/[^\d+]/g, '');

/** Contact list items (address, email, phone, WhatsApp, hours), shared by Contact and Footer. */
export const ContactChannels = ({ iconSize }: { iconSize?: 'small' }) => {
  const { contact } = useContent();
  const { t } = useT();
  const place = [contact.address, contact.city, contact.country].filter(Boolean).join(', ');

  return (
    <>
      {place && (
        <li>
          <Place fontSize={iconSize} aria-hidden />
          <span>{place}</span>
        </li>
      )}
      {contact.email && (
        <li>
          <Mail fontSize={iconSize} aria-hidden />
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </li>
      )}
      {contact.phone && (
        <li>
          <Phone fontSize={iconSize} aria-hidden />
          <a href={`tel:${digits(contact.phone)}`}>{contact.phone}</a>
        </li>
      )}
      {contact.whatsapp && (
        <li>
          <WhatsApp fontSize={iconSize} aria-hidden />
          <a
            href={`https://wa.me/${digits(contact.whatsapp).replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t.contact.whatsapp} ${contact.whatsapp}`}>
            {contact.whatsapp}
          </a>
        </li>
      )}
      {contact.hours && (
        <li>
          <AccessTime fontSize={iconSize} aria-hidden />
          <span>
            <span className="visually-hidden">{t.contact.hours}: </span>
            {contact.hours}
          </span>
        </li>
      )}
    </>
  );
};
