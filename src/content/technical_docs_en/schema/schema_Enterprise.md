Return to ....

## Schéma : Enterprise

**Description :**
Objet permettant d'identifier une entreprise dans une déclaration employeur. Seul un des deux numéros (
`enterpriseNumber` ou `nssoNumber`) doit obligatoirement être renseigné.

### Propriétés du Schéma :

| Nom du champ     | Description                                                                | 
|------------------|----------------------------------------------------------------------------|
| enterpriseNumber | [Voir les détails du champ enterpriseNumber](../field/enterpriseNumber.md) | 
| nssoNumber       | [Voir les détails du champ nssoNumber](../field/nssoNumber.md)             |

[Annexe]([../field/nssoNumber.md](https://www.socialsecurity.be/lambda/portail/glossaires/dmfa.nsf/web/glossary_home_fr))

### Contraintes métier :

* **Condition exclusive** : Un seul des deux numéros peut être complété (`oneOf`).

### Anomalies:

| Code anomalie | Description           | Gravité |
|---------------|-----------------------|---------|
| 001           | Non présent           | B       |
| 146           | Non admis             | B       |
| 090           | Erreur de cardinalité | B       |
| 151           | Pas identifiable      | B       |
| 091           | Erreur de séquence    | B       |

