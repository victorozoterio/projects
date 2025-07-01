import { FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';

export type Paginate<T extends ObjectLiteral> = {
  // biome-ignore lint/suspicious/noExplicitAny: Must be 'any' because its a generic function and can receive multiple types.
  query: any;
  repository: Repository<T>;
  keyMap: { [key: string]: (value: string) => FindOptionsWhere<T> };
  where?: FindOptionsWhere<T>;
  relations?: string[];
};
