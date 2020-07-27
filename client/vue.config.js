module.exports = {
  lintOnSave: true,
  devServer: {
    port: 8080, 
    host: '127.0.0.1',
    https: false,
    proxy: {
      '^/api': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
        onProxyReq: function(request) {
          request.setHeader("origin", "http://localhost:5000");
        },
      },
    }
  }
}
