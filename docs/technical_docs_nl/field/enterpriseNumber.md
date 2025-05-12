[Return](../README.md)

## Veld : enterpriseNumber

**Beschrijving :**  

Nummer dat een werkgever eenduidig identificeert, of het nu gaat om een natuurlijk persoon, een groepering van natuurlijke personen of een rechtspersoon.

### Externe Documentatie

[Glossarium - 00014 - ONDERNEMINGSNUMMER](https://www.socialsecurity.be/portail/glossaires/dmfa.nsf/56d13fe0587c9d6dc1256b210060ae6a/10f0d84de7fae4fcc1258bea00337b64?OpenDocument)


### Gegevens van het veld:

* **Type :** integer
* **Formaat :** numeriek
* **Lengte :** 10 cijfers
* **Verwachte structuur :**

  * Posities 1 tot 8 : volgnummer (positie 1 begint met 0 of 1)
  * Posities 9 en 10 : controlecijfers
* **Standaardwaarde als onbekend :** 0

### Anomalieën:

**Binnenkort beschikbaar**

#### Gedetailleerd voorbeeld van een anomalie (Niet numeriek)

| Foutcode | Beschrijving                    | Ernst            |
| -------- |---------------------------------|------------------|
| 002      | Niet numeriek                   | B                |

**Voorbeeld van de JSON-reactie**

```json
{
  "type": "urn:problem-type:belgif:resourceNotFound",
  "href": "https://www.belgif.be/specification/rest/api-guide/problems/resourceNotFound.html",
  "instance": "2LKKKTUPIOUOI",
  "status": 400,
  "title": "Not Processed Due to Errors",
  "detail": "There are issues in the pocessed form",
  "issues": [
      {
        "in": "Enterprise/enterpriseNumber",
        "name": "enterpriseNumber",
        "detail": "004 - Invalid check digit",
        "value": "012345AAAA"
      }
  ]
}
```



