const express = require("express");
const User = require("../models/user");

const router = express.Router();

/**
 * @swagger
 * /api/v1/register:
 *    post:
 *        description: This API for register users by typing full name, email and password
 *        consumes:
 *        - application/json
 *        produces:
 *        - application/json
 *        parameters:
 *        - in: body
 *          name: User infos
 *          schema:
 *            $ref: '#/definitions/userinfos'
 *        responses:
 *            200:
 *               description: Successfully login
 *               schema:
 *                 properties:
 *                   status:
 *                     type: string
 *                   data:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                       token:
 *                         type: string
 *            400:
 *                description: Email or password does not match!
 *            500:
 *                description: internal server error
 * definitions:
 *     userinfos:
 *        type: object
 *        required:
 *        - fullName
 *        - email
 *        - password
 *        properties:
 *            fullName:
 *                    type: string
 *                    example: houcem testouri
 *            email:
 *                    type: string
 *                    example: houcem.testouri@gmail.com
 *            password:
 *                    type: string
 *                    example: azerty
 */
router.post("/register", async (req, res) => {
  const { fullName, email, password } = req.body;

  const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (alreadyExistsUser) {
    return res.status(409).json({ message: "User with email already exists!" });
  }

  const newUser = new User({ fullName, email, password });
  const savedUser = await newUser.save().catch((err) => {
    console.log("Error: ", err);
    res.status(500).json({ error: "Cannot register user at the moment!" });
  });

  if (savedUser) res.json({ message: "Thanks for registering" });
});

module.exports = router;
