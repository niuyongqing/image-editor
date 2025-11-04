import { resolve } from 'path';
import * as process from 'process';
import fsExtra from 'fs-extra';
import { transformSync } from 'esbuild';
var themeConfig = resolve(process.cwd(), './src/config/default-setting.ts');
var code = fsExtra.readFileSync(themeConfig, 'utf-8');
var toJs = function (code) {
    var res = transformSync(code, {
        target: 'esnext',
        loader: 'ts',
    });
    console.log(res.code);
};
toJs(code);
