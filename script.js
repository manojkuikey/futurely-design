// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load components first
    loadComponents().then(() => {
        // Then initialize functionality
        highlightCurrentPage();
        setupSocialSharing();
        updateVisitCounter();
        animatePageContent();
        setupMobileAccordion();
        setupSubscriptionForm();
    });
});

/**
 * Load all common components (header, sidebar, footer)
 * @returns {Promise} - Resolves when all components are loaded
 */
async function loadComponents() {
    // Determine base path (different for main page vs. concept pages)
    const isConceptPage = window.location.pathname.includes('/concepts/');
    const basePath = isConceptPage ? '../components/' : 'components/';

    // Load all components in parallel
    const components = [
        { id: 'header-container', file: 'header.html' },
        { id: 'sidebar-container', file: 'sidebar.html' },
        { id: 'footer-container', file: 'footer.html' }
    ];

    const promises = components.map(component => {
        return fetch(basePath + component.file)
            .then(response => response.text())
            .then(html => {
                document.getElementById(component.id).innerHTML = html;
            })
            .catch(error => {
                console.error(`Error loading ${component.file}:`, error);
                // Fallback: Show error message in the component container
                document.getElementById(component.id).innerHTML =
                    `<div class="component-error">Could not load ${component.file}. Please refresh the page.</div>`;
            });
    });

    return Promise.all(promises);
}

/**
 * Highlight the current page in navigation and sidebar
 */
function highlightCurrentPage() {
    // Get the current page path
    const path = window.location.pathname;
    const isHome = path === '/' || path.endsWith('index.html');
    const isConceptPage = path.includes('/concepts/');

    // Highlight the correct nav link
    if (isHome) {
        document.querySelector('.nav-home').classList.add('active');
    } else if (isConceptPage) {
        document.querySelector('.nav-ideas').classList.add('active');
    }

    // Highlight the correct sidebar link if on a concept page
    if (isConceptPage) {
        const currentPage = path.split('/').pop();
        const pageName = currentPage.split('.')[0]; // Remove .html extension

        const sidebarLink = document.querySelector(`.ideas-list a[data-page="${pageName}"]`);
        if (sidebarLink) {
            sidebarLink.classList.add('active');
        }
    }
}

/**
 * Set up social sharing functionality
 */
function setupSocialSharing() {
    const socialLinks = document.querySelectorAll('.social-icons a');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);
            let shareUrl;

            // Determine which social platform was clicked
            if (this.querySelector('.fa-facebook-f')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            } else if (this.querySelector('.fa-twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
            } else if (this.querySelector('.fa-linkedin-in')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
            } else if (this.querySelector('.fa-instagram')) {
                // Instagram doesn't have a direct share URL, but you could redirect to your IG profile
                shareUrl = 'https://instagram.com/your_username';
            }

            // Open sharing window
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

/**
 * Update visit counter using localStorage for demo purposes
 * In production, you would use a backend service or analytics API
 */
function updateVisitCounter() {
    // Get the counter elements
    const pageViewCount = document.getElementById('pageViewCount');
    const uniqueVisitorCount = document.getElementById('uniqueVisitorCount');

    if (!pageViewCount || !uniqueVisitorCount) return;

    // For demo purposes, we'll use localStorage
    // In production, you'd use a server-side solution

    // Increment page views
    let views = localStorage.getItem('futurely_pageviews') || 0;
    views = parseInt(views) + 1;
    localStorage.setItem('futurely_pageviews', views);
    pageViewCount.textContent = views;

    // Check for unique visitor
    const visitorId = localStorage.getItem('futurely_visitor_id');
    if (!visitorId) {
        // First visit - generate random ID and increment counter
        localStorage.setItem('futurely_visitor_id', 'visitor_' + Date.now());

        let visitors = localStorage.getItem('futurely_visitors') || 0;
        visitors = parseInt(visitors) + 1;
        localStorage.setItem('futurely_visitors', visitors);
        uniqueVisitorCount.textContent = visitors;
    } else {
        // Returning visitor
        const visitors = localStorage.getItem('futurely_visitors') || 1;
        uniqueVisitorCount.textContent = visitors;
    }
}

/**
 * Animate page content on load
 */
function animatePageContent() {
    const mainContent = document.querySelector('.content');
    if (mainContent) {
        mainContent.style.opacity = '0';

        setTimeout(() => {
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 0.5s ease-in';
        }, 100);
    }
}

/**
 * Expand idea detail when clicked (for mobile view)
 * This adds accordion functionality on smaller screens
 */
function setupMobileAccordion() {
    if (window.innerWidth <= 768) {
        const ideaTitles = document.querySelectorAll('.idea-title');

        ideaTitles.forEach(title => {
            title.addEventListener('click', function() {
                const content = this.nextElementSibling;

                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    this.classList.remove('active');
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    this.classList.add('active');
                }
            });
        });
    }
}

/**
 * Enable form submission for the subscription form
 * This is a demo version that doesn't actually send data
 * In production, you would handle this with a proper backend
 */
function setupSubscriptionForm() {
    const form = document.querySelector('.subscription-box form');

    if (form) {
        form.addEventListener('submit', function(e) {
            // Uncomment this to prevent actual form submission for demo purposes
            // e.preventDefault();

            const email = form.querySelector('input[type="email"]').value;

            // In a real implementation, you would send this to your backend
            console.log('Subscription requested for:', email);

            // For demo: If you want to show success message without actual submission
            // showSubscriptionMessage('Thank you for subscribing!');
        });
    }
}

/**
 * Show subscription success/error message
 */
function showSubscriptionMessage(message) {
    const messageEl = document.createElement('p');
    messageEl.className = 'subscription-message';
    messageEl.textContent = message;

    const form = document.querySelector('.subscription-box form');
    form.parentNode.insertBefore(messageEl, form.nextSibling);

    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// Handle window resize for responsive features
window.addEventListener('resize', function() {
    setupMobileAccordion();
});