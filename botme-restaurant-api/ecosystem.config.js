module.exports = {
  apps: [
    {
      name: "botme-restaurant-api",
      script: "dist/server.js",
      watch: false,
      env: {
        "PORT": 3100,
        "NODE_ENV": "development"
      },
      env_production: {
        "PORT": 3100,
        "NODE_ENV": "production",
      }
    }
  ]
}

