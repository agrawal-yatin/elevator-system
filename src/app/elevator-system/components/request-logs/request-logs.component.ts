import { Component } from "@angular/core";
import { ElevatorService } from "../../services/elevator.service";

@Component({
  selector: "app-request-logs",
  templateUrl: "./request-logs.component.html",
  styleUrls: ["./request-logs.component.scss"],
})
export class RequestLogsComponent {
  currentTime: Date = new Date();

  constructor(public elevatorService: ElevatorService) {}

  clearLogs(): void {
    this.elevatorService.clearLogs();
  }
}
