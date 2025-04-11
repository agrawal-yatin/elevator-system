import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ElevatorService } from "../../services/elevator.service";
import { Elevator } from "../../models/elevator.model";

@Component({
  selector: "app-elevator-system",
  templateUrl: "./elevator-system.component.html",
  styleUrls: ["./elevator-system.component.scss"],
})
export class ElevatorSystemComponent implements OnInit, AfterViewInit {
  elevators: Elevator[] = [];
  requestLogs: string[] = [];

  @ViewChild("modalTrigger") modalTrigger!: ElementRef;

  constructor(private elevatorService: ElevatorService) {}

  ngOnInit(): void {
    this.elevators = this.elevatorService.getElevators();
    this.requestLogs = this.elevatorService.getLogs();
  }

  ngAfterViewInit(): void {
    if (this.modalTrigger) {
      this.modalTrigger.nativeElement.click();
    }
  }
}
