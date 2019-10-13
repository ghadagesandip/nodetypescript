module.exports = {
  apps : [{
    name: 'API',
    script: './node_modules/.bin/ts-node',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'server.ts',
    instances: 'max',
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    error_file: 'err.log',
    out_file: 'out.log',
    log_file: 'combined.log',
    env: {
      NODE_ENV: 'development',
      MONGO_URL: 'mongodb+srv://nodetypescript:sandip123@cluster0-enfms.mongodb.net/test?retryWrites=true&w=majority',
      PORT:3030,
      SECRET: 'f395ac4b864c6b095',
      ADMIN_SECRET: '590b6c468b4ca593f',
      STRIPE_PAYMENT_GATEWAY_SECRET:'sk_test_lySS8oQNcQpaCptibMFreCP300Z6sf3bHp',
      STRIPE_PAYMENT_CURRENCY_CODE:'inr',
      NODE_ENV:'development',
      EMAIL_HOST:'smtp.gmail.com',
      EMAIL_PORT:465,
      EMAIL_SECURE:true,
      EMAIL_FROM:'nodemongoapp@yopmail.com',
      EMAIL_USERNAME:'sandipghadge874@gmail.com',
      EMAIL_PASS:'sandipg23'
    }
  }],
};
