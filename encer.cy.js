// ================= Global Configuration =================

// Robust uncaught exception handler (combined from both scripts)
Cypress.on('uncaught:exception', (err) => {
  if (
    err.message.includes('Cannot read properties of undefined') ||
    err.message.includes('Cannot read properties of null') ||
    err.message.includes("reading 'style'") ||
    err.message.includes("reading 'use'") ||
    err.message.includes('cross origin') ||
    err.message.includes('Invalid regular expression')
  ) {
    return false;
  }
  return true;
});

// Set timeouts and visit homepage before each test
beforeEach(() => {
  Cypress.config('pageLoadTimeout', 120000);
  Cypress.config('defaultCommandTimeout', 10000);
  Cypress.config('responseTimeout', 30000);
  cy.viewport(1280, 800); // Desktop view for all tests
  cy.visit('https://encer.store/', { failOnStatusCode: false });
});

// ================= Homepage Load Test =================

describe('Homepage Load Test', () => {
  it('should display hero section text', () => {
    cy.get('h2').should('contain', 'Reclaim Your Energy with Encer Treatment');
  });
});

// ================= CTA Button Tests =================

describe('CTA Button Tests', () => {
  const buttons = [
    {
      selector: '[data-id="b332b3e"] .elementor-button',
      text: 'Start Your Journey – 100% Risk-Free!',
      expectedPath: '/product/encer-balance-2-pack/',
    },
    {
      selector: '[data-id="26e91dad"] .elementor-button',
      text: 'RECLAIM YOUR ENERGY TODAY!',
      expectedPath: '/product/encer-balance-2-pack/',
    },
    {
      selector: '[data-id="4cc297fe"] .elementor-button',
      text: 'Get Encer now',
      expectedPath: '/product/encer-balance-2-pack/',
    },
    {
      selector: '[data-id="637f9598"] .elementor-button',
      text: 'Learn More',
      expectedPath: '/financing/',
    }
  ];

  it('should check CTA buttons for visibility, clickability, and redirection', () => {
    buttons.forEach((button) => {
      cy.log(`🔍 Checking button: ${button.text}`);
      cy.get(button.selector, { timeout: 10000 })
        .scrollIntoView()
        .should('be.visible')
        .and('contain.text', button.text.trim())
        .click();

      cy.location('pathname', { timeout: 10000 }).should('include', button.expectedPath);

      cy.go('back');
      cy.wait(1000);
    });
  });
});

// Handle uncaught exceptions globally to prevent test failures from app errors
Cypress.on('uncaught:exception', (err, runnable) => {
  console.warn('Ignored app error:', err.message);
  return false;
});

describe('CTA Button Functionality - Logged Out View', () => {
  beforeEach(() => {
    cy.viewport(1440, 900); // desktop viewport
    cy.visit('https://encer.store/');
  });

  it('should verify the "Schedule Consultation" button', () => {
    const scheduleBtn = '[data-id="875fcc7"] a.elementor-button';

    cy.get(scheduleBtn)
      .should('be.visible')
      .and('have.attr', 'href', 'https://calendly.com/encer-schedule/free-30min-encer-consultation-clone-clone')
      .and('have.attr', 'target', '_blank')
      .and('contain.text', 'Schedule Consultation');
  });

  it('should verify and click the "LOG IN" button', () => {
    cy.get('[data-id="76de71d"]')
      .contains('a.elementor-button', 'LOG IN')
      .should('have.attr', 'href', '/my-account')
      .and('be.visible')
      .click();

    // Accept either with or without trailing slash
    cy.location('pathname', { timeout: 10000 }).should('match', /^\/my-account\/?$/);
  });
});

// ================= LOGIN FORM =================

describe('Login Field Test', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Ignore site JS errors
    cy.visit('https://encer.store');
  });

  it('should click the LOG IN button and fill out the login form', () => {
    // Click the LOG IN button
    cy.get('[data-id="76de71d"]')
      .contains('a.elementor-button', 'LOG IN')
      .should('have.attr', 'href', '/my-account')
      .and('be.visible')
      .click();

    // Wait for the login page to load
    cy.url().should('include', '/my-account');

    // Fill in the username/email field
    cy.get('#username', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .type('rea@360-365.com');

    // Fill in the password field
    cy.get('#password')
      .should('be.visible')
      .type('Reaasella14');

    // Click the Log in button
    cy.get('button[name="login"]')
      .should('be.visible')
      .click();
  });
});

