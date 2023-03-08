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

describe('Family e2e test', () => {
  const familyPageUrl = '/family';
  const familyPageUrlPattern = new RegExp('/family(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const familySample = { familyName: 'Granite red aggregate' };

  let family;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/families+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/families').as('postEntityRequest');
    cy.intercept('DELETE', '/api/families/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (family) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/families/${family.id}`,
      }).then(() => {
        family = undefined;
      });
    }
  });

  it('Families menu should load Families page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('family');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Family').should('exist');
    cy.url().should('match', familyPageUrlPattern);
  });

  describe('Family page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(familyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Family page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/family/new$'));
        cy.getEntityCreateUpdateHeading('Family');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/families',
          body: familySample,
        }).then(({ body }) => {
          family = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/families+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/families?page=0&size=20>; rel="last",<http://localhost/api/families?page=0&size=20>; rel="first"',
              },
              body: [family],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(familyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Family page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('family');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyPageUrlPattern);
      });

      it('edit button click should load edit Family page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Family');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyPageUrlPattern);
      });

      it('edit button click should load edit Family page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Family');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyPageUrlPattern);
      });

      it('last delete button click should delete instance of Family', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('family').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', familyPageUrlPattern);

        family = undefined;
      });
    });
  });

  describe('new Family page', () => {
    beforeEach(() => {
      cy.visit(`${familyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Family');
    });

    it('should create an instance of Family', () => {
      cy.get(`[data-cy="familyName"]`).type('transmitting').should('have.value', 'transmitting');

      cy.get(`[data-cy="description"]`).type('haptic mission-critical').should('have.value', 'haptic mission-critical');

      cy.get(`[data-cy="pic"]`).type('Central').should('have.value', 'Central');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        family = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', familyPageUrlPattern);
    });
  });
});
