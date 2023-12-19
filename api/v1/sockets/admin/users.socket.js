// const User = require("../../models/user.model");
// const RoomChat = require("../../models/room-chat.model");

// module.exports = async (res) => {
//   _io.once("connection", async (socket) => {
//     const myUserId = res.locals.user.id;

//     //A gửi lời mời kết bạn cho B
//     socket.on("CLIENT_ADD_FRIEND", async (userId) => {
//       // myUserId : Id cua A
//       // userId : Id cua B
//       //Thêm B vào requestFriends của A
//       const existIdBinA = await User.findOne({
//         _id: myUserId,
//         requestFriends: userId
//       })

//       if (!existIdBinA) {
//         await User.updateOne({
//           _id: myUserId
//         }, {
//           $push: { requestFriends: userId }
//         })
//       }

//       //Thêm A vào acceptFriends của B
//       const existIdAinB = await User.findOne({
//         _id: userId,
//         acceptFriends: myUserId
//       });

//       if (!existIdAinB) {
//         await User.updateOne({
//           _id: userId
//         }, {
//           $push: { acceptFriends: myUserId }
//         });
//       }

//       //Tìm độ dài mảng acceptFriends của B
//       const userB = await User.findOne({
//         _id: userId
//       }).select("acceptFriends");

//       const acceptFriendLength = userB.acceptFriends.length;

//       socket.broadcast.emit("SERVER_RETURN_ACCEPT_LENGTH", {
//         acceptFriendLength: acceptFriendLength,
//         userId: userId
//       });

//       const userA = await User.findOne({
//         _id: myUserId
//       }).select("id fullName avatar acceptFriends");

//       socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
//         userA: userA,
//         userId: userId
//       });
//     })

//     //A hủy gửi yêu cầu kết bạn với B
//     socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
//       //userId : Id của B
//       //myUserId : Id của A
//       //Xóa id của B trong request của A
//       const existIdBinA = await User.findOne({
//         _id: myUserId,
//         requestFriends: userId
//       });

//       if (existIdBinA) {
//         await User.updateOne({
//           _id: myUserId,
//         }, {
//           $pull: { requestFriends: userId }
//         })
//       }
//       //Xóa id của A trong accept của B
//       const existIdAinB = await User.findOne({
//         _id: userId,
//         acceptFriends: myUserId
//       });

//       if (existIdAinB) {
//         await User.updateOne({
//           _id: userId,
//         }, {
//           $pull: { acceptFriends: myUserId }
//         })
//       }

//       //Tìm độ dài mảng acceptFriends của B
//       const userB = await User.findOne({
//         _id: userId
//       }).select("acceptFriends");

//       const acceptFriendLength = userB.acceptFriends.length;

//       socket.broadcast.emit("SERVER_RETURN_ACCEPT_LENGTH", {
//         acceptFriendLength: acceptFriendLength,
//         userId: userId
//       });

//       const userA = await User.findOne({
//         _id: myUserId
//       }).select("id fullName avatar acceptFriends");

//       socket.broadcast.emit("SERVER_RETURN_CANCEL_REQUEST_FRIEND", {
//         user: userA,
//         userId: userId
//       })

//     })
//     //End A hủy gửi yêu cầu kết bạn với B

//     //B xóa lời mời kết bạn của A
//     socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
//       //userId : Id của A
//       //myUserId : Id của B
//       //Xóa id của A trong acceptFriends của B
//       const existIdAinB = await User.findOne({
//         _id: myUserId,
//         acceptFriends: userId
//       });

//       if (existIdAinB) {
//         await User.updateOne({
//           _id: myUserId
//         }, {
//           $pull: {
//             acceptFriends: userId
//           }
//         })
//       }
//       //Xóa id của B trong requestFriends của A
//       const existIdBinA = await User.findOne({
//         _id: userId,
//         requestFriends: myUserId
//       });

//       if (existIdBinA) {
//         await User.updateOne({
//           _id: userId
//         }, {
//           $pull: {
//             requestFriends: myUserId
//           }
//         })
//       }
//     })
//     //End B xóa lời mời của A

//     //B chấp nhận lời mời kết bạn của A
//     socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
//       //console.log(userId); // Id của A
//       //console.log(myUserId); //Id của B

//       //Kiểm tra tồn tại không
//       const existIdAinB = await User.findOne({
//         _id: myUserId,
//         acceptFriends: userId
//       })

//       const existIdBinA = await User.findOne({
//         _id: userId,
//         requestFriends: myUserId
//       });
//       //End kiểm tra tồn tại

//       let roomChat;
//       if (existIdAinB && existIdBinA) {
//         //Tạo room chat
//         const dataRoom = {
//           typeRoom: "friend",
//           users: [{
//             user_id: userId,
//             role: "superAdmin"
//           }, {
//             user_id: myUserId,
//             role: "superAdmin"
//           }]
//         }

//         roomChat = new RoomChat(dataRoom);
//         await roomChat.save();
//       }

//       // Xóa id của A trong acceptFriends của B
//       // Thêm {user_id, room_chat_id} của A vào friendList của B

//       if (existIdAinB) {
//         await User.updateOne({
//           _id: myUserId,
//         }, {
//           $pull: { acceptFriends: userId },
//           $push: {
//             friendList: {
//               user_id: userId,
//               room_id: roomChat.id
//             }
//           }
//         })
//       }

//       // Xóa id của B trong requestFriends của A
//       // Thêm {user_id, room_chat_id} của B vào friendList của A
//       if (existIdBinA) {
//         await User.updateOne({
//           _id: userId
//         }, {
//           $pull: { requestFriends: myUserId },
//           $push: {
//             friendList: {
//               user_id: myUserId,
//               room_id: roomChat.id
//             }
//           }
//         })
//       }
//     })
//     //End B chấp nhận lời mời của A

//   })
// }