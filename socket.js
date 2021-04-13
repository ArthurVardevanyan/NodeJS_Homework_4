const xss = require('xss');

const Service = require('./services/service');

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('typingInput', async (inputString) => {
      const searchStrings = await Service.getStartsWith(inputString);
      const sanitizedSearchStrings = [];
      searchStrings.forEach((str) => {
        sanitizedSearchStrings.push({ Name: xss(str.Name) });
      });
      socket.emit('typingInput', sanitizedSearchStrings);
    });

    socket.on('Input', async (inputString) => {
      let input = '';
      try {
        input = await Service.post({ Name: xss(inputString) });
      } catch (e) {
        if (e.code !== 11000) {
          throw e;
        }
      }
      socket.emit(input);
    });

    socket.on('clear', async () => {
      let input = '';
      try {
        input = await Service.deleteAll();
      } catch (e) {
        if (e.code !== 11000) {
          throw e;
        }
      }
      socket.emit(input);
    });
    socket.on('del', async (inputString) => {
      let input = '';
      try {
        input = await Service.deleteString(xss(inputString));
      } catch (e) {
        if (e.code !== 11000) {
          throw e;
        }
      }
      socket.emit(input);
    });
  });
};