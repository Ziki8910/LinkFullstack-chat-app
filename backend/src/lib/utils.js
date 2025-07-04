import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // 'Lax' allows cookie on POST
    secure: process.env.NODE_ENV === "production", // Secure only in prod
  });

  return token;
};




// export const generateToken = (userId, res) => {
//   const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.cookie("jwt", token, {
//     maxAge: 7 * 24 * 60 * 60 * 1000, 
//     httpOnly: true, 
//     sameSite: "strict", 
//     secure: process.env.NODE_ENV !== "development",
//   });

//   return token;
// };
