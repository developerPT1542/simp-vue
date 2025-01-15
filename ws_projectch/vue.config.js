const { defineConfig } = require('@vue/cli-service')
module.exports = {
    "devServer": {
        "port": 8080,
        // "https": true,
        "proxy": {
            "^/api": {
                "target": "http://localhost:3001",
                "changeOrigin": true
            }
        }
    }
}
