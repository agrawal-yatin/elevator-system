import { Component, OnInit } from "@angular/core";
import { ElevatorService } from "../../services/elevator.service";

@Component({
  selector: "app-elevators",
  templateUrl: "./elevators.component.html",
  styleUrls: ["./elevators.component.scss"],
})
export class ElevatorsComponent implements OnInit {
  floors: number[] = [];
  reversedFloors: number[] = [];

  constructor(public elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.floors = this.elevatorService.getFloors();
    this.reversedFloors = [...this.floors].reverse();
  }
}
