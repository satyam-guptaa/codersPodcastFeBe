const Jimp = require("jimp")
const path = require("path")
const userService = require("../services/user-service")
const UserDto = require("../dtos/user-dto")

class ActivateContoller {
  async activate(req, res) {
    const { name, image } = req.body
    if (!name || !image) {
      return res.status(400).json({ message: "All fields are required" })
    }
    const buffer = Buffer.from(
      image.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    )
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`
    //image compressor jimp
    try {
      const jimResp = await Jimp.read(buffer)
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/${imagePath}`))
    } catch (error) {
      return res.status(500).json({ message: "Could not process the Image" })
    }
    const userId = req.user._id
    //update user
    try {
      const user = await userService.findUser({ _id: userId })
      if (!user) {
        return res.status(404).json({ message: "User not found!" })
      }
      user.activated = true
      user.name = name
      user.avatar = `/storage/${imagePath}`
      user.save()
      return res.json({ user: new UserDto(user), auth: true })
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" })
    }
  }
}

module.exports = new ActivateContoller()
