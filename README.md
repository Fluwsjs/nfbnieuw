# NFB Salon Boekingssysteem

Online boekingssysteem voor NFB Salon in Aerdt.

## Belangrijke functionaliteit

- Online boekingsformulier voor klanten
- Automatische e-mailbevestigingen naar klant en salon
- Automatische toevoeging van afspraken in Microsoft 365 agenda (info@nfbsalon.nl)
- Beheer van beschikbare tijdslots

## Configuratie

Het systeem is nu volledig geconfigureerd voor Microsoft 365:

1. **E-mails** worden verzonden via het Microsoft 365 account (info@nfbsalon.nl)
2. **Afspraken** worden toegevoegd aan de Microsoft 365 agenda (info@nfbsalon.nl)

### Benodigde configuratie in .env.local

```
# Email (Microsoft 365)
EMAIL_SERVER_HOST=smtp.office365.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=info@nfbsalon.nl
EMAIL_SERVER_PASSWORD=your-app-password

# Calendar (Microsoft 365 / Azure)
MICROSOFT_TENANT_ID=your-tenant-id
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_USER_EMAIL=info@nfbsalon.nl
```

## Documentatie

Gedetailleerde instructies voor het configureren van Microsoft 365 zijn te vinden in:

- [MICROSOFT365-SETUP.md](./MICROSOFT365-SETUP.md) - Volledige setup instructies
- [README-OUTLOOK.md](./README-OUTLOOK.md) - Beknopte instructies

## Test scripts

Om te controleren of alles correct werkt:

```bash
# Test Microsoft 365 email
node scripts/test-microsoft365-email.js

# Test Outlook Calendar
node scripts/test-outlook-calendar.js
```

## Ondersteuning

Bij problemen met de configuratie, raadpleeg de troubleshooting secties in de documentatie of neem contact op met de ontwikkelaar.

## Deploy naar Git en Netlify

1. Maak een repository op GitHub aan (bijvoorbeeld `nfbsalon`).
2. Push je lokale code:

```bash
git add .
git commit -m "Setup Netlify CMS en homepage content"
git branch -M main
git remote add origin https://github.com/<jouw-gebruiker>/<jouw-repo>.git
git push -u origin main
```

3. Ga naar [Netlify](https://app.netlify.com/) en kies **Add new site** -> **Import an existing project**.
4. Koppel je GitHub repository.
5. Build instellingen:
   - Build command: `npm run build`
   - Publish directory: leeg laten (Netlify detecteert Next.js automatisch)
6. Voeg je environment variabelen uit `.env.local` toe in Netlify:
   - **Site settings** -> **Environment variables**

## CMS (content manager) voor klant

Er is een Decap CMS (voorheen Netlify CMS) toegevoegd op:

- `/admin`

De homepage content komt uit:

- `content/home.json`

De klant kan in het CMS aanpassen:

- Titel
- Subtitel
- Hero afbeelding

### Netlify CMS activeren

1. Open in Netlify:
   - **Site settings** -> **Identity** -> **Enable Identity**
2. Bij **Registration preferences**:
   - Zet op **Invite only**
3. Open:
   - **Site settings** -> **Identity** -> **Services**
4. Zet **Git Gateway** aan.
5. Nodig je klant uit via:
   - **Identity** -> **Invite users**

Daarna kan de klant inloggen op `https://<jouw-site>.netlify.app/admin`.