// ================= NEWSLETTER FORM =================

describe('Newsletter form - Forminator Form Submission Test', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Ignore site JS errors
    cy.visit('https://encer.store');
  });

  it('fills out the form and clicks the Download research button', () => {
    // Wait for the form to load and become visible
    cy.get('#forminator-module-14845', { timeout: 30000 })
      .should('exist')
      .invoke('attr', 'style', 'display: block;')
      .should('be.visible');

    // Fill in the First Name field
    cy.get('#forminator-module-14845 input[name="name-1-first-name"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Rea');
     
    // Fill in the Last Name field
    cy.get('#forminator-module-14845 input[name="name-1-last-name"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Test');

    // Fill in the Email field
    cy.get('#forminator-module-14845 input[name="email-1"]')
      .should('be.visible')
      .clear({ force: true })
      .type('rea@example.com');

    // Fill in the Phone field
    cy.get('#forminator-module-14845 input[name="phone-1"], #forminator-module-14851 input.iti__tel-input')
      .should('be.visible')
      .clear({ force: true })
      .type('201-555-0123');

    // Click the exact "Download research" button
    cy.get('#forminator-module-14845')
      .find('button.forminator-button-submit')
      .contains('Send')
      .should('be.visible')
      .click({ force: true });

    // Confirm form response if available
    cy.get('.forminator-response-message', { timeout: 10000 }).then(($el) => {
      if ($el.is(':visible')) {
        cy.log('Form response:', $el.text().trim());
      } else {
        cy.log('No visible response message');
      }
    });
  });
});

// ================= FAQ Section Tests =================

describe('FAQ Section Tests', () => {
  it('should expand each FAQ item and verify content visibility', () => {
    const faqItems = [
      '#elementor-tab-title-1321',
      '#elementor-tab-title-1322',
      '#elementor-tab-title-1323',
      '#elementor-tab-title-1324',
      '#elementor-tab-title-1325',
      '#elementor-tab-title-1326',
      '#elementor-tab-title-1327'
    ];

    faqItems.forEach((faq) => {
      cy.get(faq, { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true });

      const contentId = faq.replace('title', 'content');
      cy.get(contentId, { timeout: 10000 }).should('be.visible');

      cy.wait(500);
    });
  });
});

// ================= Footer Link Tests =================

describe('Footer & Info Link Tests', () => {
  const links = [
    { label: 'Money Back Guarantee and Return Policy', path: '/refund-policy/' },
    { label: 'Privacy Policy', path: '/privacy-policy/' },
    { label: 'T&Cs', path: '/terms-and-conditions/' },
    { label: 'Blog', path: '/blog/' },
    { label: 'Financing', path: '/financing/' },
    { label: 'Download Research', path: '/about/#downSection' }
  ];

  links.forEach((link) => {
    it(`should verify ${link.label} link`, () => {
      cy.contains(link.label)
        .should('be.visible')
        .and('have.attr', 'href')
        .then((href) => {
          expect(href).to.include(link.path);
        });

      cy.contains(link.label).click({ waitForAnimations: false });
      cy.url().should('include', link.path);
    });
  });
});

// ================= Desktop Navigation Menu Tests =================

Cypress.on('uncaught:exception', (err) => {
  // Suppress known non-blocking errors from the app
  if (
    err.message.includes("Cannot read properties of null") ||
    err.message.includes("reading 'style'") ||
    err.message.includes("reading 'use'") ||
    err.message.includes("Invalid regular expression")
  ) {
    return false;
  }
  return true;
});

