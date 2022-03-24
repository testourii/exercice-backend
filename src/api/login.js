const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();
/**
 * @swagger
 * /api/v1/login:
 *    post:
 *        description: This API for authenticate users by typing email and password
 *        consumes:
 *        - application/json
 *        produces:
 *        - application/json
 *        - application/xml
 *        parameters:
 *        - in: body
 *          name: User cerdentials
 *          schema:
 *            $ref: '#/definitions/userCerdentials'
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
 *     userCerdentials:
 *        type: object
 *        required:
 *        - email
 *        - password
 *        properties:
 *            email:
 *                    type: string
 *                    example: we-settle@gmail.com
 *            password:
 *                    type: string
 *                    example: admin
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("---------------------");
  console.log(req.body);

  const userWithEmail = await User.findOne({ where: { email } }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );

  if (!userWithEmail)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  if (userWithEmail.password !== password)
    return res
      .status(400)
      .json({ message: "Email or password does not match!" });

  const jwtToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_SECRET
  );

  res.json({ message: "Welcome Back!", token: jwtToken });
});

module.exports = router;
