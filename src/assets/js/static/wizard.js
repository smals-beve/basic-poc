export const wizardModule = {
    wizard: {
        init: function() {
            const wizards = document.querySelectorAll('.js-wizard');

            wizards.forEach((wizard) => {
                const steps = Array.from(wizard.querySelectorAll('.js-wizard-step'));
                const navContainer = wizard.querySelector('.js-wizard-nav');
                const nextBtn = wizard.querySelector('.js-wizard-next');
                const prevBtn = wizard.querySelector('.js-wizard-prev');
                const restartBtn = wizard.querySelector('.js-wizard-restart');

                const finalStepExists = (restartBtn !== null);
                let currentStepIndex = 0;

                const validateCurrentStep = () => {
                    const currentStep = steps[currentStepIndex];
                    if (!currentStep) return true;
                    const requiredFields = currentStep.querySelectorAll('[required]');
                    if (requiredFields.length === 0) {
                        return true;
                    }

                    for (let field of requiredFields) {
                        if (field.type === 'radio') {
                            const groupName = field.name;
                            const groupRadios = currentStep.querySelectorAll(`input[type="radio"][name="${groupName}"]`);
                            const isChecked = Array.from(groupRadios).some(r => r.checked);
                            if (!isChecked) return false;
                        } else if (field.type === 'checkbox') {
                            if (!field.checked) return false;
                        } else {
                            if (!field.value.trim()) return false;
                        }
                    }
                    return true;
                };

                const updateNextButtonState = () => {
                    if (!nextBtn) return;
                    const isValid = validateCurrentStep();
                    nextBtn.disabled = !isValid;
                    updateNavContainerVisibility();
                };

                const updateNavContainerVisibility = () => {
                    if (!navContainer) return;
                    // On ne masque plus le conteneur si on est sur la première étape,
                    // même si les deux boutons sont désactivés, afin de montrer le bouton "Next".
                    if (currentStepIndex === 0) {
                        navContainer.classList.remove('d-none');
                        return;
                    }

                    const prevDisabled = !prevBtn || prevBtn.classList.contains('d-none') || prevBtn.disabled;
                    const nextDisabled = !nextBtn || nextBtn.classList.contains('d-none') || nextBtn.disabled;

                    if (prevDisabled && nextDisabled) {
                        navContainer.classList.add('d-none');
                    } else {
                        navContainer.classList.remove('d-none');
                    }
                };

                const showCurrentStep = () => {
                    steps.forEach((step, index) => {
                        if (index === currentStepIndex) {
                            step.classList.remove('d-none');
                            step.classList.add('d-block');
                        } else {
                            step.classList.remove('d-block');
                            step.classList.add('d-none');
                        }
                    });

                    if (prevBtn) {
                        if (currentStepIndex === 0) {
                            prevBtn.classList.add('d-none');
                            prevBtn.disabled = true;
                        } else {
                            prevBtn.classList.remove('d-none');
                            prevBtn.disabled = false;
                        }
                    }

                    if (nextBtn) {
                        if (finalStepExists) {
                            if (currentStepIndex < steps.length - 2) {
                                nextBtn.classList.remove('d-none');
                                nextBtn.disabled = false;
                            } else if (currentStepIndex === steps.length - 2) {
                                nextBtn.classList.remove('d-none');
                                nextBtn.disabled = false;
                            } else {
                                nextBtn.classList.add('d-none');
                                nextBtn.disabled = true;
                                if (prevBtn) {
                                    prevBtn.classList.add('d-none');
                                    prevBtn.disabled = true;
                                }
                            }
                        } else {
                            if (currentStepIndex < steps.length - 1) {
                                nextBtn.classList.remove('d-none');
                            } else {
                                nextBtn.classList.remove('d-none');
                            }
                        }
                    }

                    updateNextButtonState();
                };

                showCurrentStep();

                steps.forEach((step) => {
                    const fields = step.querySelectorAll('input, select, textarea');
                    fields.forEach((field) => {
                        field.addEventListener('input', updateNextButtonState);
                        field.addEventListener('change', updateNextButtonState);
                    });
                });

                if (nextBtn) {
                    nextBtn.addEventListener('click', () => {
                        if (!validateCurrentStep()) {
                            return;
                        }

                        if (finalStepExists) {
                            if (currentStepIndex < steps.length - 1) {
                                currentStepIndex++;
                                showCurrentStep();
                            }
                        } else {
                            if (currentStepIndex < steps.length - 1) {
                                currentStepIndex++;
                                showCurrentStep();
                            } else {
                                console.log('Wizard completed (no final step)');
                            }
                        }
                    });
                }

                if (prevBtn) {
                    prevBtn.addEventListener('click', () => {
                        if (currentStepIndex > 0) {
                            currentStepIndex--;
                            showCurrentStep();
                        }
                    });
                }

                if (restartBtn) {
                    restartBtn.addEventListener('click', () => {
                        const forms = wizard.querySelectorAll('form');
                        forms.forEach(form => form.reset());

                        currentStepIndex = 0;
                        showCurrentStep();
                        updateNextButtonState();
                    });
                }
            });
        }
    },
    init: function() {
        this.wizard.init();
    }
};
