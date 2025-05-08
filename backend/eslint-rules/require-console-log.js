module.exports = {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Require console.log in every route handler',
      },
      schema: [],
    },
    create(context) {
      return {
        CallExpression(node) {
          const isAppRoute =
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'app' &&
            ['get', 'post', 'put', 'delete'].includes(node.callee.property.name);
  
          if (isAppRoute) {
            const handler = node.arguments.find(arg =>
              arg.type === 'FunctionExpression' || arg.type === 'ArrowFunctionExpression'
            );
  
            if (handler && handler.body && handler.body.type === 'BlockStatement') {
              const containsConsoleLog = handler.body.body.some(
                stmt =>
                  stmt.type === 'ExpressionStatement' &&
                  stmt.expression.type === 'CallExpression' &&
                  stmt.expression.callee.type === 'MemberExpression' &&
                  stmt.expression.callee.object.name === 'console' &&
                  stmt.expression.callee.property.name === 'log'
              );
  
              if (!containsConsoleLog) {
                context.report({
                  node,
                  message: 'Each route handler must contain at least one console.log() statement',
                });
              }
            }
          }
        },
      };
    },
  };
  