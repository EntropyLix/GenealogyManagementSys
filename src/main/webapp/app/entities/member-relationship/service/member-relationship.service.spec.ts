import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMemberRelationship } from '../member-relationship.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../member-relationship.test-samples';

import { MemberRelationshipService } from './member-relationship.service';

const requireRestSample: IMemberRelationship = {
  ...sampleWithRequiredData,
};

describe('MemberRelationship Service', () => {
  let service: MemberRelationshipService;
  let httpMock: HttpTestingController;
  let expectedResult: IMemberRelationship | IMemberRelationship[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MemberRelationshipService);
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

    it('should create a MemberRelationship', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const memberRelationship = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(memberRelationship).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a MemberRelationship', () => {
      const memberRelationship = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(memberRelationship).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a MemberRelationship', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of MemberRelationship', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a MemberRelationship', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMemberRelationshipToCollectionIfMissing', () => {
      it('should add a MemberRelationship to an empty array', () => {
        const memberRelationship: IMemberRelationship = sampleWithRequiredData;
        expectedResult = service.addMemberRelationshipToCollectionIfMissing([], memberRelationship);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(memberRelationship);
      });

      it('should not add a MemberRelationship to an array that contains it', () => {
        const memberRelationship: IMemberRelationship = sampleWithRequiredData;
        const memberRelationshipCollection: IMemberRelationship[] = [
          {
            ...memberRelationship,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMemberRelationshipToCollectionIfMissing(memberRelationshipCollection, memberRelationship);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a MemberRelationship to an array that doesn't contain it", () => {
        const memberRelationship: IMemberRelationship = sampleWithRequiredData;
        const memberRelationshipCollection: IMemberRelationship[] = [sampleWithPartialData];
        expectedResult = service.addMemberRelationshipToCollectionIfMissing(memberRelationshipCollection, memberRelationship);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(memberRelationship);
      });

      it('should add only unique MemberRelationship to an array', () => {
        const memberRelationshipArray: IMemberRelationship[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const memberRelationshipCollection: IMemberRelationship[] = [sampleWithRequiredData];
        expectedResult = service.addMemberRelationshipToCollectionIfMissing(memberRelationshipCollection, ...memberRelationshipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const memberRelationship: IMemberRelationship = sampleWithRequiredData;
        const memberRelationship2: IMemberRelationship = sampleWithPartialData;
        expectedResult = service.addMemberRelationshipToCollectionIfMissing([], memberRelationship, memberRelationship2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(memberRelationship);
        expect(expectedResult).toContain(memberRelationship2);
      });

      it('should accept null and undefined values', () => {
        const memberRelationship: IMemberRelationship = sampleWithRequiredData;
        expectedResult = service.addMemberRelationshipToCollectionIfMissing([], null, memberRelationship, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(memberRelationship);
      });

      it('should return initial array if no MemberRelationship is added', () => {
        const memberRelationshipCollection: IMemberRelationship[] = [sampleWithRequiredData];
        expectedResult = service.addMemberRelationshipToCollectionIfMissing(memberRelationshipCollection, undefined, null);
        expect(expectedResult).toEqual(memberRelationshipCollection);
      });
    });

    describe('compareMemberRelationship', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMemberRelationship(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareMemberRelationship(entity1, entity2);
        const compareResult2 = service.compareMemberRelationship(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareMemberRelationship(entity1, entity2);
        const compareResult2 = service.compareMemberRelationship(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareMemberRelationship(entity1, entity2);
        const compareResult2 = service.compareMemberRelationship(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
