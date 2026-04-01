module.exports = {
  apps: [{
    name: "NIMORA",
    script: "./server.js",
    watch: true,
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },
    instances: 2,
    exec_mode: "cluster"
  }]
}