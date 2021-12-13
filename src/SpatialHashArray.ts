interface client {
  x: number;
  width: number;
  indices: number[];
  data: any;
}

export default class SpatialHashArray {
  public cells: Set<client>[];

  constructor(private cellWidth: number, private cellCount: number) {
    this.cells = [...Array(cellCount)].map((_) => new Set());
  }

  addClient(x: number, width: number, data: any) {
    const client: client = { x, width, data, indices: [] };
    this.insert(client);
  }

  removeClient(client: client) {
    const [x1, x2] = client.indices;

    for (let x = x1, xn = x2; x <= xn; x++) {
      this.cells[x].delete(client);
    }
  }

  getInRange(xPos: number, width: number): client[] {
    const x1 = this.getCellIndex(xPos);
    const x2 = this.getCellIndex(xPos + width);

    if (x2 >= this.cells.length) return [];

    const clients: client[] = [];

    for (let x = x1, xn = x2; x <= xn; x++) {
      clients.push(...Array.from(this.cells[x]));
    }

    return clients.reduce(
      (acc: client[], v) => (acc.find((a) => a === v) ? acc : [...acc, v]),
      [],
    );
  }

  private insert(client: client) {
    const x1 = this.getCellIndex(client.x);
    const x2 = this.getCellIndex(client.x + client.width);

    client.indices = [x1, x2];

    for (let x = x1, xn = x2; x <= xn; x++) {
      this.cells[x].add(client);
    }
  }

  private getCellIndex(x: number) {
    return (x / this.cellWidth) | 0;
  }
}
