import User from '../models/user.model.js';export async function listUsers(){return User.find().select('-__v').sort({name:1}).lean()}export async function createUser(data){return User.create(data)}
