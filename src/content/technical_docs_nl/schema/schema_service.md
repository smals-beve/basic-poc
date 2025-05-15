# 📄 Documentatie - Schema: `Service` (Prestaties)

## 📘 Context

Dit document maakt deel uit van de **functioneel/technische documentatie** voor eGov3.0. Het biedt een beschrijving van het dataschema `Service`, dat gebruikt wordt voor het aangeven van prestaties of afwezigheden van een werknemer.

Voor een goed begrip, raden we aan eerst de [algemene context en inleiding](../README.md) te bekijken.

---

## 🧾 Beschrijving

Het `Service`-schema stelt de aangifte van voordelen of prestaties van een werknemer mogelijk, binnen een bepaalde periode van zijn/haar tewerkstelling. Het bevat verschillende gegevensvelden die nodig zijn voor een correcte verwerking van de prestaties.

---

## ⚙️ Schema-eigenschappen (blok)

- **Label technique** : `Service`
- **Cardinaliteit** : Min. `0` – Max. `*`
- **Aanwezigheid (presence)** :
    - **Voorwaarde** : Verplicht als ten minste één prestatie moet worden gedeclareerd.
    - **Extra beperkingen** : Een specifieke prestatiecode mag slechts één keer voorkomen per bezetting.

---

## 📑 Gegevensvelden

| **Veldnaam**     | **Beschrijving**                                          |
|------------------|-----------------------------------------------------------|
| `sequenceNbr`    | Volgnummer van de aangifte                               |
| [`serviceType`](../field/serviceType.md)    | Code die het type prestatie of afwezigheid aanduidt      |
| `startDate`      | Startdatum van de prestatie of afwezigheid (formaat: `YYYY-MM-DD`) |
| `endDate`        | Einddatum van de prestatie of afwezigheid (formaat: `YYYY-MM-DD`) |
| `nbrOfHours`     | Aantal gepresteerde of afwezige uren (in uren)           |


---

## 🧪 Anomalieën

Momenteel worden anomalieën nog uitgewerkt. Een overzicht zal hier binnenkort beschikbaar zijn.

---

## 📎 Gerelateerde documentatie

?

---

## ❌ Belangrijke opmerking

?
