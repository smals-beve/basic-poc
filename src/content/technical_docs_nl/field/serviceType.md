[🔙 Terug naar overzicht](../README.md)

# 🧩 Veld: `serviceType` (Prestatie- of afwezigheidscode)

## 📝 Beschrijving

Het veld `serviceType` geeft aan welk type prestatie of afwezigheid van toepassing is voor de opgegeven periode binnen
een tewerkstelling.

---

## ⚙️ Technische specificaties

- **Type** : `String`
- **Enumeratie** : De toegelaten waarden worden opgesomd in de bijlage  
  👉 <a href="../../../technical_specs/Annex/annex100_service_code.xlsx" target="_blank">📂 Annex 100 – Codes Prestatie (
  Excel)</a>

---

## ⚠️ Zakelijke beperkingen

- **Verplicht**: Dit veld **moet** ingevuld worden zodra een prestatie of afwezigheid is opgegeven.
- **Validatie**: De waarde moet exact overeenkomen met een van de geldige codes uit *Annex 100*.

---

## 🧪 Anomalieën

Een overzicht van mogelijke anomalieën wordt binnenkort toegevoegd.

---

## 📎 Gerelateerde documentatie

- [Schema: Service](../schema/schema_service.md)
