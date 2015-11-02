import assert from 'power-assert';
import helloWorld from '../src/hello-world';

describe('hello-world', () => {
  it('should return string contain name', () => {
    const result = helloWorld('Ken');
    assert(/Ken/.test(result));
  });
});
