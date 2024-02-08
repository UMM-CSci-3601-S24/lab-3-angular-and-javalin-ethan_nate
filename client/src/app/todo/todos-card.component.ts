import { Component, Input } from '@angular/core';
import { Todos } from './todos';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';


@Component({
    selector: 'app-todos-card',
    templateUrl: './todos-card.component.html',
    styleUrls: ['./todos-card.component.scss'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardAvatar, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatButton, RouterLink]
})
export class TodosCardComponent {

  @Input() todos: Todos;
  @Input() simple ? = false;
}
