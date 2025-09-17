import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { ProfileUpdateDTO } from './dto/profileUpdate.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
 constructor (@InjectModel(User.name) private userModel:Model<User>){}   


 async userProfile(id:string){
    const findUser = await this.userModel.findById(id)
    if(!findUser) throw new NotFoundException('Not Found User')
        return findUser
 
 }


 async profileUpdate(id:string, data:Partial<ProfileUpdateDTO>){
    const updateData: any = {  };
    
    if (data.name) {
        updateData.name = data.name;
    }

    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }
    const findUser = await this.userModel.findByIdAndUpdate(id,updateData,{new:true}).exec()
    if(!findUser) throw new NotFoundException('Not Found User')
    return findUser
 }
 
}
