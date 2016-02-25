'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (_ref) {
	var t = _ref.types;

	return {
		visitor: {
			ImportDeclaration: function ImportDeclaration(path) {
				if (path.node.source.value.indexOf('!sofe') >= 0 && path.node.source.value.lastIndexOf('!sofe') === path.node.source.value.length - '!sofe'.length) {
					var variableName = t.identifier(path.node.specifiers[0].local.name);
					var sofeServiceName = path.node.source.value.substring(0, path.node.source.value.indexOf('!sofe'));
					var memberExpression = t.memberExpression(t.memberExpression(t.identifier('window'), t.identifier('__synchronousSofe__')), t.identifier(sofeServiceName));
					memberExpression.property = t.stringLiteral(memberExpression.property.name);
					memberExpression.computed = true;
					path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(variableName, memberExpression)]));
				}
			}
		}
	};
};