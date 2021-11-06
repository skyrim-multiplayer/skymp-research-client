export class SkympClientGameDataSettings {
  constructor(
    public profileId?: number,
  ) { }
}

export class SkympClientSettings {
  constructor(
    public serverIp?: string,
    public serverPort?: number,
    public gameData?: SkympClientGameDataSettings,
    public showMe?: boolean,
    public showClones?: boolean,
  ) { }
}
