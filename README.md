# Glossary and Technical References

Welcome to the `basic` repository of the **e-Gov 3.0** project, dedicated to the definition and standardization of data types.

## Repository Contents

This repository contains functionnal documentation:

| Type        | Description                                                                                    | Documentation FR      | Documentatie NL                                            | Documentation EN                           |
|-------------|------------------------------------------------------------------------------------------------|-----------------------|------------------------------------------------------------|--------------------------------------------|
| Glossary    | A standardized glossary in **OpenAPI (Swagger)** format, precisely describing the fields used. | Voir la documentation | [Bekijk de documentatie](src/content/technical_docs_nl/README.md) | See the EN documentation                   |

This repository contains technical documentation:

| Type                                                   | Description                           |
|--------------------------------------------------------|---------------------------------------|
| [JSON schema](src/content/technical_specs/basic.yaml)         | Retrieve the JSON schema              |
| [JSON UI](https://test-belgium-test.github.io/basic/)  | View the documentation                |
| Annex  | Retrieve the annexes                 |


## Repository Structure

```
basic/
├── README.md                      #  Introduction and description of the repository (This page)
├── docs/
│   ├── technical_specs/
│   │   ├── basic.yaml             # Glossary and OpenAPI definitions
├── technical_docs_XX/             #XX can be FR/NL/EN/DE
│   └── README.md                  # Technical constraints explained in plain language 
│   │   ├── schema                 # Contains documentation for different data blocks 
│   │   ├── field                  # Contains documentation for the different fields within data blocks
└── RELEASE_NOTES.md               # Description of glossary versions or changes
```

## How to Use These Resources

Use these resources to understand, validate, and effectively integrate the data of the associated systems. 
Each example JSON file and the technical documentation are designed to guide you clearly through the standards required by the project.

Thank you!




