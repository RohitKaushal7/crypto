const net = require("net");

const server = net
  .createServer((socket) => {
    socket.on("data", (data) => {
      const message = data.toString();
      console.log("CLIENT >> " + message);
      handleData(message, socket);
    });
  })
  .on("error", (err) => {
    console.log(err);
  });

server.listen(9898, () => {
  console.log("opened server on ", server.address().port);
});

// Diffie-Helman Key Exchange
const p = 23;
const g = 5;
// Bob
const states = [
  {
    A: undefined,
    b: undefined,
    B: undefined,
    s: undefined,
    step: 0,
  },
];

const handleData = (data, socket) => {
  let state = states[socket.remoteAddress];
  if (!state) {
    states[socket.remoteAddress] = {
      A: undefined,
      b: undefined,
      B: undefined,
      s: undefined,
      step: 0,
    };
    state = states[socket.remoteAddress];
  }

  switch (state.step) {
    case 0:
      state.A = parseInt(data);
      console.log("client's | A =                        " + state.A);
      state.b = Math.floor(Math.random() * p);
      console.log("chosing random secret | b =           " + state.b);
      state.B = Math.pow(g, state.b) % p;
      console.log("B = g^b % p =                         " + state.B);
      socket.write(state.B.toString());
      console.log("SERVER << ", state.B);
      state.s = Math.pow(state.A, state.b) % p;
      console.log(`Server's shared secret = A^b % p =    ${state.s}`);
      server.close();
      break;
  }
};
