import { criarApp } from './app';
import { env } from './config/env';

const app = criarApp();

app.listen(env.PORT, () => {
  console.info(`API do KeepIT em http://localhost:${env.PORT}`);
});
