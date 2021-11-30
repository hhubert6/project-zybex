import { Vector } from '../types';

export interface Moveable {
  pos: Vector;
  velocity: Vector;
  dimensions: Vector;
}
