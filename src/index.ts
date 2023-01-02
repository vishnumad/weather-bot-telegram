import { configure as configureEnv } from './utils/environment';
import bot from './bot';

configureEnv();

bot();
