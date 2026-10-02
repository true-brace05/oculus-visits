export interface Storage {
  incr(id: string): Promise<number>;
  get(id: string): Promise<number>;
}
