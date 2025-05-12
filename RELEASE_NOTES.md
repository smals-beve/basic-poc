
# Version 1.1 – HTTP Methods Added for Person Management

This version introduces basic API operations to create, update, and modify personal data entries.

## ✨ New Features:

- **POST /person**: Create a new person record
- **PUT /person**: Update a complete person record
- **PATCH /person/{id}**: Partially modify a person record (e.g., change address or phone only)

Each method uses the `Person` schema already defined, ensuring consistency across all operations.

These additions make the API actionable and usable for integration with external systems managing citizen or employee data.

➡️ See the updated Swagger UI at: [Swagger Viewer](https://test-belgium-test.github.io/person/)



# Version 1.0 - Initial Release

Cette première version du fichier JSON pour e-Test 3.0 introduit une définition standardisée des données personnelles essentielles utilisées par les services numériques de sécurité sociale.

## Nouveautés principales :

- Définition initiale complète des champs standard : prénom, nom, date de naissance, genre, adresse, statut civil et relation au ménage.
- Intégration du standard ISO 5218 pour la représentation du genre.
- Contraintes claires sur les valeurs acceptables pour le statut civil et les relations au ménage, alignées avec les codes du registre national.

Consultez les [Notes Techniques](docs/technical_notes.md) pour des détails complets.
