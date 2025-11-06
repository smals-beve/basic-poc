export const uplaodModule = {
    filepond: {
        init: function(serverConfig) {
            // Get the lang attribute from the <html> tag
            const lang = document.documentElement.lang;

            // Define text translations for all FilePond messages and warnings based on the language
            const translations = {
                en: {
                    labelIdle: `Drag & Drop your files or <span style="text-decoration: underline;">Browse</span>`,
                    labelInvalidField: 'Field contains invalid files',
                    labelFileWaitingForSize: 'Waiting for size',
                    labelFileSizeNotAvailable: 'File size not available',
                    labelFileLoading: 'Loading',
                    labelFileLoadError: 'Error during load',
                    labelFileProcessing: 'Uploading',
                    labelFileProcessingComplete: 'Upload complete',
                    labelFileProcessingAborted: 'Upload cancelled',
                    labelFileProcessingError: 'Error during upload',
                    labelFileProcessingRevertError: 'Error during revert',
                    labelFileRemoveError: 'Error during removal',
                    labelTapToCancel: 'Tap to cancel',
                    labelTapToRetry: 'Tap to retry',
                    labelTapToUndo: 'Tap to undo',
                    labelButtonRemoveItem: 'Remove',
                    labelButtonAbortItemLoad: 'Abort',
                    labelButtonRetryItemLoad: 'Retry',
                    labelButtonAbortItemProcessing: 'Cancel',
                    labelButtonUndoItemProcessing: 'Undo',
                    labelButtonRetryItemProcessing: 'Retry',
                    labelButtonProcessItem: 'Upload',
                    labelMaxFileSizeExceeded: 'File is too large',
                    labelMaxFileSize: 'Maximum file size is {filesize}',
                    labelMaxTotalFileSizeExceeded: 'Total file size exceeded',
                    labelMaxTotalFileSize: 'Maximum total file size is {filesize}',
                    labelFileTypeNotAllowed: 'File type not allowed',
                    fileValidateTypeLabelExpectedTypes: 'Expects {allButLastType} or {lastType}',
                    imageValidateSizeLabelFormatError: 'Image type not supported',
                    imageValidateSizeLabelImageSizeTooSmall: 'Image is too small',
                    imageValidateSizeLabelImageSizeTooBig: 'Image is too big',
                    imageValidateSizeLabelExpectedMinSize: 'Minimum size is {minWidth} × {minHeight}',
                    imageValidateSizeLabelExpectedMaxSize: 'Maximum size is {maxWidth} × {maxHeight}',
                    imageValidateSizeLabelImageResolutionTooLow: 'Resolution is too low',
                    imageValidateSizeLabelImageResolutionTooHigh: 'Resolution is too high',
                    warningMaxFiles: "You can only upload up to {maxFiles} files."
                },
                fr: {
                    labelIdle: `Glissez-déposez vos fichiers ou <span style="text-decoration: underline;">Parcourez</span>`,
                    labelInvalidField: 'Le champ contient des fichiers non valides',
                    labelFileWaitingForSize: 'En attente de la taille',
                    labelFileSizeNotAvailable: 'Taille du fichier non disponible',
                    labelFileLoading: 'Chargement',
                    labelFileLoadError: 'Erreur lors du chargement',
                    labelFileProcessing: 'Téléchargement',
                    labelFileProcessingComplete: 'Téléchargement terminé',
                    labelFileProcessingAborted: 'Téléchargement annulé',
                    labelFileProcessingError: 'Erreur lors du téléchargement',
                    labelFileProcessingRevertError: 'Erreur lors de l’annulation',
                    labelFileRemoveError: 'Erreur lors de la suppression',
                    labelTapToCancel: 'Tapez pour annuler',
                    labelTapToRetry: 'Tapez pour réessayer',
                    labelTapToUndo: 'Tapez pour annuler',
                    labelButtonRemoveItem: 'Retirer',
                    labelButtonAbortItemLoad: 'Annuler',
                    labelButtonRetryItemLoad: 'Réessayer',
                    labelButtonAbortItemProcessing: 'Annuler',
                    labelButtonUndoItemProcessing: 'Annuler',
                    labelButtonRetryItemProcessing: 'Réessayer',
                    labelButtonProcessItem: 'Télécharger',
                    labelMaxFileSizeExceeded: 'Le fichier est trop volumineux',
                    labelMaxFileSize: 'La taille maximale du fichier est de {filesize}',
                    labelMaxTotalFileSizeExceeded: 'La taille totale des fichiers dépasse la limite',
                    labelMaxTotalFileSize: 'La taille totale maximale est de {filesize}',
                    labelFileTypeNotAllowed: 'Type de fichier non autorisé',
                    fileValidateTypeLabelExpectedTypes: 'Type attendu : {allButLastType} ou {lastType}',
                    imageValidateSizeLabelFormatError: 'Type d’image non supporté',
                    imageValidateSizeLabelImageSizeTooSmall: 'L’image est trop petite',
                    imageValidateSizeLabelImageSizeTooBig: 'L’image est trop grande',
                    imageValidateSizeLabelExpectedMinSize: 'La taille minimale est de {minWidth} × {minHeight}',
                    imageValidateSizeLabelExpectedMaxSize: 'La taille maximale est de {maxWidth} × {maxHeight}',
                    imageValidateSizeLabelImageResolutionTooLow: 'La résolution est trop basse',
                    imageValidateSizeLabelImageResolutionTooHigh: 'La résolution est trop élevée',
                    warningMaxFiles: "Vous ne pouvez télécharger que jusqu'à {maxFiles} fichiers."
                },
                nl: {
                    labelIdle: `Sleep uw bestanden hierheen of <span style="text-decoration: underline;">Bladeren</span>`,
                    labelInvalidField: 'Het veld bevat ongeldige bestanden',
                    labelFileWaitingForSize: 'Wachten op grootte',
                    labelFileSizeNotAvailable: 'Bestandsgrootte niet beschikbaar',
                    labelFileLoading: 'Laden',
                    labelFileLoadError: 'Fout tijdens het laden',
                    labelFileProcessing: 'Uploaden',
                    labelFileProcessingComplete: 'Upload voltooid',
                    labelFileProcessingAborted: 'Upload geannuleerd',
                    labelFileProcessingError: 'Fout tijdens uploaden',
                    labelFileProcessingRevertError: 'Fout tijdens herstellen',
                    labelFileRemoveError: 'Fout tijdens verwijderen',
                    labelTapToCancel: 'Tik om te annuleren',
                    labelTapToRetry: 'Tik om opnieuw te proberen',
                    labelTapToUndo: 'Tik om ongedaan te maken',
                    labelButtonRemoveItem: 'Verwijderen',
                    labelButtonAbortItemLoad: 'Afbreken',
                    labelButtonRetryItemLoad: 'Opnieuw proberen',
                    labelButtonAbortItemProcessing: 'Annuleren',
                    labelButtonUndoItemProcessing: 'Ongedaan maken',
                    labelButtonRetryItemProcessing: 'Opnieuw proberen',
                    labelButtonProcessItem: 'Uploaden',
                    labelMaxFileSizeExceeded: 'Bestand is te groot',
                    labelMaxFileSize: 'Maximale bestandsgrootte is {filesize}',
                    labelMaxTotalFileSizeExceeded: 'Totale bestandsgrootte overschreden',
                    labelMaxTotalFileSize: 'Maximale totale bestandsgrootte is {filesize}',
                    labelFileTypeNotAllowed: 'Bestandstype niet toegestaan',
                    fileValidateTypeLabelExpectedTypes: 'Verwacht {allButLastType} of {lastType}',
                    imageValidateSizeLabelFormatError: 'Afbeeldingstype niet ondersteund',
                    imageValidateSizeLabelImageSizeTooSmall: 'Afbeelding is te klein',
                    imageValidateSizeLabelImageSizeTooBig: 'Afbeelding is te groot',
                    imageValidateSizeLabelExpectedMinSize: 'Minimale grootte is {minWidth} × {minHeight}',
                    imageValidateSizeLabelExpectedMaxSize: 'Maximale grootte is {maxWidth} × {maxHeight}',
                    imageValidateSizeLabelImageResolutionTooLow: 'Resolutie is te laag',
                    imageValidateSizeLabelImageResolutionTooHigh: 'Resolutie is te hoog',
                    warningMaxFiles: "U kunt slechts tot {maxFiles} bestanden uploaden."
                },
                de: {
                    labelIdle: `Dateien per Drag & Drop ablegen oder <span style="text-decoration: underline;">Durchsuchen</span>`,
                    labelInvalidField: 'Feld enthält ungültige Dateien',
                    labelFileWaitingForSize: 'Warten auf Dateigröße',
                    labelFileSizeNotAvailable: 'Dateigröße nicht verfügbar',
                    labelFileLoading: 'Laden',
                    labelFileLoadError: 'Fehler beim Laden',
                    labelFileProcessing: 'Hochladen',
                    labelFileProcessingComplete: 'Upload abgeschlossen',
                    labelFileProcessingAborted: 'Upload abgebrochen',
                    labelFileProcessingError: 'Fehler beim Hochladen',
                    labelFileProcessingRevertError: 'Fehler beim Rückgängig machen',
                    labelFileRemoveError: 'Fehler beim Entfernen',
                    labelTapToCancel: 'Zum Abbrechen tippen',
                    labelTapToRetry: 'Zum Wiederholen tippen',
                    labelTapToUndo: 'Zum Rückgängig machen tippen',
                    labelButtonRemoveItem: 'Entfernen',
                    labelButtonAbortItemLoad: 'Abbrechen',
                    labelButtonRetryItemLoad: 'Erneut versuchen',
                    labelButtonAbortItemProcessing: 'Abbrechen',
                    labelButtonUndoItemProcessing: 'Rückgängig machen',
                    labelButtonRetryItemProcessing: 'Erneut versuchen',
                    labelButtonProcessItem: 'Hochladen',
                    labelMaxFileSizeExceeded: 'Datei ist zu groß',
                    labelMaxFileSize: 'Maximale Dateigröße ist {filesize}',
                    labelMaxTotalFileSizeExceeded: 'Gesamtgröße der Dateien überschritten',
                    labelMaxTotalFileSize: 'Maximale Gesamtgröße der Dateien ist {filesize}',
                    labelFileTypeNotAllowed: 'Dateityp nicht erlaubt',
                    fileValidateTypeLabelExpectedTypes: 'Erwartet {allButLastType} oder {lastType}',
                    imageValidateSizeLabelFormatError: 'Bildtyp nicht unterstützt',
                    imageValidateSizeLabelImageSizeTooSmall: 'Bild ist zu klein',
                    imageValidateSizeLabelImageSizeTooBig: 'Bild ist zu groß',
                    imageValidateSizeLabelExpectedMinSize: 'Minimale Größe ist {minWidth} × {minHeight}',
                    imageValidateSizeLabelExpectedMaxSize: 'Maximale Größe ist {maxWidth} × {maxHeight}',
                    imageValidateSizeLabelImageResolutionTooLow: 'Auflösung ist zu niedrig',
                    imageValidateSizeLabelImageResolutionTooHigh: 'Auflösung ist zu hoch',
                    warningMaxFiles: "Sie können nur bis zu {maxFiles} Dateien hochladen."
                }
            };

            // Fallback to English if the language is not supported
            const defaultTranslations = translations[lang] || translations['en'];

            const self = this;

            // Check if serverConfig is provided, otherwise log to the console
            if (!serverConfig) {
                console.warn('No serverConfig provided for the upload field. Please configure a serverConfig. Default server configuration is used for testing purposes. Refer to the styleguide documentation for proper configuration.');
            }

            document.querySelectorAll('input[type="file"]').forEach(function(inputElement) {
                const maxFiles = inputElement.hasAttribute('data-max-files')
                    ? parseInt(inputElement.getAttribute('data-max-files'))
                    : null;

                // Create a FilePond instance with the maximum file limit
                const pond = FilePond.create(inputElement, {
                    ...defaultTranslations,
                    server: serverConfig || self.defaultServer(),
                    maxFiles: maxFiles,
                    onwarning: (error) => {
                        if (error.body === 'Max files') {
                            // Display the localized warning message
                            const warningMessage = defaultTranslations.warningMaxFiles.replace('{maxFiles}', maxFiles);
                            self.displayWarning(pond.element, warningMessage);
                        }
                    },
                });

                // Remove credits (optional)
                pond.on('init', () => {
                    const credits = pond.element.querySelector('.filepond--credits');
                    if (credits) {
                        credits.remove();
                    }
                });
            });
        },
        mimeToExtensionMap: function() {

        },
        displayWarning: function(filePondRoot, message) {
            // Use a small delay to ensure FilePond has transformed the input
            if (!filePondRoot) {
                return;
            }

            // Check if a warning message already exists to avoid duplicates
            let warningMessage = filePondRoot.previousElementSibling;
            if (warningMessage && warningMessage.classList.contains('filepond--warning')) {
                return; // If the message already exists, do not recreate it
            } else {

            }

            // Create a <span> element to display the warning message
            warningMessage = document.createElement('span');
            warningMessage.classList.add('form-error', 'filepond--warning');
            warningMessage.innerText = message;

            // Insert the warning message before filePondRoot
            filePondRoot.parentNode.insertBefore(warningMessage, filePondRoot);

            // Function to check if the error is still present
            const hasError = () => {
                const currentFiles = filePondRoot.querySelectorAll('.filepond--file');
                const maxFiles = parseInt(filePondRoot.getAttribute('data-max-files')) || Infinity;

                return currentFiles.length > maxFiles;
            };

            // Function to remove the warning message if there is no error
            const removeWarningOnInteraction = () => {
                if (!hasError() && warningMessage) {
                    warningMessage.remove();
                    // Remove the event listeners after the warning is removed
                    filePondRoot.removeEventListener('change', removeWarningOnInteraction);
                    filePondRoot.removeEventListener('dragenter', removeWarningOnInteraction);
                    filePondRoot.removeEventListener('drop', removeWarningOnInteraction);
                }
            };

            // Add event listeners for 'change', 'dragenter', and 'drop' to remove the warning if there is no error
            filePondRoot.addEventListener('change', removeWarningOnInteraction);
            filePondRoot.addEventListener('dragenter', removeWarningOnInteraction);
            filePondRoot.addEventListener('drop', removeWarningOnInteraction);
        },

        defaultServer: function() {
            return {
                process: (fieldName, file, metadata, load, error, progress, abort) => {
                    let uploadProgress = 0;
                    const uploadTime = 2000;

                    // Simulate a file upload process
                    const interval = setInterval(() => {
                        uploadProgress += 25;
                        progress(true, uploadProgress, 100);
                        if (uploadProgress >= 100) {
                            clearInterval(interval);
                            load('file-upload-success');
                        }
                    }, uploadTime / 4);

                    return {
                        abort: () => {
                            clearInterval(interval);
                            abort();
                        }
                    };
                },
                revert: (uniqueFileId, load, error) => {
                    setTimeout(() => {
                        load();
                    }, 0);
                }
            };
        }
    },
    init: function(serverConfig) {
        this.filepond.init(serverConfig);
    }
};
