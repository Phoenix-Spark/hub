import { Base, Cell, User } from '../types';
import { Repository } from './Repository';

export class UserRepository extends Repository {
  async getAll(): Promise<Cell[]> {
    return this.db.select();
  }

  selectUsersInfo() {
    return this.db.select<User[]>(
      'users.id, ' +
        'users.username, ' +
        'users.first_name as firstName, ' +
        'users.last_name as lastName, ' +
        'users.email, ' +
        'users.photo_url as photo, ' +
        'users.contact_number1 as contactNumber1, ' +
        'users.contact_number2 as contactNumber2, ' +
        'users.bio, ' +
        'users.base_id as baseId, ' +
        'users.cell_id as cellId'
    );
  }

  // getAllWithJoin(
  //   joinTable: string,
  //   joinColumn1: string,
  //   joinColumn2: string
  // ) {
  //   return this.db.select().join(joinTable, joinColumn1, joinColumn2).whereNot('is_approved', 'no');
  // }

  async getAllWithBases(): Promise<Cell[] & Base[]> {
    return this.getAllWithJoin('bases', 'bases.id', 'cells.id').whereNot('is_approved', 'no');
  }

  async findById(id: number): Promise<Cell> {
    return this.db.first().where('id', id);
  }

  async getByCellId(cellId: number) {
    return this.selectUsersInfo()
      .join('cells', 'users.cell_id', 'cells.id')
      .where('cells.endpoint', cellId);
  }

  async getByCellEndpoint(endpoint: string): Promise<User[]> {
    const data = await this.db
      .select('users.*')
      .join('cells', 'cells.id', '=', 'users.cell_id')
      .where('cells.endpoint', endpoint);

    data.forEach(
      (
        item: User & {
          contact_number1?: string;
          contact_number2?: string;
          first_name?: string;
          last_name?: string;
          base_id?: number;
          cell_id?: number;
          photo_url?: string;
        }
      ) => {
        item.contactNumbers = [item.contact_number1!, item.contact_number2!];
        item.firstName = item.first_name!;
        item.lastName = item.last_name!;
        item.baseId = item.base_id!;
        item.cellId = item.cell_id!;
        item.photo = item.photo_url!;

        delete item.contact_number1;
        delete item.contact_number2;
        delete item.first_name;
        delete item.last_name;
        delete item.base_id;
        delete item.cell_id;
        delete item.photo_url;
      }
    );

    return data;
  }
}
