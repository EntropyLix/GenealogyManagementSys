import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('FamilyMember e2e test', () => {
  const familyMemberPageUrl = '/family-member';
  const familyMemberPageUrlPattern = new RegExp('/family-member(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const familyMemberSample = {
    name: 'Chips Consultant content',
    gender: 'modular Officer indexing',
    age: 85537,
    address: 'Optimization Mobility',
    birthDate: '2023-02-08T05:31:06.899Z',
  };

  let familyMember;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/family-members+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/family-members').as('postEntityRequest');
    cy.intercept('DELETE', '/api/family-members/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (familyMember) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/family-members/${familyMember.id}`,
      }).then(() => {
        familyMember = undefined;
      });
    }
  });

  it('FamilyMembers menu should load FamilyMembers page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('family-member');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('FamilyMember').should('exist');
    cy.url().should('match', familyMemberPageUrlPattern);
  });

  describe('FamilyMember page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(familyMemberPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create FamilyMember page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/family-member/new$'));
        cy.getEntityCreateUpdateHeading('FamilyMember');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyMemberPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/family-members',
          body: familyMemberSample,
        }).then(({ body }) => {
          familyMember = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/family-members+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/family-members?page=0&size=20>; rel="last",<http://localhost/api/family-members?page=0&size=20>; rel="first"',
              },
              body: [familyMember],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(familyMemberPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details FamilyMember page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('familyMember');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyMemberPageUrlPattern);
      });

      it('edit button click should load edit FamilyMember page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FamilyMember');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyMemberPageUrlPattern);
      });

      it('edit button click should load edit FamilyMember page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('FamilyMember');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyMemberPageUrlPattern);
      });

      it('last delete button click should delete instance of FamilyMember', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('familyMember').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyMemberPageUrlPattern);

        familyMember = undefined;
      });
    });
  });

  describe('new FamilyMember page', () => {
    beforeEach(() => {
      cy.visit(`${familyMemberPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('FamilyMember');
    });

    it('should create an instance of FamilyMember', () => {
      cy.get(`[data-cy="name"]`).type('Quality-focused').should('have.value', 'Quality-focused');

      cy.get(`[data-cy="gender"]`).type('FTP').should('have.value', 'FTP');

      cy.get(`[data-cy="age"]`).type('59784').should('have.value', '59784');

      cy.get(`[data-cy="address"]`).type('viral Practical').should('have.value', 'viral Practical');

      cy.get(`[data-cy="birthDate"]`).type('2023-02-08T01:22').blur().should('have.value', '2023-02-08T01:22');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        familyMember = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', familyMemberPageUrlPattern);
    });
  });
});
