const { publicDecrypt, publicEncrypt } = require("crypto");
const net = require("net");
var readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);

const client = net.createConnection({ port: 9898 }, () => {
  console.log("connected to server!");
});

client.on("data", (data) => {
  const msg = data.toString();
  console.log("\nSERVER >> " + msg?.slice(0, 20) + "...");
  handleData(msg);
});

client.on("end", () => {
  console.log("disconnected from server");
});

let SERVER_PUBLIC_KEY = undefined;

const handleData = (message) => {
  if (message.startsWith("public_key:::") && !SERVER_PUBLIC_KEY) {
    SERVER_PUBLIC_KEY = message.replace("public_key:::", "");
    console.log("SERVER_PUBLIC_KEY: " + SERVER_PUBLIC_KEY);
  } else {
    let msg = publicDecrypt(
      SERVER_PUBLIC_KEY,
      Buffer.from(message, "base64")
    ).toString("utf-8");
    console.log("------ >> ", msg + "\n");
  }
};

// request public key
client.write("public_key");

// inputs
rl.on("line", (line) => {
  if (line === "exit") {
    rl.close();
  }
  if (SERVER_PUBLIC_KEY) {
    const encryptedData = publicEncrypt(SERVER_PUBLIC_KEY, Buffer.from(line));
    client.write(encryptedData.toString("base64"));
  } else console.log("waiting for server's public key");
});
