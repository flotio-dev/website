export interface Root {
  status: string
  code: number
  details: Details
}

export interface Details {
  repositories: Repository[]
}

export interface Repository {
  id: number
  owner: string
  name: string
  full_name: string
  private: boolean
}
