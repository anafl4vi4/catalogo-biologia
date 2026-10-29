import { TestBed } from '@angular/core/testing';
import { LaminasApi } from './laminas-api';

describe('LaminasApi', () => {
  let service: LaminasApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaminasApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