describe('Encer Store Header Menu', () => {
  beforeEach(() => {
    cy.viewport(1280, 800); // Ensure desktop menu is visible
    cy.visit('https://encer.store/');
  });

  it('should display the logo and main navigation menu', () => {
    cy.get('img[alt=""]').should('be.visible'); // Logo
    cy.get('#menu-1-dcaf759').should('be.visible'); // Desktop menu
  });

  it('should open submenu under "Buy Encer"', () => {
    cy.get('a.has-submenu').contains('Buy Encer').click({ force: true });
    cy.get('ul.sub-menu').should('be.visible');
  });

  it('should have working main nav links', () => {
    cy.get('a').contains('About Encer').should('have.attr', 'href').and('include', '/about');
    cy.get('a').contains('Contact Us').should('have.attr', 'href').and('include', '/contact-us');
    cy.get('a').contains('FAQ').should('have.attr', 'href').and('include', '#FAQsec1');
  });

  it('should have Schedule Consultation and Login buttons', () => {
    cy.get('a').contains('Schedule Consultation').should('be.visible');
    cy.get('a[href*="/my-account"]').should('be.visible');
  });

  it('should show Amazon Store image with link', () => {
    cy.get('a[href*="amazon.com"]')
      .should('be.visible')
      .find('img[alt="Amazon Store"]')
      .should('exist');
  });
});

describe('Encer Desktop Menu Link Checks', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('https://encer.store/', { failOnStatusCode: false });
  });

  const menuLinks = [
    { label: 'About Encer', href: '/about/' },
    { label: 'Contact Us', href: '/contact-us/' },
    { label: 'FAQ', href: '/#FAQsec1' },
    { label: 'BALANCE TREATMENT', href: '/product/encer-balance-1-month-treatment/' },
    { label: 'BOOST TREATMENT', href: '/product/encer-balance-2-pack/' },
    { label: 'HARMONY TREATMENT', href: '/product/encer-boost-4-pack/' },
  ];

  it('should show correct menu items with correct hrefs', () => {
    menuLinks.forEach(item => {
      cy.get('a')
        .contains(item.label, { matchCase: false })
        .should('have.attr', 'href')
        .and('include', item.href.replace(/^\/+/, '')); // Normalize leading slashes
    });
  });
});

// ================= ENCER BALANCE TREATMENT =================


describe('ENCER BALANCE TREATMENT', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
  });

  it('should display product details correctly', () => {
    cy.document().its('readyState').should('eq', 'complete');

    cy.get('div.product h1', { timeout: 30000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log('Product Title:', text.trim());
        expect(text.trim()).to.include('ENCER Balance');
      });

    cy.get('div.elementor-element-eb72630 .elementor-heading-title', { timeout: 30000 })
      .should('be.visible')
      .invoke('text')
      .then((price) => {
        cy.log('Product Price:', price.trim());
        expect(price.trim()).to.eq('$79.00');
      });

    cy.get('form.cart button.single_add_to_cart_button', { timeout: 20000 })
      .should('be.visible')
      .invoke('text')
      .then((btnText) => {
        cy.log('Add to Cart Button Text:', btnText.trim());
        const normalizedText = btnText.trim().toLowerCase();
        expect(normalizedText.includes('add') || normalizedText.includes('order')).to.be.true;
      });
  });
});

describe('ENCER Button Tests', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
  });

  it('should verify ORDER NOW opens side cart with correct product', () => {
    cy.get('[data-id="7f69d2d8"] button.single_add_to_cart_button', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'ORDER NOW')
      .click();

    cy.get('#cfw-side-cart', { timeout: 20000 }).should('be.visible');

    cy.get('.cfw-cart-item-title span')
      .should('contain.text', 'ENCER BALANCE 1 month treatment');

    cy.get('.cfw-cart-item-subtotal .woocommerce-Price-amount')
      .should('contain.text', '$79.90');

    cy.get('.cfw-side-cart-quantity')
      .should('contain.text', '1');

    cy.window().then((win) => {
      const maintitle = win.document.getElementById('zsiq_maintitle');
      const titlediv = win.document.getElementById('titlediv');
      if (maintitle) maintitle.style.display = 'none';
      if (titlediv) titlediv.style.display = 'none';
    });

    cy.get('.cfw-primary-btn', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Proceed to checkout');
  });

describe('Schedule Consultation Button Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
  });

  it('should have correct consultation button link', () => {
    cy.get('#btn-sched-consultation')
      .should('have.attr', 'href', 'https://calendly.com/encer-schedule/free-30min-encer-consultation-clone-clone');
  });
});

  it('should verify VIEW ALL / Hide button toggles correctly', () => {
    // Verify initial button text is "VIEW ALL" (case-insensitive)
    cy.get('#btn-view-all-content', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('view all');
      });

    // Click to toggle to "Hide"
    cy.get('#btn-view-all-content').click();

    // Verify button text changed to "Hide" (case-insensitive)
    cy.get('#btn-view-all-content')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('hide');
      });

    // Optionally click again to toggle back to "VIEW ALL"
    cy.get('#btn-view-all-content').click();

    cy.get('#btn-view-all-content')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('view all');
      });

    // Add your own assertion here to check that the content is shown/hidden accordingly
    // Example placeholder: replace '#some-revealed-section' with actual selector
    // cy.get('#some-revealed-section').should('be.visible'); // after showing
    // cy.get('#some-revealed-section').should('not.be.visible'); // after hiding
  });
});

