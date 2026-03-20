# Microsoft 365 Integratie voor NFB Salon

Dit document bevat de stappen om Microsoft 365 te configureren voor het NFB Salon boekingssysteem, zodat deze zowel e-mails verstuurt via Microsoft 365 als afspraken toevoegt aan de Outlook agenda.

## 1. E-mail configuratie

### 1.1 App-wachtwoord aanmaken

Voor het versturen van e-mails via Microsoft 365 heb je een app-wachtwoord nodig:

1. Log in op [Microsoft 365](https://portal.office.com) met het account info@nfbsalon.nl
2. Ga naar [Security settings](https://account.microsoft.com/security)
3. Klik op "Advanced security options"
4. Scroll naar beneden naar "Additional security" en klik op "App passwords"
5. Klik op "Create a new app password"
6. Geef het een naam (bijv. "NFB Salon Booking System") en klik op "Next"
7. Kopieer het gegenereerde wachtwoord (dit wordt maar één keer getoond!)

### 1.2 E-mail configuratie in .env.local

Voeg de volgende regels toe aan je `.env.local` bestand:

```
EMAIL_SERVER_HOST=smtp.office365.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=info@nfbsalon.nl
EMAIL_SERVER_PASSWORD=jouw-app-wachtwoord
EMAIL_FROM=info@nfbsalon.nl
```

## 2. Outlook Calendar API integratie

De Outlook Calendar integratie vereist een Azure app registratie:

### 2.1 App registreren in Azure

1. Log in bij de [Azure Portal](https://portal.azure.com/) met het account dat geassocieerd is met je Microsoft 365 tenant
2. Ga naar "Azure Active Directory" > "App registrations"
3. Klik op "New registration"
4. Vul de volgende gegevens in:
   - **Naam**: NFB Salon Booking System
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - http://localhost:3000 (voor ontwikkeling)
5. Klik op "Register"

### 2.2 Client Secret aanmaken

1. Ga naar je geregistreerde app
2. Klik op "Certificates & secrets" in het linkermenu
3. Klik op "New client secret"
4. Geef een beschrijving (bijv. "NFB Salon Booking") en kies een vervaldatum
5. Klik op "Add"
6. **BELANGRIJK**: Kopieer de "Value" van de client secret direct, deze wordt maar één keer getoond!

### 2.3 API Permissions instellen

1. Ga naar "API permissions" in het linkermenu van je app
2. Klik op "Add a permission"
3. Kies "Microsoft Graph"
4. Selecteer "Application permissions"
5. Voeg de volgende permissions toe:
   - Calendars.ReadWrite
   - User.Read.All
6. Klik op "Add permissions"
7. Klik op "Grant admin consent for [your tenant]"

### 2.4 Calendar configuratie in .env.local

Voeg de volgende regels toe aan je `.env.local` bestand:

```
MICROSOFT_TENANT_ID=jouw-tenant-id-uit-azure-portal
MICROSOFT_CLIENT_ID=jouw-application-id-uit-azure-portal
MICROSOFT_CLIENT_SECRET=jouw-client-secret-uit-stap-2.2
MICROSOFT_USER_EMAIL=info@nfbsalon.nl
```

De Tenant ID en Client (Application) ID vind je in het "Overview" scherm van je app in Azure.

## 3. Testen

### 3.1 E-mail test

1. Voer het volgende commando uit om te testen of de e-mailconfiguratie werkt:

```bash
node scripts/test-microsoft365-email.js
```

### 3.2 Calendar test

1. Voer het volgende commando uit om te testen of de kalender-integratie werkt:

```bash
node scripts/test-outlook-calendar.js
```

## 4. Troubleshooting

### 4.1 E-mail problemen

- **Authenticatiefout**: Controleer of het app-wachtwoord correct is ingevoerd
- **Throttling/rate limiting**: Microsoft kan verzoeken beperken als er te veel worden gemaakt
- **Account instellingen**: Controleer of je Microsoft 365 account SMTP toestaat

### 4.2 Calendar problemen

- **Authenticatiefout**: Controleer of Tenant ID, Client ID en Secret correct zijn
- **Permissie fout**: Controleer of admin consent is gegeven voor de API permissions
- **Gebruikersaccount**: Controleer of info@nfbsalon.nl een geldige gebruiker is in de tenant

## 5. Alternatief voor Microsoft 365

Als de Microsoft 365 integratie problemen blijft geven, kun je overschakelen naar:

1. **Mailjet voor e-mail**: Configureer de Mailjet sectie in het .env.local bestand
2. **iCalendar bestanden**: Zet `USE_ICALENDAR_FALLBACK=true` in je .env.local bestand

---

Laatste update: 27 maart 2025

 