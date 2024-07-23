export class Breadcrumb {
  title: string;
  link: string;
  current: boolean;
}

export class RepositoryInformation {
  commitsCount: number;
  authors: string[];
  svnUrl: string;
  dateCreate: Date;
}