


/**
 * Represents a page object for interacting with a specific todo item by its ID.
 */
export class TodoByIdPage {
  /**
   * Navigates to the page for a specific todo item by its ID.
   *
   * @param id - The ID of the todo item.
   * @returns A chainable object representing the navigation action.
   */
  navigateToById(id: string) {
    return cy.visit('/todos/' + id);
  }

  /**
   * Gets the URL of the current page.
   *
   * @returns The URL of the current page.
   */
  getUrl() {
    return cy.url();
  }

  /**
   * Gets the page title, which appears in the page tab.
   *
   * @returns The title of the component page.
   */
  getPageTitle() {
    return cy.title();
  }

  /**
   * Gets the owner of the todo item.
   *
   * @returns A chainable object representing the owner element.
   */
  getTodoOwner() {
    return cy.get('.todo-owner');
  }
}

