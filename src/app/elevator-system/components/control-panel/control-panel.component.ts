import { Component, OnInit } from "@angular/core";
import { ElevatorService } from "../../services/elevator.service";
import {
  ElevatorConstants,
  Direction as ElevatorDirection,
} from "../../constants/elevator.constants";

@Component({
  selector: "app-control-panel",
  templateUrl: "./control-panel.component.html",
  styleUrls: ["./control-panel.component.scss"],
})
export class ControlPanelComponent implements OnInit {
  public ELEVATOR_DIRECTIONS = ElevatorConstants.DIR;
  floors: number[] = [];
  loading = false;

  constructor(public elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.floors = this.elevatorService.getFloors();
  }

  requestElevator(floor: number, direction: ElevatorDirection) {
    this.elevatorService.requestElevator(floor, direction);
  }

  generateRandomRequest(): void {
    this.loading = true;
    setTimeout(() => {
      this.elevatorService.generateRandomRequest();
      this.loading = false;
    }, 400);
  }
}
