import { Direction as ElevatorDirection } from "../constants/elevator.constants";

// Elevator interface to define structure of each elevator
export interface Elevator {
  id: number;
  currentFloor: number;
  direction: ElevatorDirection;
  upQueue: number[];
  downQueue: number[];
  busy: boolean;
  justAssigned?: boolean;
}
