import { Injectable } from "@angular/core";
import { Elevator } from "../models/elevator.model";
import {
  ElevatorConstants,
  Direction as ElevatorDirection,
} from "../constants/elevator.constants";

@Injectable({
  providedIn: "root",
})
export class ElevatorService {
  // Array to hold the state of all elevators
  elevators: Elevator[] = [];
  // Array to store log messages for elevator requests and movements
  requestLogs: string[] = [];
  // Array to hold All Floors
  floors: number[] = [];

  constructor() {
    // Initializes the Elevator array with Default Elevators starting at floor 1
    for (let i = 1; i <= ElevatorConstants.CONFIG.TOTAL_ELEVATORS; i++) {
      this.elevators.push({
        id: i,
        currentFloor: 1,
        direction: ElevatorConstants.DIR.IDLE,
        upQueue: [],
        downQueue: [],
        busy: false,
      });
    }

    // Initializes the Floor array with Default Floors from Config File
    this.floors = Array.from(
      { length: ElevatorConstants.CONFIG.TOTAL_FLOORS },
      (_, i) => i + 1
    );
  }

  // Retrieves the list of Floors
  getFloors(): number[] {
    return this.floors;
  }

  // Retrieves the current list of elevators
  getElevators(): Elevator[] {
    return this.elevators;
  }

  // Retrieves the list of request logs
  getLogs(): string[] {
    return this.requestLogs;
  }

  // Clears all the request logs
  clearLogs(): void {
    this.requestLogs = [];
  }

  // Helper method for tracking List Data by index
  trackByIndex(index: number): number {
    return index;
  }

  // Generates a random elevator request based on a random floor and direction
  generateRandomRequest(): void {
    const floor =
      Math.floor(Math.random() * ElevatorConstants.CONFIG.TOTAL_FLOORS) + 1;
    const direction =
      floor === 1
        ? ElevatorConstants.DIR.UP
        : floor === ElevatorConstants.CONFIG.TOTAL_FLOORS
        ? ElevatorConstants.DIR.DOWN
        : Math.random() > 0.5
        ? ElevatorConstants.DIR.UP
        : ElevatorConstants.DIR.DOWN;

    this.requestElevator(floor, direction);
  }

  // Handles an elevator request by determining the best elevator to service it
  requestElevator(floor: number, direction: ElevatorDirection) {
    // Choose an icon based on the direction to visually log the request
    const directionIcon =
      direction === ElevatorConstants.DIR.UP
        ? "bi-arrow-up-circle"
        : direction === ElevatorConstants.DIR.DOWN
        ? "bi-arrow-down-circle"
        : "bi-box-arrow-in-down";

    // Add a formatted log entry with icon and floor info to the top of the logs array
    this.requestLogs.unshift(
      `<i class="me-1 bi ${directionIcon} text-success"></i> Request at Floor ${floor} (${direction})`
    );

    // Find elevators that are currently moving in the requested direction
    const movingElevators = this.elevators.filter((e) => {
      if (e.busy && e.direction === direction) {
        // Include elevators below the floor going up or above going down
        return direction === ElevatorConstants.DIR.UP
          ? e.currentFloor < floor
          : e.currentFloor > floor;
      }
      return false;
    });

    // Find elevators that are idle and not currently serving any requests
    const idleElevators = this.elevators.filter(
      (e) => e.direction === ElevatorConstants.DIR.IDLE && !e.busy
    );

    // If there are elevators already moving in the right direction,
    // assign the request to the closest one
    if (movingElevators.length) {
      const chosenElevator = this.getClosestElevator(movingElevators, floor);
      this.enqueueFloor(chosenElevator, floor, direction);
      return;
    }

    // If no moving elevators, try to assign to a nearby idle elevator
    if (idleElevators.length) {
      const chosenElevator = this.getClosestElevator(idleElevators, floor);
      chosenElevator.direction = direction;
      this.enqueueFloor(chosenElevator, floor, direction);
      return;
    }

    // If no ideal elevators, fallback to the one with the least total queue size
    const leastBusy = this.elevators.reduce((prev, curr) => {
      const prevLoad = prev.upQueue.length + prev.downQueue.length;
      const currLoad = curr.upQueue.length + curr.downQueue.length;
      return prevLoad <= currLoad ? prev : curr;
    });

    // Assign the request to the least busy elevator
    this.enqueueFloor(leastBusy, floor, direction);
  }

  // Adds the requested floor to the elevator's queue and initiates its movement
  private enqueueFloor(
    elevator: Elevator,
    floor: number,
    direction: ElevatorDirection
  ) {
    // Highlight the Elevator (Shown by Yellow Colored Border in App)
    elevator.justAssigned = true;
    setTimeout(() => (elevator.justAssigned = false), 1000);

    // Determine which queue to use based on the direction
    const queue =
      direction === ElevatorConstants.DIR.UP
        ? elevator.upQueue
        : elevator.downQueue;

    if (!queue.includes(floor)) {
      queue.push(floor);

      // Sort the queue:
      // For Up direction → ascending (1 → 10)
      // For Down direction → descending (10 → 1)
      queue.sort((a, b) =>
        direction === ElevatorConstants.DIR.UP ? a - b : b - a
      );
    }

    // Initiate the elevator's movement
    this.moveElevator(elevator);
  }

