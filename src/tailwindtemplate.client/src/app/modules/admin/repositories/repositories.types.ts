import { RepoItemType } from 'app/modules/admin/repositories/repositories.enum';

export class RepoItem {
  name: string;
  type: RepoItemType;
  lastCommit: Commit;
  isLoading: boolean;
}

export class Commit {
  revision: number;
  author: string;
  message: string;
  date: Date;
}

export class Branch {
  title: string;
  url: string;
}

export class Repository {
  title: string;
  path: string;
}

export class FileInfo {
  lastCommit: Commit;
  isBinary: boolean;
  content: string;
}

export class CommitChange {
  action: string;
  oldContent: string;
  newContent: string;
  file: string;
  type: number;
  isShowEditor: boolean = false;
}
