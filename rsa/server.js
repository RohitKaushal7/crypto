const { privateDecrypt, privateEncrypt } = require("crypto");
const net = require("net");
const { publicKey, privateKey } = require("./keys");

const server = net
  .createServer((socket) => {
    socket.on("data", (data) => {
      const message = data.toString();
      console.log("\nCLIENT >> " + message?.slice(0, 20) + "...");
      handleData(message, socket);
    });
  })
  .on("error", (err) => {
    console.log(err);
  });

server.listen(9898, () => {
  console.log("opened server on ", server.address().port);
});

const handleData = (message, socket) => {
  if (message === "public_key") {
    console.log("shared public key with client");
    socket.write("public_key:::" + publicKey);
  } else {
    const decryptedData = privateDecrypt(
      privateKey,
      Buffer.from(message, "base64")
    );
    let msg = decryptedData.toString("utf-8");
    console.log("------ >> " + msg);
    socket.write(
      privateEncrypt(privateKey, Buffer.from("You Said : " + msg)).toString(
        "base64"
      )
    );
  }
};
