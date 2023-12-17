describe('Goal page', () => {

    it('Test the grade dropdown list for all student', () => {

        // First, open the website to test it
        cy.visit('https://goal-dev.mdx.ac.uk/');

        // Open the login page
        cy.get('form[action="/login/"]').should('exist').within(() => {
            cy.get('input[name="username"]').type('YazanMoqanasa');
            cy.get('input[name="password"]').type('course12345');
            cy.get('select[name="login_as"]').select('staff');
            cy.get('button[type="submit"]').click();
            
        });
        
        // Click on the "Open" button to open the group module
        cy.contains('Open').parent('li').find('a').click();

        // Open "Student" page from nav bar
        cy.get('.navbar-nav').contains('Student').click();
        cy.url().should('include', '/staff/44/student/');

        // Add student
        cy.get('#new_student').type('malak');

        // Click on "Add student" button
        cy.get('button[data-toggle="popover"][onclick="addStudent()"]').click();

        // Open "Goal" page from nav bar
        cy.visit('/staff/44/goals/');

        // Open "Add Goal" page from "Goal" page at nav bar
        cy.get('ul.nav-tabs').contains('Add Goal').click();

        // Add Goal
        cy.get('#id_name').type('Assignment #3'); // add name
        cy.get('#id_topic').type('QA');           // add topic
        cy.get('#id_level').select('High');       // add level
        cy.get('#id_start').type('2023-05-07');   // add start date
        cy.get('#id_ECD').type('2023-05-15');     // add ECD

        // Click on the "save" button to save the goal
        cy.get('button[type="submit"]').contains('Save').click();

        // click on "Observe" page
        cy.contains('a.nav-link', 'Observe').click();

        // select "All Goals" from the "Group Filter"
        cy.get('input[type="checkbox"][name="all_goals"][id="all_goals"]').check({ force: true });

        // select "All" from the "Group Filter"
        cy.get('input[type="checkbox"][name="all_groups"][id="all_groups"]').check({ force: true });

        // Uncheck the "Not observed" checkbox
        cy.get('input#not_observed').uncheck({ force: true });

        // Click on "observe" button
        cy.get('button.btn-primary').contains('Observe').click();

        // select from the grade dropdown: grade 5
        cy.get('select[name="grade"]').select('5', { force: true });
    });
});

describe('Goal page', () => {

    it('Test the grade dropdown list for one student', () => {

        // First, open the website to test it
        cy.visit('https://goal-dev.mdx.ac.uk/');

        // Open the login page
        cy.get('form[action="/login/"]').should('exist').within(() => {
            cy.get('input[name="username"]').type('YazanMoqanasa');
            cy.get('input[name="password"]').type('course12345');
            cy.get('select[name="login_as"]').select('staff');
            cy.get('button[type="submit"]').click();
        });
        
        // Click on the "Open" button to open the group module
        cy.contains('Open').parent('li').find('a').click();

        // Open "Student" page from nav bar
        cy.get('.navbar-nav').contains('Student').click();
        cy.url().should('include', '/staff/44/student/');

        // Add student
        cy.get('#new_student').type('Ahmad');

        // Click on "Add student" button
        cy.get('button[data-toggle="popover"][onclick="addStudent()"]').click();

        // Open "Goal" page from nav bar
        cy.visit('/staff/44/goals/');

        // Open "Add Goal" page from "Goal" page at nav bar
        cy.get('ul.nav-tabs').contains('Add Goal').click();

        // Add Goal
        cy.get('#id_name').type('Write essay');   // add name
        cy.get('#id_topic').type('English');      // add topic
        cy.get('#id_level').select('Low');        // add level
        cy.get('#id_start').type('2023-04-01');   // add start date
        cy.get('#id_ECD').type('2023-04-13');     // add ECD

        // Click on the "save" button to save the goal
        cy.get('button[type="submit"]').contains('Save').click();

        // Click on "Observe" page
        cy.contains('a.nav-link', 'Observe').click();

        // Select "English" choice from the "Goal Filter"
        cy.get('#topic_181').check({ force: true });

        // Select "2" group from the "Group Filter"
        cy.get('input[name="groups_filter"]').check({ force: true });

        // Uncheck the "Not observed" checkbox
        cy.get('input#not_observed').uncheck({ force: true });

        // Click on "observe" button
        cy.get('button.btn-primary').contains('Observe').click();

        // Click on the "observe" button when show the student information
        cy.get('button.btn-primary').click({ multiple: true });

        // Select from the grade dropdown: grade 10, for one student
        // I used the eq() function to select the required element by index
        cy.get('select[name="grade"]').eq(0).select('10', { force: true });

    });
});

