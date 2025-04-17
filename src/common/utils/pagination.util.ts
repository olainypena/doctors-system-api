import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationUtil {
  /**
   * @param page - The page number.
   * @param pageSize - The page size.
   * @returns An object with take and skip properties.
   * @example
   * const users: User[] = await this.usersRepository.find({
   *  ...pagination(dto.page, dto.pageSize),
   * where: {
   * email: dto.email,
   * });
   */
  setPagination = (
    page: number,
    pageSize: number,
  ): {
    take: number;
    skip: number;
  } => ({
    take: pageSize,
    skip: pageSize * (page - 1),
  });

  /**
   * @param page - The page number.
   * @param pageSize - The page size.
   * @param totalCount - The total count of items.
   * @returns An object with page, pageSize, totalPages and totalCount properties.
   * @example
   * return {
   * statusCode: HttpStatus.OK,
   * message: 'Users retrieved',
   * data: {
   * page: dto.page,
   * pageSize: dto.pageSize,
   * totalPages: Math.ceil(usersCount / dto.pageSize),
   * totalCount: usersCount,
   * users,
   * },
   * };
   */
  setPaginationRes = (
    page: number,
    pageSize: number,
    totalCount: number,
  ): {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  } => ({
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
  });
}