describe('Test the 3 tabs', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
  });

  it('should display Description tab content by default', () => {
    // Description tab button should be selected by default
    cy.get('#e-n-tab-title-21182764721')
      .should('have.attr', 'aria-selected', 'true')
      .click(); // optionally click it again to ensure active
    
    // Description content should be visible
    cy.get('#e-n-tab-content-21182764721')
      .should('be.visible')
      .and('contain.text', 'Package Quantity');
  });

  it('should switch to Ingredients tab and show correct content', () => {
    cy.get('#e-n-tab-title-21182764722')
      .click()
      .should('have.attr', 'aria-selected', 'true');
    
    cy.get('#e-n-tab-content-21182764722')
      .should('be.visible')
      .and('contain.text', 'INGREDIENTS');
  });

  it('should switch to Reviews tab and show reviews content', () => {
    cy.get('#e-n-tab-title-21182764723')
      .click()
      .should('have.attr', 'aria-selected', 'true');
    
    cy.get('#e-n-tab-content-21182764723')
      .should('be.visible')
      .within(() => {
        cy.contains('.review-name', 'Grace').should('exist');
        cy.contains('.review-name', 'Desmond').should('exist');
        cy.contains('.review-name', 'Daisy').should('exist');
      });
  });
});

// --- Tests for ENCER Boost 2 Pack --- 
describe('ENCER BOOST TREATMENT', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-2-pack/');
  });

  it('should display product details correctly', () => {
    cy.document().its('readyState').should('eq', 'complete');

    cy.get('div.product h1', { timeout: 30000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        cy.log('Product Title:', text.trim());
        expect(text.trim()).to.include('ENCER Boost Treatment');
      });

    // Updated price selector based on your HTML snippet
    cy.get('div.elementor-element-56a9c5b5 .elementor-heading-title', { timeout: 30000 })
      .should('be.visible')
      .invoke('text')
      .then((price) => {
        cy.log('Product Price:', price.trim());
        expect(price.trim()).to.eq('$149.90');
      });

    cy.get('form.cart button.single_add_to_cart_button', { timeout: 20000 })
      .should('be.visible')
      .invoke('text')
      .then((btnText) => {
        cy.log('Add to Cart Button Text:', btnText.trim());
        const normalizedText = btnText.trim().toLowerCase();
        expect(normalizedText.includes('add') || normalizedText.includes('order')).to.be.true;
      });
  });
});

