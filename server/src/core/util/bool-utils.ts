export class BoolUtils {
  static toBoolean(val: string): boolean {
    return val && val.trim() === 'true';
  }
}
