import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

  private async hashPassword(password: string) {
    const saltOrRounds = 10;
    const salt = bcrypt.genSaltSync(saltOrRounds);

    return bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto, isApprove = false) {
    const password = await this.hashPassword(createUserDto.password);
    delete createUserDto.confirm_password;
    const payload = await this.userModel.save({
      ...createUserDto,
      password,
      isApprove,
    });
    return payload;
  }

  async findAll() {
    const user = await this.userModel.find({
      relations: ['profile', 'setting'],
    });
    return user;
  }

  async findOnlyDeleted() {
    const user = await this.userModel.find({
      relations: ['profile', 'setting'],
      where: { deletedAt: Not(IsNull()) },
      withDeleted: true,
    });
    return user;
  }

  async findById(id: string) {
    const user = await this.userModel.findOne({
      relations: ['profile', 'setting'],
      where: { id },
    });
    if (user) {
      delete user.password;
    }
    return user;
  }

  async findOne(query: object) {
    return this.userModel.findOne({
      relations: ['profile', 'setting'],
      where: query,
    });
  }

  async approve(id: string) {
    return this.userModel.save({ id, isApprove: true });
  }

  async restore(id: string) {
    await this.userModel.restore({ id });
    return this.findById(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }
    return this.userModel.save({ id, ...updateUserDto });
  }

  async findDeletedById(id: string) {
    return this.userModel.findOne({
      relations: ['profile', 'setting'],
      where: { id },
      withDeleted: true,
    });
  }

  async remove(id: string) {
    await this.userModel.softDelete({ id });
    return this.findDeletedById(id);
  }
}
