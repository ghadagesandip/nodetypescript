import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PaginateResult, Types } from 'mongoose';
import { Messages } from './../../constants';
import { userModel, UserRole } from './user.model';
import { IUser, IUserRequest } from './user.type';

/**
 * UserLib
 *
 */
export class UserLib {
  public async generateHash(password: string): Promise<string> {
    return bcrypt.hashSync(password, 10);
  }

  public async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compareSync(password, hash);
  }

  public async getUsers(
    filters: any,
    projection: any,
    options: any,
  ): Promise<PaginateResult<IUser>> {
    //return userModel.find(filters, projection, options);
    return userModel.paginate(filters, options);
  }

  public async getUserById(id: string): Promise<IUser> {
    return userModel.findById(id);
  }

  public async saveUser(userData: IUser): Promise<IUser> {
    userData.password = await this.generateHash(userData.password);
    const userObj: IUser = new userModel(userData);

    return userObj.save();
  }

  public async getUserByEmail(email: string): Promise<IUser> {
    return userModel.findOne({ email: email }, '+password');
  }

  /**
   * updateUser
   * @param userId
   * @param userData
   */
  public async updateUser(
    userId: string,
    userData: IUserRequest,
  ): Promise<any> {
    const user: IUser = await userModel.findById(userId);
    user.set(userData);

    return user.save();
  }

  public async removeTokenAndTime(userId: Types.ObjectId): Promise<any> {
    const data: object = {
      tmp_forgot_pass_code: undefined,
      tmp_forgot_pass_datetime: undefined,
    };
    await userModel.findByIdAndUpdate(userId, {$set: data}, { new: true});
  }

  public async checkToken(token: number): Promise<IUser> {
    return userModel.findOne({tmp_forgot_pass_code: token});
  }

  public async deleteUser(id: string): Promise<IUser> {
    return userModel.findOneAndDelete({ _id: id });
  }

  public async checkExpiry(user: IUserRequest): Promise<string> {
    const diff: number = ((new Date().getTime() / 1000) - (new Date(user.tmp_forgot_pass_datetime).getTime() / 1000)) / 60;
    if (diff < 30) {
      return jwt.sign({ id: user._id}, process.env.FORGOT_PASS_SECRET, {
        expiresIn: '1h',
      });
    } else {
      return Messages.TOKEN_EXPIRED;
    }
  }

  public async loginUserAndCreateToken(
    email: string,
    password: string,
  ): Promise<any> {
    let user: IUser = await this.getUserByEmail(email);
    user = JSON.parse(JSON.stringify(user));
    if (user !== null) {
      const isValidPass: boolean = await this.comparePassword(
        password,
        user.password,
      );
      if (isValidPass) {
        let token: string;
        if (user.userRole === UserRole.admin) {
          token = jwt.sign({ id: user._id, userRole: user.userRole }, process.env.ADMIN_SECRET, {
            expiresIn: '24h',
          });
          user.password = undefined;
        } else {
          token = jwt.sign({ id: user._id, userRole: user.userRole }, process.env.SECRET, {
            expiresIn: '24h',
          });
          user.password = undefined;
        }

        return { user, token };
      } else {
        throw new Error(Messages.INVALID_CREDENTIALS);
      }
    } else {
      throw new Error(Messages.INVALID_CREDENTIALS);
    }
  }
}
