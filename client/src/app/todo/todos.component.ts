import {Component} from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
    selector: 'app-todos-component',
    templateUrl: 'todos.component.html',
    styleUrls: ['./todos.component.scss'],
    providers: [],
    standalone: true,
    imports: [MatCard]
})
export class TodosComponent {}
