import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHvAuth } from '../hv-auth.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../hv-auth.test-samples';

import { HvAuthService } from './hv-auth.service';

const requireRestSample: IHvAuth = {
  ...sampleWithRequiredData,
};

describe('HvAuth Service', () => {
  let service: HvAuthService;
  let httpMock: HttpTestingController;
  let expectedResult: IHvAuth | IHvAuth[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HvAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a HvAuth', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const hvAuth = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(hvAuth).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HvAuth', () => {
      const hvAuth = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(hvAuth).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HvAuth', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HvAuth', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a HvAuth', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHvAuthToCollectionIfMissing', () => {
      it('should add a HvAuth to an empty array', () => {
        const hvAuth: IHvAuth = sampleWithRequiredData;
        expectedResult = service.addHvAuthToCollectionIfMissing([], hvAuth);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hvAuth);
      });

      it('should not add a HvAuth to an array that contains it', () => {
        const hvAuth: IHvAuth = sampleWithRequiredData;
        const hvAuthCollection: IHvAuth[] = [
          {
            ...hvAuth,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHvAuthToCollectionIfMissing(hvAuthCollection, hvAuth);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HvAuth to an array that doesn't contain it", () => {
        const hvAuth: IHvAuth = sampleWithRequiredData;
        const hvAuthCollection: IHvAuth[] = [sampleWithPartialData];
        expectedResult = service.addHvAuthToCollectionIfMissing(hvAuthCollection, hvAuth);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hvAuth);
      });

      it('should add only unique HvAuth to an array', () => {
        const hvAuthArray: IHvAuth[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const hvAuthCollection: IHvAuth[] = [sampleWithRequiredData];
        expectedResult = service.addHvAuthToCollectionIfMissing(hvAuthCollection, ...hvAuthArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hvAuth: IHvAuth = sampleWithRequiredData;
        const hvAuth2: IHvAuth = sampleWithPartialData;
        expectedResult = service.addHvAuthToCollectionIfMissing([], hvAuth, hvAuth2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hvAuth);
        expect(expectedResult).toContain(hvAuth2);
      });

      it('should accept null and undefined values', () => {
        const hvAuth: IHvAuth = sampleWithRequiredData;
        expectedResult = service.addHvAuthToCollectionIfMissing([], null, hvAuth, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hvAuth);
      });

      it('should return initial array if no HvAuth is added', () => {
        const hvAuthCollection: IHvAuth[] = [sampleWithRequiredData];
        expectedResult = service.addHvAuthToCollectionIfMissing(hvAuthCollection, undefined, null);
        expect(expectedResult).toEqual(hvAuthCollection);
      });
    });

    describe('compareHvAuth', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHvAuth(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareHvAuth(entity1, entity2);
        const compareResult2 = service.compareHvAuth(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareHvAuth(entity1, entity2);
        const compareResult2 = service.compareHvAuth(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareHvAuth(entity1, entity2);
        const compareResult2 = service.compareHvAuth(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
