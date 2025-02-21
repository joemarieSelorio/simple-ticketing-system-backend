import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../users/users.entity';
import { UserSeed } from '../seeds/user.seeds';
import * as bcrypt from 'bcrypt';

export default class AdminUserSeeder implements Seeder {
  public async run(datasource: DataSource): Promise<void> {
    const repository = datasource.getRepository(User);
    
    const [adminPassword, userPassword] = await Promise.all([
      bcrypt.hash(UserSeed[0].password, 10),
      bcrypt.hash(UserSeed[1].password, 10),
    ])
  
    await Promise.allSettled([
      repository.save({
        ...UserSeed[0],
        password: adminPassword,
      }),
      repository.save({
        ...UserSeed[1],
        password: userPassword,
      }),
    ]);
  }
}
