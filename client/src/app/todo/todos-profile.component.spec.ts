import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockTodosService } from '../../testing/todos.service.mock';
import { Todos } from './todos';
import { TodosCardComponent } from './todos-card.component';
import { TodosProfileComponent } from './todos-profile.component';
import { TodosService } from './todos.service';

describe('TodosProfileComponent', () => {
  let component: TodosProfileComponent;
  let fixture: ComponentFixture<TodosProfileComponent>;
  const mockTodosService = new MockTodosService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id: chrisId
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RouterTestingModule,
        MatCardModule,
        TodosProfileComponent, TodosCardComponent
    ],
    providers: [
        { provide: TodosService, useValue: mockTodosService },
        { provide: ActivatedRoute, useValue: activatedRoute }
    ]
})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific todos profile', () => {
    const expectedTodos: Todos = MockTodosService.testTodoss[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodosProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodos._id });
    expect(component.todos).toEqual(expectedTodos);
  });

  it('should navigate to correct todos when the id parameter changes', () => {
    let expectedTodos: Todos = MockTodosService.testTodoss[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `TodosProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedTodos._id });
    expect(component.todos).toEqual(expectedTodos);

    expect(component.todos).toEqual(expectedTodos);

    // Changing the paramMap should update the displayed todos profile.
    expectedTodos = MockTodosService.testTodoss[1];
    activatedRoute.setParamMap({ id: expectedTodos._id });

    expect(component.todos).toEqual(expectedTodos);
  });

  it('should have `null` for the todos for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a todos, we expect the service
    // to return `null`, so we would expect the component's todos
    // to also be `null`.
    expect(component.todos).toBeNull();
  });

  it('should set error data on observable error', () => {
    activatedRoute.setParamMap({ id: chrisId });

    const mockError = { message: 'Test Error', error: { title: 'Error Title' } };

    // const errorResponse = { status: 500, message: 'Server error' };
    // "Spy" on the `.addTodos()` method in the todos service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const getTodosSpy = spyOn(mockTodosService, 'getTodosById')
      .and
      .returnValue(throwError(() => mockError));

    // component.todos = throwError(() => mockError) as Observable<Todos>;

    component.ngOnInit();

    expect(component.error).toEqual({
      help: 'There was a problem loading the todos – try again.',
      httpResponse: mockError.message,
      message: mockError.error.title,
    });
    expect(getTodosSpy).toHaveBeenCalledWith(chrisId);
  });
});
