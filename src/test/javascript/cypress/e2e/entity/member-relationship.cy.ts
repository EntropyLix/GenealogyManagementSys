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

describe('MemberRelationship e2e test', () => {
  const memberRelationshipPageUrl = '/member-relationship';
  const memberRelationshipPageUrlPattern = new RegExp('/member-relationship(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const memberRelationshipSample = { relationshipName: 'synthesize deliverables yellow' };

  let memberRelationship;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/member-relationships+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/member-relationships').as('postEntityRequest');
    cy.intercept('DELETE', '/api/member-relationships/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (memberRelationship) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/member-relationships/${memberRelationship.id}`,
      }).then(() => {
        memberRelationship = undefined;
      });
    }
  });

  it('MemberRelationships menu should load MemberRelationships page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('member-relationship');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('MemberRelationship').should('exist');
    cy.url().should('match', memberRelationshipPageUrlPattern);
  });

  describe('MemberRelationship page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(memberRelationshipPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create MemberRelationship page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/member-relationship/new$'));
        cy.getEntityCreateUpdateHeading('MemberRelationship');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', memberRelationshipPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/member-relationships',
          body: memberRelationshipSample,
        }).then(({ body }) => {
          memberRelationship = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/member-relationships+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/member-relationships?page=0&size=20>; rel="last",<http://localhost/api/member-relationships?page=0&size=20>; rel="first"',
              },
              body: [memberRelationship],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(memberRelationshipPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details MemberRelationship page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('memberRelationship');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', memberRelationshipPageUrlPattern);
      });

      it('edit button click should load edit MemberRelationship page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MemberRelationship');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', memberRelationshipPageUrlPattern);
      });

      it('edit button click should load edit MemberRelationship page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('MemberRelationship');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', memberRelationshipPageUrlPattern);
      });

      it('last delete button click should delete instance of MemberRelationship', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('memberRelationship').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', memberRelationshipPageUrlPattern);

        memberRelationship = undefined;
      });
    });
  });

  describe('new MemberRelationship page', () => {
    beforeEach(() => {
      cy.visit(`${memberRelationshipPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('MemberRelationship');
    });

    it('should create an instance of MemberRelationship', () => {
      cy.get(`[data-cy="relationshipName"]`).type('Integration grid-enabled').should('have.value', 'Integration grid-enabled');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        memberRelationship = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', memberRelationshipPageUrlPattern);
    });
  });
});
