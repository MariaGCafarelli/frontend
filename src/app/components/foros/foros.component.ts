import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-foros',
  templateUrl: './foros.component.html',
  styleUrls: ['./foros.component.scss'],
})
export class ForosComponent implements OnInit {
  forums: any[] = [];
  filteredForums: Observable<string[]>;
  filterForum = '';
  myControl = new FormControl();
  currentPage: number = 1;
  nextPage: boolean = false;
  myforums: any;
  notMyforums: any[] = [];
  currentUrl: string;
  previousUrl: string;
  categories: any[];
  subcategories: any[];
  selectedIdCategory: number;
  selectedIdSubcategory: number;
  searchTermText: string;
  searchText: string;
  searchTextModelChanged: Subject<string> = new Subject<string>();
  searchTextModelChangeSubscription: Subscription;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchTextModelChangeSubscription = this.searchTextModelChanged
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((newText) => {
        this.searchTermText = newText;
        this.waveService
          .getAllForums({
            selectedIdCategory: this.selectedIdCategory,
            selectedIdSubcategory: this.selectedIdSubcategory,
            searchTerm: this.searchTermText,
          })
          .subscribe(
            (response) => {
              this.forums = response.items;
              this.currentPage = parseInt(response.meta.currentPage);
              this.nextPage =
                this.currentPage !== parseInt(response.meta.totalPages);
            },
            (err) => console.log(err)
          );
      });
    // Carga todos los Foros
    this.waveService.getAllForums({}).subscribe((response) => {
      this.forums = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      this.waveService.getForumsPostsByUser().subscribe((res) => {
        this.myforums = res.forums;
        console.log(this.myforums);
        let vart;
        for (let entry of this.forums) {
          vart = this.myforums.find((ob) => ob.id == entry.id);
          if (vart == null) {
            this.notMyforums.push(entry);
          }
        }
      });
    });

    this.previousUrl = this.waveService.getPreviousUrl();

    this.waveService.getAllCategories().subscribe((response) => {
      this.categories = response;
    });
  }

  onChangeCategory(target) {
    this.selectedIdCategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        console.log(response);
        this.forums = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
    this.waveService
      .getSubcategoryByCategory(this.selectedIdCategory)
      .subscribe((response) => {
        this.subcategories = response.subCategories;
      });
  }

  onChangeSubcategory(target) {
    this.selectedIdSubcategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        selectedIdSubcategory: this.selectedIdSubcategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        console.log(response);
        this.forums = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  traerMasForos() {
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        selectedIdSubcategory: this.selectedIdSubcategory,
        searchTerm: this.filterForum,
        currentPage: this.currentPage + 1,
      })
      .subscribe((response) => {
        this.forums = this.forums.concat(response.items);
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
          console.log(this.myforums);
        });
      }
    });
  }

  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
          console.log(this.myforums);
        });
        
      }
    });
  }

  isFav(id: number) {
    let vart;
    if (this.myforums) {
      vart = this.myforums.find((ob) => ob.id == id);
      if (vart == null) {
        return false;
      }
      return true;
    }
  }
}
