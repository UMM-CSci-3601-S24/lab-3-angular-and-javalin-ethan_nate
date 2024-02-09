import { TodoByIdPage } from 'cypress/support/todo-by-id';

const page = new TodoByIdPage();

describe('display a single todo by ID', () => {

  beforeEach(() => {
    page.navigateToById('58895985ae3b752b124e7663');
  });

  /*  {
    "_id": "58895985ae3b752b124e7663",
    "owner": "Fry",
    "status": true,
    "body": "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
    "category": "homework"
  },
  */

  /// <reference types="cypress" />

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos ID');
  });

  it('Should have the correct URL', () => {
    page.getTodoOwner().should('have.text', 'Fry');
  });

});
