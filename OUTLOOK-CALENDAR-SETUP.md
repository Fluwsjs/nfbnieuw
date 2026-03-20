# Microsoft Outlook Calendar Integratie voor NFB Salon

Dit document bevat instructies voor het opzetten van de Microsoft Outlook Calendar integratie voor het NFB Salon boekingssysteem. Deze integratie vervangt de eerdere Google Calendar configuratie.

## Voordelen van Microsoft Outlook Calendar

1. **Naadloze integratie met Microsoft 365**: Directe koppeling met je bestaande Microsoft 365 omgeving
2. **Betrouwbaarheid**: Robuuste API integratie
3. **Gebruiksgemak**: Afspraken automatisch zichtbaar in je Outlook agenda
4. **Verbeterde beveiliging**: Single sign-on met je Microsoft account 

## Vereisten

Om de Outlook Calendar integratie op te zetten heb je nodig:

1. Een Microsoft 365 zakelijk of Enterprise account
2. Admin-rechten in het Microsoft 365 portaal
3. Een Microsoft Azure account (kan gratis worden aangemaakt)

## Stap 1: Registreer een app in Microsoft Azure

1. Log in bij de [Azure Portal](https://portal.azure.com/)
2. Ga naar "Azure Active Directory" > "App registrations"
3. Klik op "New registration"
4. Vul de volgende gegevens in:
   - **Naam**: NFB Salon Booking System
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web - http://localhost:3000 (voor ontwikkeling)
5. Klik op "Register"

## Stap 2: Creëer een Client Secret

1. Ga naar je geregistreerde app
2. Klik op "Certificates & secrets" in het linkermenu
3. Klik op "New client secret"
4. Geef een beschrijving (bijv. "Booking System") en kies een vervaldatum
5. Klik op "Add"
6. **BELANGRIJK**: Kopieer de "Value" van de client secret onmiddellijk. Deze wordt maar één keer getoond!

## Stap 3: API Permissions instellen

1. Ga naar "API permissions" in het linkermenu van je app
2. Klik op "Add a permission"
3. Kies "Microsoft Graph"
4. Selecteer "Application permissions"
5. Voeg de volgende permissions toe:
   - Calendars.ReadWrite
   - User.Read.All
6. Klik op "Add permissions"
7. Klik op "Grant admin consent for [your tenant]"

## Stap 4: Configuratie in de applicatie

Voeg de volgende omgevingsvariabelen toe aan je `.env.local` bestand:

```
MICROSOFT_TENANT_ID=jouw-tenant-id-van-azure
MICROSOFT_CLIENT_ID=jouw-application-id-van-azure
MICROSOFT_CLIENT_SECRET=jouw-client-secret-van-azure
MICROSOFT_USER_EMAIL=info@nfbsalon.nl
```

Je kunt de Tenant ID en Client ID vinden in het "Overview" scherm van je geregistreerde app in Azure.

## Stap 5: Test de integratie

Gebruik het meegeleverde testscript om te controleren of de integratie werkt:

```bash
node scripts/test-outlook-calendar.js
```

Als alles goed is geconfigureerd, zie je een succesmelding en wordt er een testafspraak aangemaakt en direct weer verwijderd uit je Outlook Calendar.

## Troubleshooting

### Probleem: Authenticatiefout

```
❌ Fout bij ophalen token: [AuthenticationError]
```

**Oplossing**: Controleer of je Tenant ID, Client ID en Client Secret correct zijn. Verifieer ook of de API permissions correct zijn ingesteld en admin consent is verleend.

### Probleem: Kalender niet gevonden

```
❌ Fout bij kalender operaties: [statusCode: 404]
```

**Oplossing**: Controleer of het e-mailadres in MICROSOFT_USER_EMAIL correct is en of dit account bestaat in je Microsoft 365 tenant.

### Probleem: Onvoldoende rechten

```
❌ Fout bij kalender operaties: [statusCode: 403]
```

**Oplossing**: Controleer of de API permissions correct zijn ingesteld en of admin consent is verleend voor deze app.

## Wat te doen bij problemen

Als je problemen ondervindt met de Outlook Calendar integratie:

1. **Controleer de API credentials**: Verifieer dat alle omgevingsvariabelen correct zijn ingesteld
2. **Test met het testscript**: Gebruik het testscript voor gedetailleerde foutmeldingen
3. **Check API permissions**: Verifieer dat alle benodigde permissions zijn toegekend
4. **Controleer Azure logs**: Bekijk de logs in het Azure portal voor meer informatie

## Alternatieve oplossing: iCalendar bestanden

Als de directe integratie met Outlook Calendar niet lukt, kun je als alternatief kiezen voor het versturen van iCalendar (.ics) bestanden als bijlage bij de bevestigingsmail. Deze kunnen klanten direct importeren in hun kalender (Google, Outlook, Apple, etc.).

Dit vereist een andere implementatie, waarbij het boekingssysteem iCalendar bestanden genereert en deze meestuurt met de bevestigingsmail.

---

Laatste update: 27 maart 2025 