declare module '@elastic/ecs-winston-format' {
  import { Logform } from 'winston';

  interface Options {
    convertReqRes: boolean;
  }

  function ecsFormat(options: Options): Logform.Format;

  export default ecsFormat;
}
