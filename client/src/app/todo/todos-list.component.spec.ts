import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockTodosService } from '../../testing/todos.service.mock';
import { Todos } from './todos';
import { TodosCardComponent } from './todos-card.component';
import { TodosListComponent } from './todos-list.component';
import { TodosService } from './todos.service';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('TodosListComponent', () => {

  // The `TodosListComponent` being tested
  let todosList: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  // Set up the `TestBed` so that it uses
  // a `MockTodosService` in place of the real `TodosService`
  // for the purposes of the testing. We also have to include
  // the relevant imports and declarations so that the tests
  // can find all the necessary parts.
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodosListComponent, TodosCardComponent],
    // providers:    [ TodosService ]  // NO! Don't provide the real service!
    // Provide a test-double instead
    // This MockerTodosService is defined in client/testing/todos.service.mock.
    providers: [{ provide: TodosService, useValue: new MockTodosService() }]
});
  });

  // This constructs the `todosList` (declared
  // above) that will be used throughout the tests.
  beforeEach(waitForAsync(() => {
    // Compile all the components in the test bed
    // so that everything's ready to go.
    TestBed.compileComponents().then(() => {
      /* Create a fixture of the TodosListComponent. That
      * allows us to get an instance of the component
      * (todosList, below) that we can control in
      * the tests.
      */
      fixture = TestBed.createComponent(TodosListComponent);
      todosList = fixture.componentInstance;
      /* Tells Angular to sync the data bindings between
      * the model and the DOM. This ensures, e.g., that the
      * `todosList` component actually requests the list
      * of todoss from the `MockTodosService` so that it's
      * up to date before we start running tests on it.
      */
      fixture.detectChanges();
    });
  }));

  it('contains all the todoss', () => {
    expect(todosList.serverFilteredTodoss.length).toBe(3);
  });

  it('contains a todos named "Chris"', () => {
    expect(todosList.serverFilteredTodoss.some((todos: Todos) => todos.name === 'Chris')).toBe(true);
  });

  it('contains a todos named "Jamie"', () => {
    expect(todosList.serverFilteredTodoss.some((todos: Todos) => todos.name === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a todos named "Santa"', () => {
    expect(todosList.serverFilteredTodoss.some((todos: Todos) => todos.name === 'Santa')).toBe(false);
  });

  it('has two todoss that are 37 years old', () => {
    expect(todosList.serverFilteredTodoss.filter((todos: Todos) => todos.age === 37).length).toBe(2);
  });
});

/*
 * This test is a little odd, but illustrates how we can use stubs
 * to create mock objects (a service in this case) that be used for
 * testing. Here we set up the mock TodosService (todosServiceStub) so that
 * _always_ fails (throws an exception) when you request a set of todoss.
 *
 * So this doesn't really test anything meaningful in the context of our
 * code (I certainly wouldn't copy it), but it does illustrate some nice
 * testing tools. Hopefully it's useful as an example in that regard.
 */
describe('Misbehaving Todos List', () => {
  let todosList: TodosListComponent;
  let fixture: ComponentFixture<TodosListComponent>;

  let todosServiceStub: {
    getTodoss: () => Observable<Todos[]>;
    getTodossFiltered: () => Observable<Todos[]>;
  };

  beforeEach(() => {
    // stub TodosService for test purposes
    todosServiceStub = {
      getTodoss: () => new Observable(observer => {
        observer.error('getTodoss() Observer generates an error');
      }),
      getTodossFiltered: () => new Observable(observer => {
        observer.error('getTodossFiltered() Observer generates an error');
      })
    };

    TestBed.configureTestingModule({
    imports: [COMMON_IMPORTS, TodosListComponent],
    // providers:    [ TodosService ]  // NO! Don't provide the real service!
    // Provide a test-double instead
    providers: [{ provide: TodosService, useValue: todosServiceStub }]
});
  });

  // Construct the `todosList` used for the testing in the `it` statement
  // below.
  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodosListComponent);
      todosList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('fails to load todoss if we do not set up a TodosListService', () => {
    // Since calling both getTodoss() and getTodossFiltered() return
    // Observables that then throw exceptions, we don't expect the component
    // to be able to get a list of todoss, and serverFilteredTodoss should
    // be undefined.
    expect(todosList.serverFilteredTodoss).toBeUndefined();
  });
});
