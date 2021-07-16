import { initalize } from './modules/schema';
import { initalizeApi } from './modules/hcloud';

require('dotenv').config();
initalize();
initalizeApi();

console.log('loaded without errors');
