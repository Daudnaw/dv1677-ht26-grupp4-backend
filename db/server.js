import app from './app.js'

const startServer = async () => {
  const PORT = process.env.PORT || 3000;

  return app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const server = await startServer();

export default server;