const Account = require('../../models/account.model');
const Chat = require('../../models/chat.model');
const chatSocket = require('../../sockets/admin/chat.socket');

//[GET] api/v1/admin/chat/listUser
module.exports.listUser = async (req, res) => {
  const users = await Account.find({
    deleted: false,
    status: "active",
    role_id: "6568a9f308e5088688d1c345"
  });

  res.render("admin/pages/chat/user.pug", {
    pageTitle: "Danh sách khách hàng",
    users: users,
    account: req.user
  })
}

//[GET] api/v1/admin/chat/detail/?token&tokenUser
module.exports.indexAdmin = async (req, res) => {
  //socket.io
  chatSocket(req, res);
  //end socket.io

  const account = await Account.findOne({
    token: req.query.tokenUser
  })

  const chats = await Chat.find({
    deleted: false,
    $or: [{ account_receive: account.id },
    { account_send: account.id }]
  });

  for (const chat of chats) {
    let infoUser;
    if (chat.account_receive != "") {
      infoUser = {
        fullName: "Hệ thống"
      }
    } else {
      infoUser = await Account.findOne({
        _id: chat.account_send
      }).select("fullName");
    }
    chat.infoUser = infoUser;
  }

  res.render('admin/pages/chat/index.pug', {
    pageTitle: "Chat",
    chats: chats,
    user: req.user
  })
}

//[GET] api/v1/chat
module.exports.indexClient = async (req, res) => {
  //socket.io
  chatSocket(req, res);
  //end socket.io

  const account = await Account.findOne({
    token: req.query.token
  })

  const chats = await Chat.find({
    deleted: false,
    $or: [{ account_receive: account.id },
    { account_send: account.id }]
  });

  const infoUser = {
    fullName: "Hệ thống"
  }
  for (const chat of chats) {
    chat.infoUser = infoUser;
  }

  res.render('admin/pages/chat/index.pug', {
    pageTitle: "Chat",
    chats: chats,
    user: req.user
  })
}

