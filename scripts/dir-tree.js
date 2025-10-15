var _a;
import dirTree from 'directory-tree';
import treeify from 'treeify';
var filteredTree = dirTree(process.cwd(), {
    exclude: [/node_modules/, /\.git/, /\.vscode/, /\.idea/],
});
var children = (_a = filteredTree.children) !== null && _a !== void 0 ? _a : [];
var genObj = function (children) {
    var obj = {};
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        obj[child.name] = ((child === null || child === void 0 ? void 0 : child.children) && child.children.length > 0) ? genObj(child.children) : null;
    }
    return obj;
};
var obj = genObj(children);
var md = treeify.asTree(obj, true, null);
console.log(md);
