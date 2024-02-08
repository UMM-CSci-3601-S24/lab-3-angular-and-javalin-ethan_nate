import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todos, TodosRole } from '../app/todo/todos';
import { TodosService } from '../app/todo/todos.service';

/**
 * A "mock" version of the `TodosService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable()
export class MockTodosService extends TodosService {
  static testTodoss: Todos[] = [
    {
      _id: 'chris_id',
      name: 'Chris',
      age: 25,
      company: 'UMM',
      email: 'chris@this.that',
      role: 'admin',
      avatar: 'https://gravatar.com/avatar/8c9616d6cc5de638ea6920fb5d65fc6c?d=identicon'
    },
    {
      _id: 'pat_id',
      name: 'Pat',
      age: 37,
      company: 'IBM',
      email: 'pat@something.com',
      role: 'editor',
      avatar: 'https://gravatar.com/avatar/b42a11826c3bde672bce7e06ad729d44?d=identicon'
    },
    {
      _id: 'jamie_id',
      name: 'Jamie',
      age: 37,
      company: 'Frogs, Inc.',
      email: 'jamie@frogs.com',
      role: 'viewer',
      avatar: 'https://gravatar.com/avatar/d4a6c71dd9470ad4cf58f78c100258bf?d=identicon'
    }
  ];

  constructor() {
    super(null);
  }

  // It's OK that the `_filters` argument isn't used here, so we'll disable
  // this warning for just his function.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTodoss(_filters: { role?: TodosRole; age?: number; company?: string }): Observable<Todos[]> {
    // Our goal here isn't to test (and thus rewrite) the service, so we'll
    // keep it simple and just return the test todoss regardless of what
    // filters are passed in.
    //
    // The `of()` function converts a regular object or value into an
    // `Observable` of that object or value.
    return of(MockTodosService.testTodoss);
  }

  getTodosById(id: string): Observable<Todos> {
    // If the specified ID is for one of the test todoss,
    // return that todos, otherwise return `null` so
    // we can test illegal todos requests.
    if (id === MockTodosService.testTodoss[0]._id) {
      return of(MockTodosService.testTodoss[0]);
    } else if (id === MockTodosService.testTodoss[1]._id) {
      return of(MockTodosService.testTodoss[1]);
    } else if (id === MockTodosService.testTodoss[2]._id) {
      return of(MockTodosService.testTodoss[2]);
    } else {
      return of(null);
    }
  }

}
