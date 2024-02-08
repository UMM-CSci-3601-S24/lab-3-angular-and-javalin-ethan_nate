import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TodosComponent} from './todos.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';

describe('Todos', () => {

  let fixture: ComponentFixture<TodosComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MatCardModule, TodosComponent],
});

    fixture = TestBed.createComponent(TodosComponent);


    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('.todos-card'));
    el = de.nativeElement;
  });

  it('It has the basic todos page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('This is a todos page! It doesn\'t do anything!');
  });

});
