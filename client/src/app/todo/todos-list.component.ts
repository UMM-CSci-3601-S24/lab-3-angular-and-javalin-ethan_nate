import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todos, TodosRole } from './todos';
import { TodosService } from './todos.service';
import { Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';
import { MatNavList, MatListSubheaderCssMatStyler, MatListItem, MatListItemAvatar, MatListItemTitle, MatListItemLine } from '@angular/material/list';
import { TodosCardComponent } from './todos-card.component';

import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel, MatHint, MatError } from '@angular/material/form-field';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

/**
 * A component that displays a list of todoss, either as a grid
 * of cards or as a vertical list.
 *
 * The component supports local filtering by name and/or company,
 * and remote filtering (i.e., filtering by the server) by
 * role and/or age. These choices are fairly arbitrary here,
 * but in "real" projects you want to think about where it
 * makes the most sense to do the filtering.
 */
@Component({
    selector: 'app-todos-list-component',
    templateUrl: 'todos-list.component.html',
    styleUrls: ['./todos-list.component.scss'],
    providers: [],
    standalone: true,
    imports: [MatCard, MatCardTitle, MatCardContent, MatFormField, MatLabel, MatInput, FormsModule, MatHint, MatSelect, MatOption, MatRadioGroup, MatRadioButton, TodosCardComponent, MatNavList, MatListSubheaderCssMatStyler, MatListItem, RouterLink, MatListItemAvatar, MatListItemTitle, MatListItemLine, MatError]
})
export class TodosListComponent implements OnInit, OnDestroy {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredTodoss: Todos[];
  public filteredTodoss: Todos[];

  public todosName: string;
  public todosAge: number;
  public todosRole: TodosRole;
  public todosCompany: string;
  public viewType: 'card' | 'list' = 'card';

  errMsg = '';
  private ngUnsubscribe = new Subject<void>();

  /**
   * This constructor injects both an instance of `TodosService`
   * and an instance of `MatSnackBar` into this component.
   *
   * @param todosService the `TodosService` used to get todoss from the server
   * @param snackBar the `MatSnackBar` used to display feedback
   */
  constructor(private todosService: TodosService, private snackBar: MatSnackBar) {
    // Nothing here – everything is in the injection parameters.
  }

  /**
   * Get the todoss from the server, filtered by the role and age specified
   * in the GUI.
   */
  getTodossFromServer() {
    // A todos-list-component is paying attention to todosService.getTodoss()
    // (which is an Observable<Todos[]>).
    // (For more on Observable, see: https://reactivex.io/documentation/observable.html)
    this.todosService.getTodoss({
      // Filter the todoss by the role and age specified in the GUI
      role: this.todosRole,
      age: this.todosAge
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      // Next time we see a change in the Observable<Todos[]>,
      // refer to that Todos[] as returnedTodoss here and do the steps in the {}
      next: (returnedTodoss) => {
        // First, update the array of serverFilteredTodoss to be the Todos[] in the observable
        this.serverFilteredTodoss = returnedTodoss;
        // Then update the filters for our client-side filtering as described in this method
        this.updateFilter();
      },
      // If we observe an error in that Observable, put that message in a snackbar so we can learn more
      error: (err) => {
        if (err.error instanceof ErrorEvent) {
          this.errMsg = `Problem in the client – Error: ${err.error.message}`;
        } else {
          this.errMsg = `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`;
        }
      },
    })
  }

  /**
   * Called when the filtering information is changed in the GUI so we can
   * get an updated list of `filteredTodoss`.
   */
  public updateFilter() {
    this.filteredTodoss = this.todosService.filterTodoss(
      this.serverFilteredTodoss, { name: this.todosName, company: this.todosCompany }
    );
  }

  /**
   * Starts an asynchronous operation to update the todoss list
   */
  ngOnInit(): void {
    this.getTodossFromServer();
  }

  /**
   * When this component is destroyed, we should unsubscribe to any
   * outstanding requests.
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
