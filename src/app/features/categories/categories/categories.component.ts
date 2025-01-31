import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CategoryService, Category } from '../../../core/services/category/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories$: Observable<Category[]>;

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit(): void {}
}
