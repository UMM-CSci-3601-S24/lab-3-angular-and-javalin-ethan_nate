import { TodoByIdPage } from 'cypress/support/todo-by-id';

const page = new TodoByIdPage();

describe('display a single todo by ID', () => {

  beforeEach(() => {
    page.navigateToById('58895985ae3b752b124e7663');
  });
  [
  {
      "_id": "58895985ae3b752b124e7663",
      "owner": "Fry",
      "status": true,
      "body": "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
      "category": "homework"
    },

    {
    "_id": "58895985186754887e0381f5",
    "owner": "Blanche",
    "status": true,
    "body": "Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.",
    "category": "software design"
  }
];


  /// <reference types="cypress" />

  it('Should have the correct page title', () => {
    page.getPageTitle().should('eq', 'Todos ID');
  });

  it('Should have the correct URL', () => {
    page.getTodoOwner().should('have.text', 'Fry');
  });

  it('Should display the correct for antoher ID todo', () => {
    page.navigateToById('58895985186754887e0381f5');
    page.getTodoOwner().should('have.text', 'Blanche');
  })

});
