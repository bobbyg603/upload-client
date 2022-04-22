import { AlertColor } from './alert';
import { AlertColorClassNamePipe } from './alert-color-class-name.pipe';

describe('AlertColorClassNamePipe', () => {
  let pipe: AlertColorClassNamePipe;

  beforeEach(() =>  pipe = new AlertColorClassNamePipe());

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return alert-success for AlertColor.Green', () => {
      expect(
        pipe.transform({ color: AlertColor.Green } as any)
      ).toEqual('alert-success');
    });

    it('should return alert-warning for AlertColor.Yellow', () => {
      expect(
        pipe.transform({ color: AlertColor.Yellow } as any)
      ).toEqual('alert-warning');
    });

    it('should return alert-danger for AlertColor.Red', () => {
      expect(
        pipe.transform({ color: AlertColor.Red } as any)
      ).toEqual('alert-danger');
    });
  });
});