describe('ENCER Button Tests', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-2-pack/');
  });

  it('should verify ORDER NOW opens side cart with correct product', () => {
    cy.get('[data-id="64f2aaff"] button.single_add_to_cart_button', { timeout: 20000 })
      .should('be.visible')
      .and('contain.text', 'ORDER NOW')
      .click();

    cy.get('#cfw-side-cart', { timeout: 20000 }).should('be.visible');

    cy.get('.cfw-cart-item-title span')
      .should('contain.text', 'ENCER BOOST 2 months treatment');

    cy.get('.cfw-cart-item-subtotal .woocommerce-Price-amount')
      .should('contain.text', '$149.90');

    cy.get('.cfw-side-cart-quantity')
      .should('contain.text', '1');

    // Hide chat widgets if present
    cy.window().then((win) => {
      const maintitle = win.document.getElementById('zsiq_maintitle');
      const titlediv = win.document.getElementById('titlediv');
      if (maintitle) maintitle.style.display = 'none';
      if (titlediv) titlediv.style.display = 'none';
    });

    // Close cookie banner if visible
    cy.get('body').then(($body) => {
      if ($body.find('.cky-consent-bar:visible').length) {
        cy.get('.cky-btn-accept:visible').first().click({ force: true });
      }
    });

    cy.get('.cfw-primary-btn', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'Proceed to checkout');
  });
});

  describe('Schedule Consultation Button Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('https://encer.store/product/encer-balance-2-pack/');
  });

  it('should have correct consultation button link', () => {
    cy.get('#btn-sched-consultation')
      .should('have.attr', 'href', 'https://calendly.com/encer-schedule/free-30min-encer-consultation-clone-clone');
  });

  it('should verify VIEW ALL / Hide button toggles correctly', () => {
    // Verify initial button text is "VIEW ALL" (case-insensitive)
    cy.get('#btn-view-all-content', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('view all');
      });

    // Click to toggle to "Hide"
    cy.get('#btn-view-all-content').click();

    // Verify button text changed to "Hide" (case-insensitive)
    cy.get('#btn-view-all-content')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('hide');
      });

    // Optionally click again to toggle back to "VIEW ALL"
    cy.get('#btn-view-all-content').click();

    cy.get('#btn-view-all-content')
      .invoke('text')
      .then((text) => {
        const cleanedText = text.trim().replace(/\s+/g, ' ');
        expect(cleanedText.toLowerCase()).to.eq('view all');
      });

    // Add your own assertion here to check that the content is shown/hidden accordingly
    // Example placeholder: replace '#some-revealed-section' with actual selector
    // cy.get('#some-revealed-section').should('be.visible'); // after showing
    // cy.get('#some-revealed-section').should('not.be.visible'); // after hiding
  });
    });


describe('Test the 3 tabs', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    Cypress.on('uncaught:exception', () => false);
    cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
  });

  it('should display Description tab content by default', () => {
    // Description tab button should be selected by default
    cy.get('#e-n-tab-title-21182764721')
      .should('have.attr', 'aria-selected', 'true')
      .click(); // optionally click it again to ensure active
    
    // Description content should be visible
    cy.get('#e-n-tab-content-21182764721')
      .should('be.visible')
      .and('contain.text', 'Package Quantity');
  });

  it('should switch to Ingredients tab and show correct content', () => {
    cy.get('#e-n-tab-title-21182764722')
      .click()
      .should('have.attr', 'aria-selected', 'true');
    
    cy.get('#e-n-tab-content-21182764722')
      .should('be.visible')
      .and('contain.text', 'INGREDIENTS');
  });

  it('should switch to Reviews tab and show reviews content', () => {
    cy.get('#e-n-tab-title-21182764723')
      .click()
      .should('have.attr', 'aria-selected', 'true');
    
    cy.get('#e-n-tab-content-21182764723')
      .should('be.visible')
      .within(() => {
        cy.contains('.review-name', 'Grace').should('exist');
        cy.contains('.review-name', 'Desmond').should('exist');
        cy.contains('.review-name', 'Daisy').should('exist');
      });
  });
});

