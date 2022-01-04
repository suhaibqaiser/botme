module.exports = {
  apps : [
      {
        name: "botme-clients-api",
        script: "src/app.js",
        watch: true,
        env: {
            "PORT": 3000,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 3000,
            "NODE_ENV": "production",
        }
      }
  ]
}
