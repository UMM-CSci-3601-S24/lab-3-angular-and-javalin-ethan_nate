import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todos } from './todos';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  // A small collection of test todoss
  const testTodoss: Todos[] = [
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
  let todosService: TodosService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todosService = new TodosService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('getTodoss()', () => {

    it('calls `api/todoss` when `getTodoss()` is called with no parameters', () => {
      // Assert that the todoss we get from this call to getTodoss()
      // should be our set of test todoss. Because we're subscribing
      // to the result of getTodoss(), this won't actually get
      // checked until the mocked HTTP request 'returns' a response.
      // This happens when we call req.flush(testTodoss) a few lines
      // down.
      todosService.getTodoss().subscribe(
        todoss => expect(todoss).toBe(testTodoss)
      );

      // Specify that (exactly) one request will be made to the specified URL.
      const req = httpTestingController.expectOne(todosService.todosUrl);
      // Check that the request made to that URL was a GET request.
      expect(req.request.method).toEqual('GET');
      // Check that the request had no query parameters.
      expect(req.request.params.keys().length).toBe(0);
      // Specify the content of the response to that request. This
      // triggers the subscribe above, which leads to that check
      // actually being performed.
      req.flush(testTodoss);
    });

    describe('Calling getTodoss() with parameters correctly forms the HTTP request', () => {
      /*
       * We really don't care what `getTodoss()` returns in the cases
       * where the filtering is happening on the server. Since all the
       * filtering is happening on the server, `getTodoss()` is really
       * just a "pass through" that returns whatever it receives, without
       * any "post processing" or manipulation. So the tests in this
       * `describe` block all confirm that the HTTP request is properly formed
       * and sent out in the world, but don't _really_ care about
       * what `getTodoss()` returns as long as it's what the HTTP
       * request returns.
       *
       * So in each of these tests, we'll keep it simple and have
       * the (mocked) HTTP request return the entire list `testTodoss`
       * even though in "real life" we would expect the server to
       * return return a filtered subset of the todoss.
       */

      it('correctly calls api/todoss with filter parameter \'admin\'', () => {
        todosService.getTodoss({ role: 'admin' }).subscribe(
          todoss => expect(todoss).toBe(testTodoss)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todosService.todosUrl) && request.params.has('role')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role parameter was 'admin'
        expect(req.request.params.get('role')).toEqual('admin');

        req.flush(testTodoss);
      });

      it('correctly calls api/todoss with filter parameter \'age\'', () => {

        todosService.getTodoss({ age: 25 }).subscribe(
          todoss => expect(todoss).toBe(testTodoss)
        );

        // Specify that (exactly) one request will be made to the specified URL with the age parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todosService.todosUrl) && request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the age parameter was '25'
        expect(req.request.params.get('age')).toEqual('25');

        req.flush(testTodoss);
      });

      it('correctly calls api/todoss with multiple filter parameters', () => {

        todosService.getTodoss({ role: 'editor', company: 'IBM', age: 37 }).subscribe(
          todoss => expect(todoss).toBe(testTodoss)
        );

        // Specify that (exactly) one request will be made to the specified URL with the role parameter.
        const req = httpTestingController.expectOne(
          (request) => request.url.startsWith(todosService.todosUrl)
            && request.params.has('role') && request.params.has('company') && request.params.has('age')
        );

        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');

        // Check that the role, company, and age parameters are correct
        expect(req.request.params.get('role')).toEqual('editor');
        expect(req.request.params.get('company')).toEqual('IBM');
        expect(req.request.params.get('age')).toEqual('37');

        req.flush(testTodoss);
      });
    });
  });

  describe('getTodosByID()', () => {
    it('calls api/todoss/id with the correct ID', () => {
      // We're just picking a Todos "at random" from our little
      // set of Todoss up at the top.
      const targetTodos: Todos = testTodoss[1];
      const targetId: string = targetTodos._id;

      todosService.getTodosById(targetId).subscribe(
        // This `expect` doesn't do a _whole_ lot.
        // Since the `targetTodos`
        // is what the mock `HttpClient` returns in the
        // `req.flush(targetTodos)` line below, this
        // really just confirms that `getTodosById()`
        // doesn't in some way modify the todos it
        // gets back from the server.
        todos => expect(todos).toBe(targetTodos)
      );

      const expectedUrl: string = todosService.todosUrl + '/' + targetId;
      const req = httpTestingController.expectOne(expectedUrl);
      expect(req.request.method).toEqual('GET');

      req.flush(targetTodos);
    });
  });

  describe('filterTodoss()', () => {
    /*
     * Since `filterTodoss` actually filters "locally" (in
     * Angular instead of on the server), we do want to
     * confirm that everything it returns has the desired
     * properties. Since this doesn't make a call to the server,
     * though, we don't have to use the mock HttpClient and
     * all those complications.
     */
    it('filters by name', () => {
      const todosName = 'i';
      const filteredTodoss = todosService.filterTodoss(testTodoss, { name: todosName });
      // There should be two todoss with an 'i' in their
      // name: Chris and Jamie.
      expect(filteredTodoss.length).toBe(2);
      // Every returned todos's name should contain an 'i'.
      filteredTodoss.forEach(todos => {
        expect(todos.name.indexOf(todosName)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by company', () => {
      const todosCompany = 'UMM';
      const filteredTodoss = todosService.filterTodoss(testTodoss, { company: todosCompany });
      // There should be just one todos that has UMM as their company.
      expect(filteredTodoss.length).toBe(1);
      // Every returned todos's company should contain 'UMM'.
      filteredTodoss.forEach(todos => {
        expect(todos.company.indexOf(todosCompany)).toBeGreaterThanOrEqual(0);
      });
    });

    it('filters by name and company', () => {
      // There's only one todos (Chris) whose name
      // contains an 'i' and whose company contains
      // an 'M'. There are two whose name contains
      // an 'i' and two whose company contains an
      // an 'M', so this should test combined filtering.
      const todosName = 'i';
      const todosCompany = 'M';
      const filters = { name: todosName, company: todosCompany };
      const filteredTodoss = todosService.filterTodoss(testTodoss, filters);
      // There should be just one todos with these properties.
      expect(filteredTodoss.length).toBe(1);
      // Every returned todos should have _both_ these properties.
      filteredTodoss.forEach(todos => {
        expect(todos.name.indexOf(todosName)).toBeGreaterThanOrEqual(0);
        expect(todos.company.indexOf(todosCompany)).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
