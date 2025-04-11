export const ElevatorConstants = {
  DIR: {
    UP: "Up",
    DOWN: "Down",
    IDLE: "Idle",
  } as const,

  CONFIG: {
    TOTAL_FLOORS: 10,
    TOTAL_ELEVATORS: 4,
    DEFAULT_HALT_TIME: 1000, // milliseconds
  },
};

export type Direction =
  (typeof ElevatorConstants.DIR)[keyof typeof ElevatorConstants.DIR];

export type Config = typeof ElevatorConstants.CONFIG;
