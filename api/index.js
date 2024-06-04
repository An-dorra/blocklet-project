require('dotenv-flow').config();
require('express-async-errors');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const fallback = require('@blocklet/sdk/lib/middlewares/fallback');

const { name, version } = require('../package.json');
const logger = require('./libs/logger');

const app = express();

app.set('trust proxy', true);
app.use(cookieParser());
app.use(express.json({ limit: '1 mb' }));
app.use(express.urlencoded({ extended: true, limit: '1 mb' }));
app.use(cors());

const router = express.Router();
router.use('/api', require('./routes'));
app.use(router);

const isProduction = process.env.NODE_ENV === 'production' || process.env.ABT_NODE_SERVICE_ENV === 'production';

app.post('/writeUserInfo', (req, res) => {
  const userData = req.body; 
  const filePath = path.resolve(__dirname, '../public', 'static', 'userInfo.json');

  const jsonData = JSON.stringify(userData);

  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('写入文件失败');
    } else {
      console.log('数据写入成功');
      res.status(200).send('写入成功');
    }
  });
});
app.get('/getUserInfo', (req, res) => {
  const filePath = path.join(__dirname, '../public', 'static', 'userInfo.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('读取文件失败');
    } else {
      const userData = JSON.parse(data);
      res.status(200).json(userData); 
    }
  });
});



if (isProduction) {
  const staticDir = path.resolve(__dirname, '../dist');
  app.use(express.static(staticDir, { maxAge: '30d', index: false }));
  app.use(fallback('index.html', { root: staticDir }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
  });
}

const port = parseInt(process.env.BLOCKLET_PORT, 10);

const server = app.listen(port, (err) => {
  if (err) throw err;
  logger.info(`> ${name} v${version} ready on ${port}`);
});

module.exports = {
  app,
  server,
};
