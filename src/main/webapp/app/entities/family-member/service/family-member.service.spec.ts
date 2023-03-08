import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFamilyMember } from '../family-member.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../family-member.test-samples';

import { FamilyMemberService, RestFamilyMember } from './family-member.service';

const requireRestSample: RestFamilyMember = {
  ...sampleWithRequiredData,
  birthDate: sampleWithRequiredData.birthDate?.toJSON(),
};

describe('FamilyMember Service', () => {
  let service: FamilyMemberService;
  let httpMock: HttpTestingController;
  let expectedResult: IFamilyMember | IFamilyMember[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FamilyMemberService);
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

    it('should create a FamilyMember', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const familyMember = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(familyMember).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FamilyMember', () => {
      const familyMember = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(familyMember).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FamilyMember', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FamilyMember', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FamilyMember', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFamilyMemberToCollectionIfMissing', () => {
      it('should add a FamilyMember to an empty array', () => {
        const familyMember: IFamilyMember = sampleWithRequiredData;
        expectedResult = service.addFamilyMemberToCollectionIfMissing([], familyMember);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familyMember);
      });

      it('should not add a FamilyMember to an array that contains it', () => {
        const familyMember: IFamilyMember = sampleWithRequiredData;
        const familyMemberCollection: IFamilyMember[] = [
          {
            ...familyMember,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFamilyMemberToCollectionIfMissing(familyMemberCollection, familyMember);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FamilyMember to an array that doesn't contain it", () => {
        const familyMember: IFamilyMember = sampleWithRequiredData;
        const familyMemberCollection: IFamilyMember[] = [sampleWithPartialData];
        expectedResult = service.addFamilyMemberToCollectionIfMissing(familyMemberCollection, familyMember);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familyMember);
      });

      it('should add only unique FamilyMember to an array', () => {
        const familyMemberArray: IFamilyMember[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const familyMemberCollection: IFamilyMember[] = [sampleWithRequiredData];
        expectedResult = service.addFamilyMemberToCollectionIfMissing(familyMemberCollection, ...familyMemberArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const familyMember: IFamilyMember = sampleWithRequiredData;
        const familyMember2: IFamilyMember = sampleWithPartialData;
        expectedResult = service.addFamilyMemberToCollectionIfMissing([], familyMember, familyMember2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(familyMember);
        expect(expectedResult).toContain(familyMember2);
      });

      it('should accept null and undefined values', () => {
        const familyMember: IFamilyMember = sampleWithRequiredData;
        expectedResult = service.addFamilyMemberToCollectionIfMissing([], null, familyMember, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(familyMember);
      });

      it('should return initial array if no FamilyMember is added', () => {
        const familyMemberCollection: IFamilyMember[] = [sampleWithRequiredData];
        expectedResult = service.addFamilyMemberToCollectionIfMissing(familyMemberCollection, undefined, null);
        expect(expectedResult).toEqual(familyMemberCollection);
      });
    });

    describe('compareFamilyMember', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFamilyMember(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareFamilyMember(entity1, entity2);
        const compareResult2 = service.compareFamilyMember(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareFamilyMember(entity1, entity2);
        const compareResult2 = service.compareFamilyMember(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareFamilyMember(entity1, entity2);
        const compareResult2 = service.compareFamilyMember(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
