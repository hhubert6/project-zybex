import { Vector } from '../vector';

export interface MapElement {
  pos: Vector;
  dimensions: Vector;
  color: string;
}
export type gameMap = Array<MapElement>;

/**
 * Map with inverted y pos (y = 0 is bottom of the map)
 */
export const map: gameMap = [
  {
    pos: [100, 0],
    dimensions: [20, 10],
    color: 'blue',
  },
  {
    pos: [125, 0],
    dimensions: [20, 10],
    color: 'blue',
  },
  {
    pos: [225, 0],
    dimensions: [20, 30],
    color: 'blue',
  },
];
