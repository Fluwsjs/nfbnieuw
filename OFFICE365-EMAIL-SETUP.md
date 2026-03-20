# Microsoft 365 E-mail Configuratie voor NFB Salon

Dit document bevat gedetailleerde instructies voor het instellen van Microsoft 365 e-mail voor het boekingssysteem van de NFB Salon website.

## Huidige Instellingen

De website is geconfigureerd om e-mails te verzenden via:
- Microsoft 365 (info@nfbsalon.nl)
- SMTP-server: smtp.office365.com
- SMTP-poort: 587
- Beveiliging: STARTTLS

## Probleem: SmtpClientAuthentication Uitgeschakeld

Microsoft heeft recent SMTP-authenticatie standaard uitgeschakeld voor alle Microsoft 365 tenants om de beveiliging te verbeteren. Dit veroorzaakt de volgende foutmelding:

```
Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant. 
Visit https://aka.ms/smtp_auth_disabled for more information.
```

## Oplossing 1: Inschakelen van SMTP-AUTH via PowerShell

1. **Installeer de Exchange Online PowerShell module**:
   ```powershell
   Install-Module -Name ExchangeOnlineManagement
   ```

2. **Maak verbinding met Exchange Online**:
   ```powershell
   Connect-ExchangeOnline
   ```

3. **Controleer de huidige status**:
   ```powershell
   Get-TransportConfig | Select-Object SmtpClientAuthenticationDisabled
   ```

4. **Schakel SMTP-authenticatie in**:
   ```powershell
   Set-TransportConfig -SmtpClientAuthenticationDisabled $false
   ```

5. **Verifieer de wijziging**:
   ```powershell
   Get-TransportConfig | Select-Object SmtpClientAuthenticationDisabled
   ```

6. **Wacht 15-30 minuten** tot de wijziging is doorgevoerd in de hele Microsoft 365-omgeving.

## Oplossing 2: Gebruik App Wachtwoord met MFA

Als je Multi-Factor Authentication (MFA) gebruikt:

1. Ga naar [Microsoft 365 Accountbeveiliging](https://account.microsoft.com/security)
2. Selecteer "Beveiligingsinfo"
3. Kies "App-wachtwoorden" > "Nieuw app-wachtwoord maken"
4. Gebruik dit app-wachtwoord in plaats van je normale wachtwoord in het `.env.local` bestand

## Oplossing 3: Directe SMTP Relay Setup

Als bovenstaande methoden niet werken:

1. Ga naar Exchange Admin Center > Mail Flow > Connectors
2. Maak een nieuwe connector aan die e-mails accepteert van je webserver IP
3. Configureer je website om deze SMTP relay te gebruiken

## Testen van de Configuratie

1. **Test de basale verbinding**:
   ```bash
   node scripts/test-office365.js
   ```

2. **Test het volledige boekingsproces**:
   ```bash
   node scripts/test-booking-email.js
   ```

3. **Maak een test-boeking via de website**

## Alternatieve Oplossingen

Als Microsoft 365 SMTP blijft problemen geven, overweeg deze alternatieven:

1. **SendGrid**: Een betrouwbare e-maildienst die goed werkt met moderne webapplicaties
   - Gratis tier: 100 e-mails per dag
   - Eenvoudig te integreren

2. **Mailgun**: Gericht op transactionele e-mails
   - API-gebaseerd
   - Goede deliverability

3. **Amazon SES**: Goedkope en schaalbare e-maildienst
   - Pay-as-you-go prijsmodel
   - Zeer betrouwbaar

## Huidige .env.local Configuratie

```
# Email Configuration - Microsoft 365
EMAIL_SERVER_HOST=smtp.office365.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=info@nfbsalon.nl
EMAIL_SERVER_PASSWORD=your-password-here
EMAIL_FROM=info@nfbsalon.nl

# Salon Information
SALON_NAME="NFB Salon"
SALON_EMAIL="info@nfbsalon.nl"
SALON_PHONE="+31 6 42967250"
SALON_ADDRESS="Loostraat 7, 6913 AG Aerdt"
OWNER_EMAIL="info@nfbsalon.nl"
```

## Aanbeveling

Onze aanbeveling is om de PowerShell-opdracht uit te voeren om SMTP-authenticatie in te schakelen en vervolgens 15-30 minuten te wachten. Als het probleem aanhoudt, overweeg dan een overstap naar een gespecialiseerde e-mailservice zoals SendGrid.

---

Laatste update: 26 maart 2025 