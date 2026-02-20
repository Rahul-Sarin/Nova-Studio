/**
 * Custom Dropdown Component
 * Smooth, flicker-free dropdown with butter-smooth animations
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomDropdown);
    } else {
        initCustomDropdown();
    }

    function initCustomDropdown() {
        const customSelect = document.getElementById('businessTypeWrapper');
        if (!customSelect) return;

        const trigger = customSelect.querySelector('.custom-select-trigger');
        const dropdown = customSelect.querySelector('.custom-select-dropdown');
        const options = customSelect.querySelectorAll('.custom-select-option');
        const hiddenInput = document.getElementById('businessType');
        const placeholder = customSelect.querySelector('.custom-select-placeholder');

        // Toggle dropdown
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown();
        });

        // Make trigger keyboard accessible
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'listbox');

        // Keyboard navigation for trigger
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!customSelect.classList.contains('active')) {
                    openDropdown();
                }
            } else if (e.key === 'Escape') {
                closeDropdown();
            }
        });

        // Option selection
        options.forEach(function(option, index) {
            // Make option keyboard accessible
            option.setAttribute('tabindex', '0');
            option.setAttribute('role', 'option');
            
            option.addEventListener('click', function() {
                selectOption(this);
            });

            option.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectOption(this);
                    closeDropdown();
                    trigger.focus();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextOption = options[Math.min(index + 1, options.length - 1)];
                    nextOption.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevOption = options[Math.max(index - 1, 0)];
                    prevOption.focus();
                } else if (e.key === 'Escape') {
                    closeDropdown();
                    trigger.focus();
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!customSelect.contains(e.target)) {
                closeDropdown();
            }
        });

        // Track if mouse is over dropdown area
        let isOverDropdown = false;
        
        dropdown.addEventListener('mouseenter', function() {
            isOverDropdown = true;
        });
        
        dropdown.addEventListener('mouseleave', function() {
            isOverDropdown = false;
        });
        
        // Handle scroll within dropdown - prevent page scroll, but NEVER close dropdown
        dropdown.addEventListener('wheel', function(e) {
            const isScrollable = dropdown.scrollHeight > dropdown.clientHeight;
            
            if (!isScrollable) {
                // Not scrollable, allow normal behavior
                return;
            }
            
            // Always stop propagation to prevent page scroll when hovering dropdown
            e.stopPropagation();
            
            // Let the dropdown scroll naturally, no closing at boundaries
        }, { passive: false });

        // Only close on page scroll if not over dropdown
        window.addEventListener('scroll', function(e) {
            if (customSelect.classList.contains('active') && !isOverDropdown) {
                closeDropdown();
            }
        }, { passive: true });

        function toggleDropdown() {
            if (customSelect.classList.contains('active')) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }

        function openDropdown() {
            customSelect.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
            
            // Focus first option for keyboard navigation
            setTimeout(function() {
                const firstOption = options[0];
                if (firstOption) {
                    firstOption.focus();
                }
            }, 100);
        }

        function closeDropdown() {
            customSelect.classList.remove('active');
            trigger.setAttribute('aria-expanded', 'false');
        }

        function selectOption(optionElement) {
            const value = optionElement.getAttribute('data-value');
            const text = optionElement.textContent;

            // Update hidden input
            hiddenInput.value = value;

            // Update placeholder text
            placeholder.textContent = text;

            // Update visual state
            customSelect.classList.add('has-value');

            // Remove selected class from all options
            options.forEach(function(opt) {
                opt.classList.remove('selected');
            });

            // Add selected class to chosen option
            optionElement.classList.add('selected');

            // Close dropdown
            closeDropdown();

            // Trigger change event for form validation
            const event = new Event('change', { bubbles: true });
            hiddenInput.dispatchEvent(event);

            // Clear any error state
            const formGroup = customSelect.closest('.form-group');
            if (formGroup) {
                formGroup.classList.remove('error');
                const errorDiv = formGroup.querySelector('.form-error');
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            }
            customSelect.classList.remove('error');
            customSelect.classList.add('success');
        }

        // Expose method to programmatically set error state
        customSelect.setError = function() {
            customSelect.classList.add('error');
            customSelect.classList.remove('success');
        };

        customSelect.clearError = function() {
            customSelect.classList.remove('error');
        };

        customSelect.setSuccess = function() {
            customSelect.classList.add('success');
            customSelect.classList.remove('error');
        };

        console.log('✅ Custom dropdown initialized');
    }
})();
