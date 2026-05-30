import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'quiz_master_super_jwt_token_secret_phrase_xyz', {
    expiresIn: '30d',
  });
};

export default generateToken;
