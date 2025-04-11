import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ElevatorSystemModule } from "./elevator-system/elevator-system.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ElevatorSystemModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
