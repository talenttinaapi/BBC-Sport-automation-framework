import { setWorldConstructor } from '@cucumber/cucumber';

class CustomWorld { page: any = null; }
setWorldConstructor(CustomWorld);
