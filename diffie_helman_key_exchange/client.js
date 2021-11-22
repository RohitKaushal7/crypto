const net = require("net");

const client = net.createConnection({ port: 9898 }, () => {
  console.log("connected to server!");
});

client.on("data", (data) => {
  const msg = data.toString();
  console.log("SERVER >> " + msg);
  handleData(msg);
});

client.on("end", () => {
  console.log("disconnected from server");
});

// Diffie-Helman Key Exchange
const p = 23;
const g = 5;
// Alice
const state = {
  a: undefined,
  A: undefined,
  B: undefined,
  s: undefined,
  step: 0,
};

const handleData = (data) => {
  switch (state.step) {
    case 0:
      state.a = Math.floor(Math.random() * p);
      console.log("chosing random secret | a =           " + state.a);
      state.A = Math.pow(g, state.a) % p;
      console.log("A = g^a % p =                         " + state.A);
      client.write(state.A.toString());
      console.log("CLIENT << ", state.A);
      state.step++;
      break;
    case 1:
      state.B = parseInt(data);
      console.log("server's | B =                        " + state.B);
      state.s = Math.pow(state.B, state.a) % p;
      console.log(`Client's shared secret = B^a % p =    ${state.s}`);
      client.end();
      break;
  }
};

handleData("");