  // Finds the elevator closest to the requested floor
  private getClosestElevator(
    allElevators: Elevator[],
    requestedFloorNumber: number
  ): Elevator {
    return allElevators.reduce((previousElevator, currentElevator) => {
      // Compare distances and return the one with the smaller gap to the requested floor
      const prevDiff = Math.abs(
        previousElevator.currentFloor - requestedFloorNumber
      );
      const currDiff = Math.abs(
        currentElevator.currentFloor - requestedFloorNumber
      );
      return currDiff < prevDiff ? currentElevator : previousElevator;
    });
  }

  // Simulates the movement of an elevator to its next stop, handling loading/unloading
  private moveElevator(elevator: Elevator) {
    if (elevator.busy) return;

    // Function to determine the next floor this elevator should stop at
    const getNextStop = (): number | null => {
      // If upQueue has any floors in it, take the first one out and return it. Otherwise, return null.
      if (elevator.direction === ElevatorConstants.DIR.UP) {
        return elevator.upQueue.length ? elevator.upQueue.shift()! : null;
      }
      // Same for down queue
      else if (elevator.direction === ElevatorConstants.DIR.DOWN) {
        return elevator.downQueue.length ? elevator.downQueue.shift()! : null;
      }
      // If idle, determine direction based on available queue and pick the first floor
      else {
        if (elevator.upQueue.length) {
          elevator.direction = ElevatorConstants.DIR.UP;
          return elevator.upQueue.shift()!;
        } else if (elevator.downQueue.length) {
          elevator.direction = ElevatorConstants.DIR.DOWN;
          return elevator.downQueue.shift()!;
        }
        return null;
      }
    };

    // Get the next target floor
    const requestedFloor = getNextStop();

    // If no valid floor or floor is outside bounds, mark elevator idle and exit
    if (
      requestedFloor === null ||
      requestedFloor < 1 ||
      requestedFloor > ElevatorConstants.CONFIG.TOTAL_FLOORS
    ) {
      elevator.direction = ElevatorConstants.DIR.IDLE;
      elevator.busy = false;
      return;
    }

    elevator.busy = true;

    // Determine whether we're going up or down by comparing target and current floors
    const step = requestedFloor > elevator.currentFloor ? 1 : -1;

    // Set up an interval to simulate elevator movement one floor at a time
    const interval = setInterval(() => {
      // Move the elevator one floor in the chosen direction
      elevator.currentFloor += step;

      // Clamp the current floor between 1 and max floor to avoid invalid states
      elevator.currentFloor = Math.max(
        1,
        Math.min(ElevatorConstants.CONFIG.TOTAL_FLOORS, elevator.currentFloor)
      );

      // Log the movement to the current floor
      this.requestLogs.unshift(
        `<i class="me-1 bi bi-arrows-vertical text-primary"></i> Elevator ${elevator.id} moved to Floor ${elevator.currentFloor}`
      );

      // If elevator is at floor 1 while going down, or at top floor while going up, stop the movement
      if (
        (step === -1 && elevator.currentFloor === 1) ||
        (step === 1 &&
          elevator.currentFloor === ElevatorConstants.CONFIG.TOTAL_FLOORS)
      ) {
        clearInterval(interval);
        elevator.direction = ElevatorConstants.DIR.IDLE;
        elevator.busy = false;
        setTimeout(() => {
          // Log & Simulate passenger loading/unloading
          this.requestLogs.unshift(
            `<i class="me-1 bi bi-door-open text-danger"></i> Elevator ${elevator.id} loading/unloading at Floor ${elevator.currentFloor}`
          );
        }, ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);

        return;
      }

      // If elevator has reached its requested floor
      if (elevator.currentFloor === requestedFloor) {
        // stop moving at the target floor
        clearInterval(interval);

        // Log & Simulate passenger loading/unloading
        setTimeout(() => {
          this.requestLogs.unshift(
            `<i class="me-1 bi bi-door-open text-warn"></i> Elevator ${elevator.id} loading/unloading at Floor ${elevator.currentFloor}`
          );

          // Check if there are still floors queued in the same direction
          const hasMoreInSameDirection =
            (elevator.direction === ElevatorConstants.DIR.UP &&
              elevator.upQueue.length > 0) ||
            (elevator.direction === ElevatorConstants.DIR.DOWN &&
              elevator.downQueue.length > 0);

          // If not, set direction to idle
          if (!hasMoreInSameDirection)
            elevator.direction = ElevatorConstants.DIR.IDLE;

          elevator.busy = false;
          // Mark elevator free and call moveElevator again to check next request
          this.moveElevator(elevator);
        }, ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
      }
    }, ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
  }
}
