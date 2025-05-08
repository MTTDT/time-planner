module.exports = {
  rules: {
    'api-endpoint-logging': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Ensure API endpoints contain console.log statements',
          category: 'Best Practices',
          recommended: true,
        },
        schema: [], // no options
      },
      create(context) {
        return {
          CallExpression(node) {
            // Check if this is an Express route handler (app.METHOD)
            if (node.callee.object && 
                node.callee.object.name === 'app' && 
                ['get', 'post', 'put', 'delete', 'patch'].includes(node.callee.property.name)) {
              
              // Get the route path (first argument)
              const routePath = node.arguments[0]?.value;
              
              // Check the callback function (second argument for non-middleware, third for middleware)
              let callback = node.arguments[1];
              if (node.arguments.length > 2 && 
                  (node.arguments[1].name === 'verifyToken' || 
                   node.arguments[1].type === 'Identifier')) {
                callback = node.arguments[2];
              }
              
              // Skip if no callback function found
              if (!callback || !callback.body) return;
              
              // Check for console.log statements in the callback
              const hasConsoleLog = context.getSourceCode()
                .getTokens(callback)
                .some(token => token.value === 'console.log');
              
              if (!hasConsoleLog) {
                context.report({
                  node,
                  message: `API endpoint '${routePath}' should include a console.log statement for debugging`,
                });
              }
            }
          },
        };
      },
    },
  },
};