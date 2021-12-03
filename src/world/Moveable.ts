import { Vector } from '../vector';
import { MapElement } from './Map';

export interface Moveable {
  pos: Vector;
  velocity: Vector;
  dimensions: Vector;
}

export const getBoundings = ({ pos, dimensions }: Moveable | MapElement) => {
  const [x, y] = pos;
  const [w, h] = dimensions;

  // prettier-ignore
  return [
    x,      // left
    x + w,  // right
    y,      // top
    y + h,  // bottom
  ];
};
