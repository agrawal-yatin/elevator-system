import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ElevatorSystemComponent } from "./components/elevator-system/elevator-system.component";
import { ElevatorsComponent } from "./components/elevators/elevators.component";
import { ControlPanelComponent } from "./components/control-panel/control-panel.component";
import { RequestLogsComponent } from "./components/request-logs/request-logs.component";

@NgModule({
  declarations: [
    ElevatorSystemComponent,
    ElevatorsComponent,
    ControlPanelComponent,
    RequestLogsComponent,
  ],
  imports: [CommonModule],
  exports: [ElevatorSystemComponent],
})
export class ElevatorSystemModule {}
