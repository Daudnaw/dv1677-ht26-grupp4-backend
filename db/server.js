import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js'

const PORT = process.env.PORT || 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('ansluten:', socket.id);

 socket.on('join', (dokumentId) => {
    const room = `doc:${dokumentId}`

    socket.join(room)
})

 socket.on('redigera', ({ doc, text }) => {
    socket.to(`doc:${doc}`).emit('uppdatering', text)
  })

  socket.on('disconnect', () => {
    console.log('frånkopplad:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;