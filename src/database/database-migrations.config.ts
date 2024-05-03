import { DataSource, DataSourceOptions } from 'typeorm';

import { databaseConfig } from './database.config';

export default new DataSource({
  ...(databaseConfig as unknown as DataSourceOptions),
});
