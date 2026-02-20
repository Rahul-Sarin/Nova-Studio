/**
 * Contact Form Handler
 * Handles validation and submission of the contact form
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }

    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const businessTypeSelect = document.getElementById('businessType');
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('charCount');
        const successMessage = document.getElementById('successMessage');

        // Character counter for message
        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', () => {
                const length = messageTextarea.value.length;
                charCount.textContent = length;
                
                if (length > 1000) {
                    charCount.style.color = 'var(--neon-pink)';
                } else if (length > 900) {
                    charCount.style.color = 'var(--neon-purple)';
                } else {
                    charCount.style.color = 'var(--text-muted)';
                }
            });
        }

        // Phone number formatting
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = `(${value}`;
                    } else if (value.length <= 6) {
                        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                    } else {
                        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                    }
                }
                e.target.value = value;
            });
        }

        // Real-time validation
        if (nameInput) {
            nameInput.addEventListener('blur', () => validateName());
            nameInput.addEventListener('input', () => {
                if (nameInput.parentElement.classList.contains('error')) {
                    validateName();
                }
            });
        }

        if (emailInput) {
            emailInput.addEventListener('blur', () => validateEmail());
            emailInput.addEventListener('input', () => {
                if (emailInput.parentElement.classList.contains('error')) {
                    validateEmail();
                }
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener('blur', () => validatePhone());
        }

        if (businessTypeSelect) {
            businessTypeSelect.addEventListener('change', () => validateBusinessType());
        }

        if (messageTextarea) {
            messageTextarea.addEventListener('blur', () => validateMessage());
            messageTextarea.addEventListener('input', () => {
                if (messageTextarea.parentElement.classList.contains('error')) {
                    validateMessage();
                }
            });
        }

        // Form submission - DISABLED to allow Web3Forms to handle it
        //form.addEventListener('submit', handleSubmit);

        // Validation functions
        function validateName() {
            const value = nameInput.value.trim();
            const formGroup = nameInput.parentElement;
            
            if (value.length < 2) {
                showError(formGroup, 'Please enter your full name');
                return false;
            }
            
            clearError(formGroup);
            return true;
        }

        function validateEmail() {
            const value = emailInput.value.trim();
            const formGroup = emailInput.parentElement;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(value)) {
                showError(formGroup, 'Please enter a valid email address');
                return false;
            }
            
            clearError(formGroup);
            return true;
        }

        function validatePhone() {
            const value = phoneInput.value.trim();
            const formGroup = phoneInput.parentElement;
            
            // Phone is optional, but if provided, must be valid
            if (value.length > 0) {
                const digitsOnly = value.replace(/\D/g, '');
                if (digitsOnly.length < 10) {
                    showError(formGroup, 'Please enter a valid 10-digit phone number');
                    return false;
                }
            }
            
            clearError(formGroup);
            return true;
        }

        function validateBusinessType() {
            const value = businessTypeSelect.value;
            const customSelectWrapper = document.getElementById('businessTypeWrapper');
            const formGroup = customSelectWrapper ? customSelectWrapper.closest('.form-group') : businessTypeSelect.parentElement;
            
            if (!value) {
                showError(formGroup, 'Please select your business type');
                if (customSelectWrapper && customSelectWrapper.setError) {
                    customSelectWrapper.setError();
                }
                return false;
            }
            
            clearError(formGroup);
            if (customSelectWrapper && customSelectWrapper.setSuccess) {
                customSelectWrapper.setSuccess();
            }
            return true;
        }

        function validateMessage() {
            const value = messageTextarea.value.trim();
            const formGroup = messageTextarea.parentElement;
            
            if (value.length < 10) {
                showError(formGroup, 'Please enter a message (minimum 10 characters)');
                return false;
            }
            
            if (value.length > 1000) {
                showError(formGroup, 'Message is too long (maximum 1000 characters)');
                return false;
            }
            
            clearError(formGroup);
            return true;
        }

        function showError(formGroup, message) {
            formGroup.classList.add('error');
            const errorElement = formGroup.querySelector('.form-error');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }

        function clearError(formGroup) {
            formGroup.classList.remove('error');
        }

        function handleSubmit(e) {
            e.preventDefault();

            // Validate all fields
            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isBusinessTypeValid = validateBusinessType();
            const isMessageValid = validateMessage();

            const isFormValid = isNameValid && isEmailValid && isPhoneValid && 
                               isBusinessTypeValid && isMessageValid;

            if (!isFormValid) {
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            // Get form data
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                businessType: businessTypeSelect.value,
                message: messageTextarea.value.trim(),
                timestamp: new Date().toISOString()
            };

            // Submit form
            submitForm(formData);
        }

        function submitForm(formData) {
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            // Simulate form submission (replace with actual API call)
            // For production, you would integrate with Formspree, Netlify Forms, or your own API
            setTimeout(() => {
                console.log('Form submitted:', formData);

                // Show success message
                successMessage.classList.add('show');

                // Reset form
                form.reset();
                charCount.textContent = '0';

                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Hide success message after 10 seconds
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 10000);
            }, 1500);

            // PRODUCTION CODE:
            // Uncomment and configure this for actual form submission
            /*
            fetch('/api/contact', {  // Replace with your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Submission failed');
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                successMessage.classList.add('show');
                form.reset();
                charCount.textContent = '0';
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    successMessage.classList.remove('show');
                }, 10000);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Sorry, there was an error submitting your message. Please try again or email us directly at hello@novastudio.com');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
            */

            // FORMSPREE INTEGRATION:
            // Replace YOUR_FORM_ID with your Formspree form ID
            /*
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                successMessage.classList.add('show');
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error submitting form. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            });
            */
        }
    }
})();
