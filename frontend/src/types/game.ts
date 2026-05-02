export type ArcadeGameProps = {
  paused: boolean;
  restartToken?: number;
  onScoreChange: (score: number) => void;
};
