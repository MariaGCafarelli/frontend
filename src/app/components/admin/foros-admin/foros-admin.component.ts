import { Component, OnInit, ViewChild } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-foros-admin',
  templateUrl: './foros-admin.component.html',
  styleUrls: ['./foros-admin.component.scss'],
})
export class ForosAdminComponent implements OnInit {
  categories: any[] = [];
  files: File[] = [];
  panelOpenState = false;
  panelOpenState2 = false;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    this.waveService.getAllForumsAdmin().subscribe((response) => {
      this.categories = response;
    });
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
}