// ================= ENCER HARMONY TREATMENT =================

  describe('ENCER HARMONY TREATMENT', () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      Cypress.on('uncaught:exception', () => false);
      cy.visit('https://encer.store/product/encer-boost-4-pack/');
    });

    it('should display product details correctly', () => {
      cy.document().its('readyState').should('eq', 'complete');

      cy.get('div.product h1', { timeout: 30000 })
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          cy.log('Product Title:', text.trim());
          expect(text.trim()).to.include('Harmony Support Treatment');
        });

      // Updated price selector based on your HTML snippet
      cy.get('div.elementor-element-523a1d9f .elementor-heading-title', { timeout: 30000 })
        .should('be.visible')
        .invoke('text')
        .then((price) => {
          cy.log('Product Price:', price.trim());
          expect(price.trim()).to.eq('$290.00');
        });

      cy.get('form.cart button.single_add_to_cart_button', { timeout: 20000 })
        .should('be.visible')
        .invoke('text')
        .then((btnText) => {
          cy.log('Add to Cart Button Text:', btnText.trim());
          const normalizedText = btnText.trim().toLowerCase();
          expect(normalizedText.includes('add') || normalizedText.includes('order')).to.be.true;
        });
    });
  });

  describe('ENCER Button Tests', () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      Cypress.on('uncaught:exception', () => false);
      cy.visit('https://encer.store/product/encer-boost-4-pack/');
    });

    it('should verify ORDER NOW opens side cart with correct product', () => {
      cy.get('[data-id="b3ca033"] button.single_add_to_cart_button', { timeout: 20000 })
        .should('be.visible')
        .and('contain.text', 'ORDER NOW')
        .click();

      cy.get('#cfw-side-cart', { timeout: 20000 }).should('be.visible');

      cy.get('.cfw-cart-item-title span')
        .should('contain.text', 'Encer HARMONY 4 months treatment');

      cy.get('.cfw-cart-item-subtotal .woocommerce-Price-amount')
        .should('contain.text', '$290');

      cy.get('.cfw-side-cart-quantity')
        .should('contain.text', '1');

      cy.window().then((win) => {
        const maintitle = win.document.getElementById('zsiq_maintitle');
        const titlediv = win.document.getElementById('titlediv');
        if (maintitle) maintitle.style.display = 'none';
        if (titlediv) titlediv.style.display = 'none';
      });

      cy.get('.cfw-primary-btn', { timeout: 10000 })
        .should('be.visible')
        .and('contain.text', 'Proceed to checkout');
    });

  describe('Schedule Consultation Button Test', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('https://encer.store/product/encer-boost-4-pack/');
  });

  it('should have correct consultation button link', () => {
    cy.get('#btn-sched-consultation')
      .should('have.attr', 'href', 'https://calendly.com/encer-schedule/free-30min-encer-consultation-clone-clone');
  });
});

    it('should verify VIEW ALL / Hide button toggles correctly', () => {
      // Verify initial button text is "VIEW ALL" (case-insensitive)
      cy.get('#btn-view-all-content', { timeout: 10000 })
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const cleanedText = text.trim().replace(/\s+/g, ' ');
          expect(cleanedText.toLowerCase()).to.eq('view all');
        });

      // Click to toggle to "Hide"
      cy.get('#btn-view-all-content').click();

      // Verify button text changed to "Hide" (case-insensitive)
      cy.get('#btn-view-all-content')
        .invoke('text')
        .then((text) => {
          const cleanedText = text.trim().replace(/\s+/g, ' ');
          expect(cleanedText.toLowerCase()).to.eq('hide');
        });

      // Optionally click again to toggle back to "VIEW ALL"
      cy.get('#btn-view-all-content').click();

      cy.get('#btn-view-all-content')
        .invoke('text')
        .then((text) => {
          const cleanedText = text.trim().replace(/\s+/g, ' ');
          expect(cleanedText.toLowerCase()).to.eq('view all');
        });

      // Add your own assertion here to check that the content is shown/hidden accordingly
      // Example placeholder: replace '#some-revealed-section' with actual selector
      // cy.get('#some-revealed-section').should('be.visible'); // after showing
      // cy.get('#some-revealed-section').should('not.be.visible'); // after hiding
    });
  });

  describe('Test the 3 tabs', () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      Cypress.on('uncaught:exception', () => false);
      cy.visit('https://encer.store/product/encer-balance-1-month-treatment/');
    });

    it('should display Description tab content by default', () => {
      // Description tab button should be selected by default
      cy.get('#e-n-tab-title-21182764721')
        .should('have.attr', 'aria-selected', 'true')
        .click(); // optionally click it again to ensure active
      
      // Description content should be visible
      cy.get('#e-n-tab-content-21182764721')
        .should('be.visible')
        .and('contain.text', 'Package Quantity');
    });

    it('should switch to Ingredients tab and show correct content', () => {
      cy.get('#e-n-tab-title-21182764722')
        .click()
        .should('have.attr', 'aria-selected', 'true');
      
      cy.get('#e-n-tab-content-21182764722')
        .should('be.visible')
        .and('contain.text', 'INGREDIENTS');
    });

    it('should switch to Reviews tab and show reviews content', () => {
      cy.get('#e-n-tab-title-21182764723')
        .click()
        .should('have.attr', 'aria-selected', 'true');
      
      cy.get('#e-n-tab-content-21182764723')
        .should('be.visible')
        .within(() => {
          cy.contains('.review-name', 'Grace').should('exist');
          cy.contains('.review-name', 'Desmond').should('exist');
          cy.contains('.review-name', 'Daisy').should('exist');
        });
    });
  });

// ================= ABOUT US PAGE =================

