## Schema: Service NL

**Beschrijving:**  
Stelt de verklaring van de voordelen van een werknemer voor een bezetting van de lijn van de werknemer mogelijk.  
Dit schema bevat verschillende gegevens.

### Schema Eigenschappen:

| Veldnaam          | Beschrijving                                                               | 
|-------------------|----------------------------------------------------------------------------|
| sequenceNbr       | Volgnummer                                                                 | 
| ServiceType       | Prestatie- of afwezigheidscode                                             | 
| startDate         | Datum of begindatum van prestatie of afwezigheid                           | 
| endDate           | Einddatum van prestatie of afwezigheid                                     | 
| nbrOfHours        | Aantal uren van prestatie of afwezigheid                                   | 

### Zakelijke Beperkingen:

* **Verplicht**: Ten minste één voordeel moet worden gedeclareerd.
* **Formaat**: Het datumformaat is `YYYY-MM-DD` en tijd wordt uitgedrukt in uren.

### Anomalieën:

Binnenkort beschikbaar

### Gerelateerde Documentatie:
[Annex 90018](https://www.socialsecurity.be/portail/glossaires/dmfa.nsf/be8ba64d95a2ed0ec125686200574ff5/3ec8c3acff4dffc1c1258bea003378c9?OpenDocument)

