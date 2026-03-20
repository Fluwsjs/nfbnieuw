# E-mail Configuratie voor NFB Salon Website

Dit document bevat instructies voor het instellen van de e-mailconfiguratie voor het boekingssysteem van de NFB Salon website.

## Huidige Configuratie

De website is ingesteld om e-mails te verzenden via:
- Microsoft 365 (info@nfbsalon.nl)
- SMTP-server: smtp.office365.com
- SMTP-poort: 587
- Beveiliging: STARTTLS

## Stap 1: Controleer Microsoft 365 Account Instellingen

Zorg ervoor dat je Microsoft 365 account juist is ingesteld om SMTP-e-mails toe te staan:

1. Login op [Microsoft 365 Admin Center](https://admin.microsoft.com)
2. Ga naar "Gebruikers" > "Actieve gebruikers"
3. Selecteer het account (info@nfbsalon.nl)
4. Ga naar het tabblad "E-mail" en controleer of SMTP is ingeschakeld

Als je geavanceerde authenticatie gebruikt (MFA):
1. Ga naar [Microsoft 365 Account Security](https://account.microsoft.com/security)
2. Maak een "App wachtwoord" aan voor de website
3. Gebruik dit app wachtwoord in het .env.local bestand (niet je normale wachtwoord)

## Stap 2: Controleer de .env.local File

In de productieomgeving moet de `.env.local` file de volgende instellingen bevatten:

```
# Email Configuration
EMAIL_SERVER_HOST=smtp.office365.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=info@nfbsalon.nl
EMAIL_SERVER_PASSWORD=je-wachtwoord-hier
EMAIL_FROM=info@nfbsalon.nl

# Salon Information
SALON_NAME="NFB Salon"
SALON_EMAIL="info@nfbsalon.nl"
SALON_PHONE="+31 6 42967250"
SALON_ADDRESS="Loostraat 7, 6913 AG Aerdt"
OWNER_EMAIL="info@nfbsalon.nl"
```

## Stap 3: Testen in Productie

Na het instellen van de configuratie in je productieomgeving, test de e-mailfunctionaliteit:

1. Maak een testboeking via de website
2. Controleer of zowel de klant als de eigenaarsbevestiging correct worden verzonden
3. Controleer of de e-mails correct aankomen (inbox, spam folder)

## Problemen Oplossen

Als e-mails niet worden verzonden:

1. **Authenticatieproblemen**: 
   - Controleer gebruikersnaam en wachtwoord
   - Bij MFA ingeschakeld, gebruik een app-wachtwoord
   - Controleer of het account geblokkeerd is na meerdere mislukte inlogpogingen

2. **Poortproblemen**:
   - Als poort 587 niet werkt, probeer poort 25
   - Controleer of je hosting provider uitgaande verbindingen op deze poorten toestaat

3. **E-mailvolumebeperkingen**:
   - Microsoft 365 heeft limieten voor het aantal e-mails dat je kunt verzenden
   - Bij hoog volume, overweeg een speciale e-mailverzendservice zoals SendGrid of Mailgun

4. **SSL/TLS problemen**:
   - Zorg ervoor dat je server over de juiste SSL-certificaten beschikt
   - In noodgevallen kan `NODE_TLS_REJECT_UNAUTHORIZED=0` helpen, maar gebruik dit niet in productie

## Logging en Debugging

In de huidige configuratie is debug-logging ingeschakeld in de e-mailtransporter. Dit is nuttig tijdens testfasen maar kan in productie worden uitgeschakeld:

```javascript
// In src/lib/email.ts
const transporter = nodemailer.createTransport({
  // ... andere configuratie ...
  debug: false, // Zet op false in productie
  logger: false  // Zet op false in productie
});
```

## Testen van E-mail Configuratie

Je kunt de e-mailconfiguratie testen door het testscript uit te voeren:

```
node scripts/test-email.js
```

Of simuleer een volledige boeking met:

```
node scripts/test-booking-email.js
```

## Verdere Verbeteringen

Voor de toekomst zijn er enkele mogelijke verbeteringen aan het e-mailsysteem:

1. E-mailsjablonen in aparte bestanden
2. HTML-e-mails met betere opmaak en responsief ontwerp
3. E-mail wachtrij voor betrouwbaarheid bij hoog volume
4. Alternatieven zoals SendGrid of Mailgun voor hoge deliverability

---

Laatste update: 26 maart 2025 