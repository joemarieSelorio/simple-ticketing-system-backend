import { runSeeders } from 'typeorm-extension';
import { connectionSource } from '../../ormconfig';

(async () => {
  connectionSource.initialize().then(async () => {
    await runSeeders(connectionSource);
    process.exit();
  });
})();
