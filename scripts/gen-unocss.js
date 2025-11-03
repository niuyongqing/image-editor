import path from 'path';
import { theme } from 'ant-design-vue';
import lodash from 'lodash';
import fsExtra from 'fs-extra';
var defaultAlgorithm = theme.defaultAlgorithm, defaultSeed = theme.defaultSeed;
var mapToken = defaultAlgorithm(defaultSeed);
var formatKey = function (key, prefixCls) {
    return "".concat(prefixCls).concat(lodash.kebabCase(key));
};
var prefixCls = '--pro-ant-';
var variables = {
    colors: {},
};
var colorTheme = '';
for (var key in mapToken) {
    if (key.startsWith('color')) {
        var cssVar = formatKey(key, prefixCls);
        var colors = variables.colors;
        var themeKey = lodash.camelCase(key.slice(5));
        colors[themeKey] = "var(".concat(cssVar, ")");
        colorTheme += "".concat(themeKey, "\n");
    }
}
fsExtra.outputFile(path.resolve(process.cwd(), './themes/antd-uno-theme.json'), JSON.stringify(variables, null, 2));
fsExtra.outputFile(path.resolve(process.cwd(), './themes/color-theme-var.md'), colorTheme);
