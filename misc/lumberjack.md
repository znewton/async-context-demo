```ts
// www.ts
import {
  Lumberjack,
  ILumberjackEngine,
  Lumber,
  LogLevel,
} from '@fluidframework/server-services-telemetry';

class ConsoleLumberjackEngine implements ILumberjackEngine {
  public emit(lumber: Lumber): void {
    if (lumber.logLevel == LogLevel.Error) {
      console.error(lumber.message, lumber.properties, lumber.exception);
    } else {
      console.log(lumber.message, lumber.properties);
    }
  }
}

const engines: ILumberjackEngine[] = [new ConsoleLumberjackEngine()];
Lumberjack.setup(engines);

// api.ts
import { Lumberjack } from '@fluidframework/server-services-telemetry';

async function api() {
  const properties = { tenantId: 'fluid' };
  try {
    doSomething();
    Lumberjack.info('Something happened', properties);
    // outputs console.log
  } catch (error) {
    Lumberjack.error('Something bad happened', properties, error);
    // outputs console.error
  }
}
```
