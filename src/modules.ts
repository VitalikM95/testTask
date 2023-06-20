export interface IData {
  comments: IComment[]
  total: number
  skip: number
  limit: number
}

export interface IComment {
  id: number
  body: string
  postId: number
  user: IUser
}

export interface IUser {
  id: number
  username: string
}
