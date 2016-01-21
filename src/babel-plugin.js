export default function({ types: t }) {
	return {
		visitor: {
			ImportDeclaration(path) {
				if (path.node.source.value.lastIndexOf('!sofe') === path.node.source.value.length - '!sofe'.length) {
					const variableName = t.identifier(path.node.specifiers[0].local.name);
					const sofeServiceName = path.node.source.value.substring(0, path.node.source.value.indexOf('!sofe'));
					const memberExpression = t.memberExpression(
						t.memberExpression(t.identifier('window'), t.identifier('__synchronousSofe__')),
						t.identifier(sofeServiceName)
					);
					memberExpression.property = t.stringLiteral(memberExpression.property.name);
					memberExpression.computed = true;
					path.replaceWith(t.variableDeclaration('var', [
						t.variableDeclarator(
							variableName,
							memberExpression
						)
					]))
					
				}
			}
		}
	}
}
