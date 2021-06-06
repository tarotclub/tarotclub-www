module.exports = {
  lintOnSave: true,
  devServer: {
    port: 8080, 
    host: '127.0.0.1',
    https: false,
    proxy: {
      '^/api': {
        target: 'https://localhost:443',
        ws: true,
        changeOrigin: true,
        logLevel: "debug",
        onProxyReq: function(request) {
          request.setHeader("origin", "https://localhost:443");
        },
      },
    }
  }
}
