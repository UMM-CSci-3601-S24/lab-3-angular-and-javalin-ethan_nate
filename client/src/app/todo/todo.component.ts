import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardSubtitle } from '@angular/material/card';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardSubtitle],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {
  todo = {
    "_id": "58895985ae3b752b124e7663",
    "owner": "Fry",
    "status": true,
    "body": "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
    "category": "homework"
  };
}
// Compare this snippet from client/src/app/users/user-list.component.ts:
