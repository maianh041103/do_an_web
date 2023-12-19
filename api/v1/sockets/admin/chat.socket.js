const uploadImagesToCloundHelper = require('../../../../helper/uploadImagesToClound.helper');
const Account = require('../../models/account.model');
const Chat = require('../../models/chat.model');

module.exports = (req, res) => {
  let account_send;
  let account_receive;
  let fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (result) => {
      let images = [];
      for (const image of result.images) {
        const link = await uploadImagesToCloundHelper(image);
        images.push(link);
      }
      if (req.user.role_id === '6568a9f308e5088688d1c345') {
        account_send = req.user.id;
        account_receive = "";
        fullName = req.user.fullName;
      } else {
        const token = req.query.tokenUser;
        const accountUser = await Account.findOne({
          token: token,
          deleted: false,
          status: "active"
        })
        account_receive = accountUser.id;
        account_send = "";
        fullName = "Hệ thống"
      }
      const chat = new Chat({
        account_send: account_send,
        account_receive: account_receive,
        content: result.content,
        images: images,
      });
      await chat.save();

      //Trả data về
      const data = {
        account_send: account_send,
        account_receive: account_receive,
        fullName: fullName,
        content: result.content,
        images: images,
      }
      _io.emit("SERVER_RETURN_MESSAGE", data);
    })

    //send typing
    socket.on("CLIENT_SEND_TYPING", (type) => {
      if (req.user.role_id === '6568a9f308e5088688d1c345') {
        fullName = req.user.fullName;
      } else {
        fullName = "Hệ thống"
      }

      const userInfo = {
        account_send: account_send,
        fullName: fullName,
        type: type
      }
      socket.broadcast.emit("SERVER_RETURN_TYPING", userInfo)
    })
  })
}