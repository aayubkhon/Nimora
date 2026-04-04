module.exports = {
  apps: [{
    name: "NIMORA",
    script: "./server.js",
    watch: false,        
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },
    instances: 1,
    exec_mode: "fork"
  }]
}



// module.exports = {
//   apps: [{
//     name: "NIMORA",
//     script: "./server.js",
//     watch: true,
//     env_production: {
//       NODE_ENV: "production"
//     },
//     env_development: {
//       NODE_ENV: "development"
//     },
//     instances: 1,
//     exec_mode: "cluster"
//   }]
// }