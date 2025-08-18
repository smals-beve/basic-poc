## Champ : nssoNumber

**Description :**
Numéro unique permettant d'identifier une entreprise employeur.

### Détails du champ :

* **Type :** integer
* **Format :** numérique
* **Longueur :** 9 chiffres
* **Structure attendue :**
    * Positions 1 à 7 : numéro d'ordre (position 1 commence par 0 ou 1)
    * Positions 8 et 9 : chiffres de contrôle
* **Valeur par défaut si inconnue :** 0

### Contraintes métier :

* **Domaine de definition** :    Nombre entier et élément de [100006;199999934] pour les numéros définitifs.

### Anomalies

#### enterpriseNumber

| Code anomalie | Description                        | Gravité |
|---------------|------------------------------------|---------|
| 002           | Non numérique                      | B       |
| 008           | Pas dans le domaine de définition  | B       |
| 093           | Longueur incorrecte                | B       |
| 004           | Nombre de contrôle invalide        | B       |
| 235           | Non repris au répertoire           | B       |
| 022           | Incompatibilité avec le répertoire | NP      |

**Exemple détaillé d'anomalie :**

```json
{
  "type": "urn:problem-type:belgif:resourceNotFound",
  "href": "https://www.belgif.be/specification/rest/api-guide/problems/resourceNotFound.html",
  "instance": "?????",
  "status": 400,
  "title": "Resource is not found",
  "detail": "There is an issue with the declared enterprise number",
  "issues": [
    {
      "in": "Enterprise/enterpriseNumber",
      "name": "enterpriseNumber",
      "detail": "004 - Invalid check digit",
      "value": "0123456790"
    }
  ]
}
```



