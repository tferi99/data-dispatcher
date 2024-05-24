import * as path from 'path';
import * as fs from 'fs';

export class NodeUtils {
  static getVersion(packageName: string) {
    const pjson = NodeUtils.getPackageJson();
    return pjson.dependencies[packageName];
  }

  private static getPackageJson() {
    const packageJsonPath = path.resolve(__dirname, '..', '..', 'package.json');
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  }
}
