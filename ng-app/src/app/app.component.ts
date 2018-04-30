import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  showFHIRSearch = true;
  showLocalSearch = false;
  showDownloader = false;
  showUploader = false;

  toggleLocalSearch() { this.showLocalSearch = !this.showLocalSearch; }
  toggleFHIRSearch() { this.showFHIRSearch = !this.showFHIRSearch; }
  toggleDownloader() { this.showDownloader = !this.showDownloader; }
  toggleUploader() { this.showUploader = !this.showUploader; }

 }
