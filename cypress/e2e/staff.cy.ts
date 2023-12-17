describe("Staff page", () => {
  const staffUsername = Cypress.env("STAFF_USERNAME");
  const staffPassword = Cypress.env("STAFF_PASSWORD");

  beforeEach(() => {
    //Change viewport to typical 1080p monitor and go to login page
    cy.viewport(1920, 1080 - 111)
    cy.visit("/accounts/login/");

    // Get login form and make sure it exists
    cy.get('form[action="/login/"]').should('exist').within(() => {
      // Write staff username, password and select staff as login then click the login button
      cy.get(`input[name="username"]`).type(staffUsername);
      cy.get(`input[name="password"]`).type(staffPassword);
      cy.get(`select[name="login_as"]`).select('staff');
      cy.get(`button[type="submit"]`).click();
    });

    // Wait for path to change to /staff meaning login was successful
    cy.location('pathname').should('eq', '/staff/');
    // Visit the groups staff page
    cy.visit('/staff/26/staffs/');
    // Make sure the visit was correct (could fail if use didn't have proper permissions)
    cy.location('pathname').should('eq', '/staff/26/staffs/');
    // Get the table in staff body, make sure it exists, and make an alias `rows` for its children
    cy.get('table tbody').should('exist').children().as('rows');

    // Intercept edit requests and give it alias `editRequest`
    cy.intercept("POST", `/staff/26/edit_user/${staffUsername}`).as('editRequest');
    // All tests will be on the done on the logged in staff user
    // So we get the row and edit row of the user and save them as
    // 'staffRow' and 'staffRowEdit'
    cy.get('@rows').filter(`[id="staff_${staffUsername}"]`).eq(0).as("staffRow");
    cy.get('@rows').filter(`[id="edit_staff_${staffUsername}"]`).eq(0).as("staffRowEdit");

    // Get the edit button and save changes button and alias them
    cy.get('@staffRowEdit').children().last().children().first().children().first().children().first().as('staffEditSaveButton');
    cy.get('@staffRow').children().last().children().first().children().first().children().first().as('staffEditButton');
  })

  // Search user test scenario
  context("Search user", () => {
    beforeEach(() => {
      // Make sure the search input exists before each test case
      // and alias the input as 'search'
      cy.get('input[type="search"]').should('exist').as('search');
    })

    it("[STAFF_007] Search staff (Should Pass)", () => {
      // type search value and make sure it was written
      cy.get('@search').type(staffUsername);
      cy.get('@search').invoke('val').should('eq', staffUsername);

      // Check the rows to make sure the filtering was done correctly
      cy.get('@rows').should('have.length.at.least', 2).should(($tr: JQuery<HTMLTableRowElement>) => {
        expect($tr.attr('id').includes(staffUsername), "is correct filtered value").to.equal(true);
      })
    })

    it("[STAFF_008] Search non existing staff (Should Pass)", () => {
      const nonExistentName = '159259025323';

      // type search value and make sure it was written
      cy.get('@search').type(nonExistentName);
      cy.get('@search').invoke('val').should('eq', nonExistentName);

      // Check the rows to make sure the filtering was done correctly
      cy.get('@rows').should('have.length', 1).children().invoke('text').should('eq', 'No matching records found');
    })

    it("[STAFF_009] Searching links/buttons in table (Should Fail)", () => {
      const searchValue = 'edit';

      // type search value and make sure it was written
      cy.get('@search').type(searchValue);
      cy.get('@search').invoke('val').should('eq', searchValue);

      // Check the rows to make sure the filtering was done correctly
      cy.get('@rows').should('have.length.at.least', 2).should(($tr: JQuery<HTMLTableRowElement>) => {
        expect($tr.attr('id').includes(searchValue), "is correct filtered value").to.equal(true);
      })
    })
  })


  // Adding user to staff list test scenario
  context("Adding user to staff list", () => {
    it("[STAFF_012] Number of staff entries in table (Should Fail)", () => {
      // Make sure count div exists and get its text
      cy.get('div[id="staffs_info"]').should('exist').invoke('text').then(text => {
        // extract the staff number from the text 
        // e.g. ['Showing', '1', 'to', '18', 'of', '18', 'entries'] would result in 18
        const numberOfStaff = +text.split(" ")[3];

        // Get number of staff rows and make sure it matches the number of staff
        cy.get('@rows').filter('[id^="staff"]').its('length').should('equal', numberOfStaff);
      })
    })
  })

  // Editing staff email test scenario 
  context("Editing staff email", () => {
    beforeEach(() => {
      // Get the current staff email and alias it
      cy.get('@staffRow').children().eq(3).invoke('text').as('staffEmail');

      // Get the current staff edit email input and alias it
      cy.get('@staffRowEdit').children().eq(5).children().first().as('staffEmailInput');

      // Click the edit button to show the edit row
      cy.get('@staffEditButton').click();
    })

    it("[STAFF_015] Change staff email (Should Pass)", () => {
      const testEmail = "test@email.com";

      // Clear the email input and type the test email
      cy.get('@staffEmailInput').clear().type(testEmail);
      // Click the save button
      cy.get('@staffEditSaveButton').click();

      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);
      // Make sure the final staff email matches the inputted email
      cy.get<string>('@staffEmail').should('equal', testEmail);
    })

    it("[STAFF_017] Change staff email with email quoted local-part (Should Fail)", () => {
      const testEmail = '"justnotright"@example.com';

      // Clear the email input and type the test email
      cy.get('@staffEmailInput').clear().type(testEmail);
      // Click the save button
      cy.get('@staffEditSaveButton').click();

      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);
      // Make sure the final staff email matches the inputted email
      cy.get<string>('@staffEmail').should('equal', testEmail);
    })

    it("[STAFF_018] Change staff email with local domain name that has no TLD (Should Pass)", () => {
      const testEmail = 'name@domain';

      // Clear the email input and type the test email
      cy.get('@staffEmailInput').clear().type(testEmail);
      // Click the save button
      cy.get('@staffEditSaveButton').click();

      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);
      // Make sure the final staff email matches the inputted email
      cy.get<string>('@staffEmail').should('equal', testEmail);
    })


    it("[STAFF_019] Change staff email with escaped mail route (Should Pass)", () => {
      const testEmail = 'user%example.com@example.org';

      // Clear the email input and type the test email
      cy.get('@staffEmailInput').clear().type(testEmail);
      // Click the save button
      cy.get('@staffEditSaveButton').click();

      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);
      // Make sure the final staff email matches the inputted email
      cy.get<string>('@staffEmail').should('equal', testEmail);
    })
  })

  // Editing staff name test scenario 
  context("Editing staff name", () => {
    beforeEach(() => {
      // Get the current staff first and last names and alias them
      cy.get('@staffRow').children().eq(1).invoke('text').as('staffFirstName');
      cy.get('@staffRow').children().eq(2).invoke('text').as('staffSecondName');

      // Get the current staff first and second name inputs and alias them
      cy.get('@staffRowEdit').children().eq(3).children().first().as('staffFirstNameInput');
      cy.get('@staffRowEdit').children().eq(4).children().first().as('staffSecondNameInput');

      // Click the edit button to show the edit row
      cy.get('@staffEditButton').click();
    })

    it("[STAFF_005] Change name of already added staff (Should Pass)", () => {
      const testFirstName = "Salah";
      const testLastName = "Bilal";

      // Clear the first and second name inputs and type the test names
      cy.get('@staffFirstNameInput').clear().type(testFirstName);
      cy.get('@staffSecondNameInput').clear().type(testLastName);

      // Click the save button
      cy.get('@staffEditSaveButton').click();
      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);

      // Make sure the final staff names matches the inputted names
      cy.get<string>('@staffFirstName').should('equal', testFirstName);
      cy.get<string>('@staffSecondName').should('equal', testLastName);
    })
  })

  // Editing staff permissions test scenario 
  context("Editing staff permissions", () => {
    beforeEach(() => {
      // Get the current staff goal permission and alias it
      cy.get('@staffRow').children().eq(4).invoke('text').as('staffGoal');

      // Get the current staff goal permission select and alias it
      cy.get('@staffRowEdit').children().eq(6).children().first().as('staffGoalSelect');

      // Click the edit button to show the edit row
      cy.get('@staffEditButton').click();
    })

    it(`[STAFF_021] Set "Goal" permission to "N/A" (Should Pass)`, () => {
      // Select 'N/A' from the staff goal select
      cy.get('@staffGoalSelect').select('0');
      // Click the save button
      cy.get('@staffEditSaveButton').click();
      // Wait for edit request to finish and to have status code of 200
      cy.wait('@editRequest').its('response.statusCode').should('equal', 200);
      // Make sure the final staff goal permissions matches the select permission
      cy.get<string>('@staffGoal').should('equal', 'N/A');
    })
  })
})
