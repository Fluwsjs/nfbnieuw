# Microsoft Outlook Calendar Integratie - Instructies

Dit document bevat de stappen die je moet volgen om de Microsoft Outlook Calendar integratie voor NFB Salon werkend te krijgen. Door deze integratie worden boekingen automatisch toegevoegd aan je Microsoft 365 agenda.

## Waarom deze update?

De Google Calendar integratie werkte niet correct, met als gevolg dat afspraken niet verschenen in de agenda van NFB Salon. We hebben deze vervangen door een Microsoft Outlook integratie die beter werkt met je bestaande Microsoft 365 omgeving.

## Wat moet je doen?

1. Lees het document `OUTLOOK-CALENDAR-SETUP.md` voor de volledige technische instructies
2. Volg de stappen voor het registreren van een app in de Azure Portal
3. Configureer de app met de juiste permissies
4. Voeg de credentials toe aan het `.env.local` bestand

## Snelle fix (als je geen tijd hebt voor volledige configuratie)

Als je nu snel een werkende website nodig hebt zonder de volledige Outlook integratie:

1. Open het `.env.local` bestand
2. Voeg deze regel toe of wijzig deze naar: `USE_ICALENDAR_FALLBACK=true`
3. Herstart de website

Met deze instelling zal het boekingssysteem gewoon werken en e-mails versturen, maar worden er geen agenda-items gemaakt. Je moet dan handmatig je afspraken beheren op basis van de e-mailnotificaties.

## Testen of het werkt

Nadat je de configuratie hebt gedaan, kun je testen of de integratie werkt:

```bash
node scripts/test-outlook-calendar.js
```

Als alles goed is ingesteld, zie je een bevestiging dat een testafspraak is gemaakt en weer verwijderd.

## Problemen oplossen

### Geen boekingen in de agenda

1. **Controleer de Outlook-instellingen**: Zorg dat de Microsoft Graph credentials correct zijn.
2. **Test de verbinding**: Gebruik het testscript om te zien of er een specifieke foutmelding is.
3. **Logs bekijken**: Als een boeking wordt gemaakt, worden er logs gemaakt die je kunt bekijken voor aanwijzingen.

### E-mails komen wel, afspraken niet

Dit betekent dat de e-mail configuratie goed werkt, maar de Outlook Calendar integratie niet. Controleer de Microsoft credentials in je `.env.local` bestand.

## Hulp nodig?

Als je problemen ondervindt, kun je contact opnemen met de ontwikkelaar voor ondersteuning. Zorg dat je eventuele foutmeldingen uit de logs meestuurt voor een snellere diagnose. 