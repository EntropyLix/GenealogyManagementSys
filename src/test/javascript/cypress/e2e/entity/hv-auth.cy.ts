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

describe('HvAuth e2e test', () => {
  const hvAuthPageUrl = '/hv-auth';
  const hvAuthPageUrlPattern = new RegExp('/hv-auth(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const hvAuthSample = { authType: 'copy Multi-tiered function' };

  let hvAuth;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/hv-auths+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/hv-auths').as('postEntityRequest');
    cy.intercept('DELETE', '/api/hv-auths/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (hvAuth) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/hv-auths/${hvAuth.id}`,
      }).then(() => {
        hvAuth = undefined;
      });
    }
  });

  it('HvAuths menu should load HvAuths page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('hv-auth');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('HvAuth').should('exist');
    cy.url().should('match', hvAuthPageUrlPattern);
  });

  describe('HvAuth page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(hvAuthPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create HvAuth page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/hv-auth/new$'));
        cy.getEntityCreateUpdateHeading('HvAuth');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', hvAuthPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/hv-auths',
          body: hvAuthSample,
        }).then(({ body }) => {
          hvAuth = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/hv-auths+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/hv-auths?page=0&size=20>; rel="last",<http://localhost/api/hv-auths?page=0&size=20>; rel="first"',
              },
              body: [hvAuth],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(hvAuthPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details HvAuth page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('hvAuth');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', hvAuthPageUrlPattern);
      });

      it('edit button click should load edit HvAuth page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HvAuth');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', hvAuthPageUrlPattern);
      });

      it('edit button click should load edit HvAuth page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('HvAuth');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', hvAuthPageUrlPattern);
      });

      it('last delete button click should delete instance of HvAuth', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('hvAuth').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', hvAuthPageUrlPattern);

        hvAuth = undefined;
      });
    });
  });

  describe('new HvAuth page', () => {
    beforeEach(() => {
      cy.visit(`${hvAuthPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('HvAuth');
    });

    it('should create an instance of HvAuth', () => {
      cy.get(`[data-cy="authType"]`).type('District Berkshire').should('have.value', 'District Berkshire');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        hvAuth = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', hvAuthPageUrlPattern);
    });
  });
});
