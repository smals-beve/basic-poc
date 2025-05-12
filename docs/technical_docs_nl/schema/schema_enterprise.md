[Return](../README.md)

## Schema:  Enterprise

**Beschrijving:**  
Objet permettant d'identifier une entreprise dans une déclaration employeur. Seul un des deux numéros (`enterpriseNumber` ou `nssoNumber`) doit obligatoirement être renseigné.

### Gerelateerde Documentatie:

### Schema Eigenschappen:

| Veldnaam                                         | Beschrijving               | 
|--------------------------------------------------|----------------------------|
| [enterpriseNumber](../field/enterpriseNumber.md) | Ondernemingsnummer         | 
| [nssoNumber](../field/nssoNumber.md)             | RSZ-nummer                 |



### Contraintes métier :

* **Condition exclusive** : Un seul des deux numéros peut être complété (`oneOf`).




Stelt de verklaring van de voordelen van een werknemer voor een bezetting van de lijn van de werknemer mogelijk.  
Dit schema bevat verschillende gegevens.





| Veldnaam          | Beschrijving                                     | 
|-------------------|--------------------------------------------------|
| sequenceNbr       | Volgnummer                                       | 
| ServiceType       | Prestatie- of afwezigheidscode                   | 
| startDate         | Datum of begindatum van prestatie of afwezigheid | 
| endDate           | Einddatum van prestatie of afwezigheid           | 
| nbrOfHours        | Aantal uren van prestatie of afwezigheid         | 

### Zakelijke Beperkingen:

* **Verplicht**: Ten minste één voordeel moet worden gedeclareerd.
* **Formaat**: Het datumformaat is `YYYY-MM-DD` en tijd wordt uitgedrukt in uren.

### Anomalieën:

Binnenkort beschikbaar






