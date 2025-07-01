import { Injectable } from '@nestjs/common';
import { FindOptionsOrder, ObjectLiteral } from 'typeorm';
import { Links, MetaResultDto } from './dto/result.dto';
import * as T from './paginate.type';

@Injectable()
export class PaginateService {
  async paginate<T extends ObjectLiteral>({ repository, query, where = {}, keyMap, relations }: T.Paginate<T>) {
    const order: FindOptionsOrder<T> = {};

    for (const [key, direction] of (query.sortBy || []) as [keyof T, 'ASC' | 'DESC'][]) {
      order[key] = direction as FindOptionsOrder<T>[keyof T];
    }

    for (const key in query) {
      if (query[key] && keyMap[key]) {
        const mappedValue = keyMap[key](query[key]);
        if (mappedValue !== undefined) {
          Object.assign(where, mappedValue);
        }
      }
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const totalItems = await repository.count({ where });

    const data = await repository.find({
      skip,
      where,
      order,
      relations,
      take: limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    const metaResult: MetaResultDto = {
      totalItems,
      totalPages,
      select: [],
      searchBy: [],
      currentPage: page,
      itemsPerPage: limit,
      sortBy: query.sortBy || {},
      search: query.search || '',
    };

    const links: Links = {
      first: page > 1 ? `?page=1&limit=${limit}` : undefined,
      previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : undefined,
      current: `?page=${page}&limit=${limit}`,
      next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : undefined,
      last: `?page=${totalPages}&limit=${limit}`,
    };

    return { data: data, meta: metaResult, links };
  }
}
