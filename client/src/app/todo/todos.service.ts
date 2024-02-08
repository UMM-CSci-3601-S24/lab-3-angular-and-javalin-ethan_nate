import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Todos, TodosRole } from './todos';

/**
 * Service that provides the interface for getting information
 * about `Todoss` from the server.
 */
@Injectable()
export class TodosService {
  // The URL for the todoss part of the server API.
  readonly todosUrl: string = environment.apiUrl + 'todoss';

  // The private `HttpClient` is *injected* into the service
  // by the Angular framework. This allows the system to create
  // only one `HttpClient` and share that across all services
  // that need it, and it allows us to inject a mock version
  // of `HttpClient` in the unit tests so they don't have to
  // make "real" HTTP calls to a server that might not exist or
  // might not be currently running.
  constructor(private httpClient: HttpClient) {
  }

  /**
   * Get all the todoss from the server, filtered by the information
   * in the `filters` map.
   *
   * It would be more consistent with `TodosListComponent` if this
   * only supported filtering on age and role, and left company to
   * just be in `filterTodoss()` below. We've included it here, though,
   * to provide some additional examples.
   *
   * @param filters a map that allows us to specify a target role, age,
   *  or company to filter by, or any combination of those
   * @returns an `Observable` of an array of `Todoss`. Wrapping the array
   *  in an `Observable` means that other bits of of code can `subscribe` to
   *  the result (the `Observable`) and get the results that come back
   *  from the server after a possibly substantial delay (because we're
   *  contacting a remote server over the Internet).
   */
  getTodoss(filters?: { role?: TodosRole; age?: number; company?: string }): Observable<Todos[]> {
    // `HttpParams` is essentially just a map used to hold key-value
    // pairs that are then encoded as "?key1=value1&key2=value2&…" in
    // the URL when we make the call to `.get()` below.
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.role) {
        httpParams = httpParams.set('role', filters.role);
      }
      if (filters.age) {
        httpParams = httpParams.set('age', filters.age.toString());
      }
      if (filters.company) {
        httpParams = httpParams.set('company', filters.company);
      }
    }
    // Send the HTTP GET request with the given URL and parameters.
    // That will return the desired `Observable<Todos[]>`.
    return this.httpClient.get<Todos[]>(this.todosUrl, {
      params: httpParams,
    });
  }

  /**
   * Get the `Todos` with the specified ID.
   *
   * @param id the ID of the desired todos
   * @returns an `Observable` containing the resulting todos.
   */
  getTodosById(id: string): Observable<Todos> {
    return this.httpClient.get<Todos>(this.todosUrl + '/' + id);
  }

  /**
   * A service method that filters an array of `Todos` using
   * the specified filters.
   *
   * Note that the filters here support partial matches. Since the
   * matching is done locally we can afford to repeatedly look for
   * partial matches instead of waiting until we have a full string
   * to match against.
   *
   * @param todoss the array of `Todoss` that we're filtering
   * @param filters the map of key-value pairs used for the filtering
   * @returns an array of `Todoss` matching the given filters
   */
  filterTodoss(todoss: Todos[], filters: { name?: string; company?: string }): Todos[] {
    let filteredTodoss = todoss;

    if (filters.name) {
      filters.name = filters.name.toLowerCase();
      filteredTodoss = filteredTodoss.filter(todos => todos.name.toLowerCase().indexOf(filters.name) !== -1);
    }

    if (filters.company) {
      filters.company = filters.company.toLowerCase();
      filteredTodoss = filteredTodoss.filter(todos => todos.company.toLowerCase().indexOf(filters.company) !== -1);
    }

    return filteredTodoss;
  }
}
