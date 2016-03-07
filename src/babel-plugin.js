export default function({ types: t }) {
	return {
		visitor: {
			ImportDeclaration(path) {
				if (path.node.source.value.indexOf('!sofe') >= 0 && path.node.source.value.lastIndexOf('!sofe') === path.node.source.value.length - '!sofe'.length) {
					const sofeServiceName = path.node.source.value.substring(0, path.node.source.value.indexOf('!sofe'));

					path.replaceWithMultiple(
						path.node.specifiers.map(toVariableDeclaration.bind(null, t, sofeServiceName))
					);
				}
			}
		}
	}
}

function toVariableDeclaration(t, sofeServiceName, nodeSpecifier) {
	const synchronousSofeMemberExpr = t.memberExpression(
		t.memberExpression(
			t.identifier('window'),
			t.identifier('__synchronousSofe__')
		),
		t.identifier(sofeServiceName)
	);

	synchronousSofeMemberExpr.property = t.stringLiteral(synchronousSofeMemberExpr.property.name);
	synchronousSofeMemberExpr.computed = true;

	const exportName = nodeSpecifier.type === 'ImportDefaultSpecifier' ? 'default' : nodeSpecifier.imported.name;
	const fullMemberExpr = t.memberExpression(
		synchronousSofeMemberExpr,
		t.identifier(exportName)
	);
	fullMemberExpr.property = t.stringLiteral(fullMemberExpr.property.name);
	fullMemberExpr.computed = true;

	return t.variableDeclaration('var', [
		t.variableDeclarator(
			t.identifier(nodeSpecifier.local.name),
			fullMemberExpr
		)
	]);
}
