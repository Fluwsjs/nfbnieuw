# Mailjet E-mail Configuratie voor NFB Salon

Dit document bevat instructies voor de Mailjet e-mail setup voor het NFB Salon boekingssysteem.

## Huidige Configuratie

De website is ingesteld om e-mails te verzenden via Mailjet:

- **SMTP Server**: in-v3.mailjet.com
- **Poort**: 587
- **Gebruikersnaam**: Je Mailjet API Key
- **Wachtwoord**: Je Mailjet Secret Key
- **Van**: info@nfbsalon.nl

## Belangrijke Voordelen van Mailjet

1. **Betrouwbaarheid**: Hoge bezorgingsgraad voor e-mails
2. **Gratis Tier**: 200 e-mails per dag (6.000 per maand)
3. **Geen SMTP-beperkingen**: Geen problemen met Microsoft 365 SMTP-authenticatie
4. **Analytics**: Bijhouden van geopende e-mails en klikken

## Stappen voor Domeinverificatie

Voor optimale bezorging van e-mails moet je domein (nfbsalon.nl) geverifieerd worden:

1. Log in bij je [Mailjet account](https://app.mailjet.com/account/sender)
2. Ga naar "Afzenders" > "Domeinen"
3. Voeg het domein "nfbsalon.nl" toe
4. Volg de instructies om de SPF en DKIM DNS-records toe te voegen aan je domeinbeheer

## Veiligheid

De API en Secret Keys in je `.env.local` file worden nooit gedeeld of gepubliceerd. Voor extra veiligheid:

1. Stel IP-restricties in bij je Mailjet-account
2. Gebruik alleen de nodige rechten voor je API keys
3. Roteer regelmatig je API keys

## Huidige .env.local Configuratie

```
# Email Configuration - Mailjet
EMAIL_SERVER_HOST=in-v3.mailjet.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=de04fa03cd3221f83a1f286d3ff41c95
EMAIL_SERVER_PASSWORD=454b2d74c2dfa7c584190c260ea9bd5f
EMAIL_FROM=info@nfbsalon.nl
```

**Veiligheidswaarschuwing**: Na het instellen van je website, is het aan te raden om nieuwe API keys te genereren, omdat deze in de chatgeschiedenis zijn gedeeld.

## Testen van de Configuratie

Je kunt de Mailjet configuratie testen met:

```bash
node scripts/test-mailjet.js
```

Of test het volledige boekingsproces:

```bash
node scripts/test-booking-email.js
```

## Probleemoplossing

Als je problemen ondervindt met de Mailjet-configuratie:

1. **Authenticatiefout**: Controleer je API key en Secret key
2. **Fout bij verzenden**: Controleer of je afzender e-mailadres geverifieerd is
3. **E-mails komen niet aan**: Controleer je spam-folder en domeinverificatie

## Limiet Monitoring

Houd je e-mailverbruik in de gaten om binnen de gratis limieten te blijven:

1. Log in bij je [Mailjet Dashboard](https://app.mailjet.com/dashboard)
2. Ga naar "Statistieken" voor je verbruiksoverzicht
3. Stel notificaties in voor wanneer je 80% van je limiet bereikt

## Alternatieven

Als je limieten overschrijdt, overweeg dan:

1. Upgraden naar een betaald Mailjet-abonnement
2. Overschakelen naar een alternatieve provider zoals SendGrid of Mailgun

---

Laatste update: 26 maart 2025 