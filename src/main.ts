import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // ✅ Correct path
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { AppModule } from '../app.module';
import { ScheduleComponent } from './app/schedule/schedule.component'; 
import { AppModule } from './app/app.module';


bootstrapApplication(AppComponent,appConfig), {
  providers: [provideHttpClient()]
};

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  bootstrapApplication(ScheduleComponent)
  .catch(err => console.error(err));

  const platform = platformBrowserDynamic();

// Destroy the platform if needed
platform.destroy();

platform.bootstrapModule(AppModule)
  .catch(err => console.error(err));
  


