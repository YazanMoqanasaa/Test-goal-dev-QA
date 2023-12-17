describe("Testing observe button", () => {
      beforeEach(()=>{
          cy.visit('https://goal-dev.mdx.ac.uk')//Login to the site
          
    });
    it('open login page open',()=>{
          cy.get('form[action="/login/"]').should('exist');//Check and ensure that the Login button is present
        });
  
        it('login conatin username ',()=>
  {
        //Check and ensure that the Username and Password text box is present
       cy.get('#id_username').should('exist').should('have.attr','name','username');
       cy.get('#id_password').should('exist').should('have.attr','name','password');
      });
  
  
  
      //Check and ensure that the Username and Password text box is present
  it('login works and open staff page open GOALs and testing Apply Filters ',()=>{
    cy.get('#id_username').type('YazanMoqanasa');
    cy.get('#id_password').type('course12345');
    cy.get('select[name="login_as"]').select('staff');
    cy.get(' button[type="submit"]').click().should('exist');
  
  
   
        //Examine the opening button on the first page of the staff
          cy.get('a[href*="26"]').click();
        
  
  
                  
          //Examine the opening button on the first page of the employee
          cy.get('a[href*="goals"]').click();

         // Check and make sure that clicking "observe" working as required according to the pairing attached below, and make sure to test this button
  
          cy.get('button.btn.btn-primary.mt-2.w-100[onclick="observeAll(\'add\', this)"]').click();
          
              
         
  })
  });
  