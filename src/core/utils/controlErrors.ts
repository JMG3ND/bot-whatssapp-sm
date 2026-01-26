import { saveError } from './registerErrorLog';

interface Options {
  nameLog?: string;
}

export async function controlErrors(fn: () => unknown, options?: Options): Promise<void> {
  try {
    await fn()
  } catch (error) {
    await saveError(error, options?.nameLog);
  }
}