describe('About Us Page', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Ignore site JS errors
    cy.viewport(1280, 800); // Force desktop view to reveal desktop-only elements
    cy.visit('https://encer.store/about/');
  });

  it('should display the "About Encer" heading and form', () => {
    // Check if the heading is visible and validate its content (case-insensitive)
    cy.get('h1.elementor-heading-title.elementor-size-default', { timeout: 10000 })
      .should('be.visible')
      .then($el => {
        const actualText = $el.text().trim();
        cy.log('Found heading:', actualText);
        expect(actualText.toLowerCase()).to.eq('about encer');
      });
  });

  it('fills out the form and clicks the "Download research" button', () => {
    // Wait for the form to load and become visible
    cy.get('#forminator-module-14851', { timeout: 30000 })
      .should('exist')
      .invoke('attr', 'style', 'display: block;')
      .should('be.visible');

    // Fill in the Name field
    cy.get('#forminator-module-14851 input[name="name-1"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Rea Test only');

    // Fill in the Email field
    cy.get('#forminator-module-14851 input[name="email-1"]')
      .should('be.visible')
      .clear({ force: true })
      .type('rea@example.com');

    // Fill in the Phone field
    cy.get('#forminator-module-14851 input[name="phone-1"], #forminator-module-14851 input.iti__tel-input')
      .should('be.visible')
      .clear({ force: true })
      .type('201-555-0123');

    // Click the "Download research" button (scoped to the specific form)
    cy.get('#forminator-module-14851 button.forminator-button.forminator-button-submit')
      .should('have.length', 1)
      .should('be.visible')
      .and('contain.text', 'Download research')
      .click();

    // Optional: Confirm successful submission (update based on actual behavior)
    // cy.contains('Thank you for downloading').should('be.visible');
  });
});

// ================= CONTACT US PAGE =================

describe('Contact Us Page', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', () => false); // Ignore site JS errors
    cy.visit('https://encer.store/contact-us/');
  });

  it('should load the homepage', () => {
    // Check if the homepage contains a specific element
    cy.get('h1').should('contain', 'We’d love to hear from you');
  });

  it('should be visible', () => {
    // Ensure the page has loaded and specific elements are present
    cy.get('h1').should('contain', 'We’d love to hear from you');
  });

  it('fills out the form and submits it', () => {
    // ✅ Wait for visible form
    cy.get('form[class*="forminator-custom-form"]', { timeout: 30000 })
      .filter(':visible')
      .first()
      .as('form');

    // ✅ Fill out First Name
    cy.get('@form')
      .find('input[name="name-3-first-name"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Rea');

    // ✅ Fill out Last Name
    cy.get('@form')
      .find('input[name="name-3-last-name"]')
      .should('be.visible')
      .clear({ force: true })
      .type('Test');

    // ✅ Fill out Email
    cy.get('@form')
      .find('input[name="email-1"]')
      .should('be.visible')
      .clear({ force: true })
      .type('rea@example.com');

    // ✅ Fill out Phone Number
    cy.get('@form')
      .find('input.iti__tel-input')
      .should('be.visible')
      .click({ force: true })
      .clear({ force: true })
      .type('201-555-0123', { delay: 100 });

    // ✅ Check the checkbox
    cy.get('@form')
      .find('input[type="checkbox"][name="checkbox-1[]"]')
      .check({ force: true })
      .should('be.checked');

    // ✅ Optional: Detect presence of CAPTCHA iframe
    cy.get('body').then(($body) => {
      const $iframe = $body.find('iframe[src*="recaptcha"]');
      if ($iframe.length > 0) {
        cy.get('iframe[src*="recaptcha"]', { timeout: 20000 })
          .should('be.visible')
          .then(($iframe) => {
            const src = $iframe.attr('src');
            const siteKey = new URL(src).searchParams.get('k');
            cy.log('reCAPTCHA sitekey:', siteKey);
          });
      } else {
        cy.log('No reCAPTCHA iframe found, continuing without solving.');
      }
    });

    // ✅ Submit form
    cy.get('@form')
      .find('button.forminator-button-submit')
      .should('be.visible')
      .click({ force: true });

    // ✅ Confirm response
    cy.get('.forminator-response-message', { timeout: 10000 }).then(($el) => {
      if ($el.is(':visible')) {
        cy.log('Form response:', $el.text().trim());
      } else {
        cy.log('No visible response message');
      }
    });
  });
  });